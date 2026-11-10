import { can } from '@/lib/rbac'
import { formatTZS } from '@/lib/money'
import { getRentStatus } from '@/lib/rentStatus'
import type { User } from '@/types'
import { recordEvent } from './eventLog'
import { getLeaseStatus } from './leaseService'
import { fail, leaseResource, ok, validateText } from './shared'
import { getState, updateState } from './store'
import type { Lease, MaintenanceTicket, RentPayment, Result } from '@/types/management'

export { buildRentSchedule } from './rentSchedule'
export { getRentStatus } from '@/lib/rentStatus'

const METHOD_MAX_LENGTH = 40
const ENDING_SOON_DAYS = 60
const DAY_MS = 24 * 60 * 60 * 1000

function newReference(): string {
  return `PL-RENT-${Math.floor(1000 + Math.random() * 9000)}${Date.now().toString().slice(-4)}`
}

export function payRent(actor: User, paymentId: string, method: string): Result<RentPayment> {
  const payment = getState().payments.find(item => item.id === paymentId)
  if (!payment) return fail('not_found')
  const lease = getState().leases.find(item => item.id === payment.leaseId)
  if (!lease) return fail('not_found')
  if (!can(actor, 'rent.pay', leaseResource(lease))) return fail('forbidden')
  if (payment.paidDate || getLeaseStatus(lease) !== 'active') return fail('invalid_transition')
  const invalid = validateText(method, METHOD_MAX_LENGTH)
  if (invalid) return fail(invalid)

  const paid: RentPayment = { ...payment, paidDate: new Date().toISOString(), method: method.trim(), reference: newReference() }
  updateState(state => ({ ...state, payments: state.payments.map(item => (item.id === paid.id ? paid : item)) }))
  recordEvent({
    propertyId: lease.propertyId,
    type: 'rent_paid',
    actor: { id: actor.id, name: actor.name, role: 'tenant' },
    relatedId: paid.id,
    params: { amount: formatTZS(paid.amount) },
  })
  return ok(paid)
}

export function sortByDueDate(payments: readonly RentPayment[]): RentPayment[] {
  return [...payments].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
}

export function findNextRent(payments: readonly RentPayment[]): RentPayment | undefined {
  return sortByDueDate(payments).find(payment => !payment.paidDate)
}

export interface LedgerTotals {
  collected: number
  outstanding: number
  overdue: number
}

export function ledgerTotals(payments: readonly RentPayment[], today: Date = new Date()): LedgerTotals {
  const totals: LedgerTotals = { collected: 0, outstanding: 0, overdue: 0 }
  for (const payment of payments) {
    const status = getRentStatus(payment, today)
    if (status === 'paid') {
      totals.collected += payment.amount
      continue
    }
    if (status === 'upcoming') continue
    totals.outstanding += payment.amount
    if (status === 'overdue') totals.overdue += payment.amount
  }
  return totals
}

export interface OwnerSummary {
  collectedThisMonth: number
  outstanding: number
  openTickets: number
  endingSoon: number
}

interface SummaryInput {
  leases: readonly Lease[]
  payments: readonly RentPayment[]
  tickets: readonly MaintenanceTicket[]
  ownerId: string
  today?: Date
}

export function selectOwnerSummary({ leases, payments, tickets, ownerId, today = new Date() }: Readonly<SummaryInput>): OwnerSummary {
  const ownLeases = leases.filter(lease => lease.ownerId === ownerId || lease.managerId === ownerId)
  const leaseIds = new Set(ownLeases.map(lease => lease.id))
  const ownPayments = payments.filter(payment => leaseIds.has(payment.leaseId))
  const sameMonth = (iso: string) => {
    const date = new Date(iso)
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()
  }
  const collectedThisMonth = ownPayments
    .filter(payment => payment.paidDate && sameMonth(payment.paidDate))
    .reduce((sum, payment) => sum + payment.amount, 0)
  const totals = ledgerTotals(ownPayments, today)
  const horizon = today.getTime() + ENDING_SOON_DAYS * DAY_MS
  const endingSoon = ownLeases.filter(lease => {
    if (!lease.endDate || getLeaseStatus(lease, today) === 'ended') return false
    return new Date(lease.endDate).getTime() <= horizon
  }).length
  const openTickets = tickets.filter(
    ticket => (ticket.ownerId === ownerId || ticket.managerId === ownerId) && (ticket.status === 'open' || ticket.status === 'in-progress'),
  ).length
  return { collectedThisMonth, outstanding: totals.outstanding, openTickets, endingSoon }
}
