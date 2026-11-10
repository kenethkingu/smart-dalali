import { differenceInCalendarMonths } from 'date-fns'
import { can } from '@/lib/rbac'
import { userDirectory } from '@/data/mockData'
import type { User, SiteVisitRequest } from '@/types'
import { fail, findProperty, isValidIso, leaseResource, ok } from './shared'
import { recordEvent } from './eventLog'
import { buildPaymentRecords, buildRentSchedule } from './rentSchedule'
import { getState, updateState } from './store'
import { newId } from '@/lib/ids'
import type { Lease, LeaseStatus, Result } from '@/types/management'

export function getLeaseStatus(lease: Pick<Lease, 'status' | 'endDate'>, now: Date = new Date()): LeaseStatus {
  if (lease.status === 'ended') return 'ended'
  if (lease.endDate && new Date(lease.endDate) < now) return 'ended'
  return lease.status
}

function replaceLease(leases: readonly Lease[], next: Lease): Lease[] {
  return leases.map(lease => (lease.id === next.id ? next : lease))
}

export function createLeaseFromRequest(request: SiteVisitRequest, tenantName: string): Result<Lease> {
  const state = getState()
  const existing = state.leases.find(lease => lease.requestId === request.id)
  if (existing) return ok(existing)

  const property = findProperty(request.propertyId)
  if (request.status !== 'payment_confirmed' || !property || property.purpose !== 'rent') return fail('invalid_transition')
  const occupied = state.leases.some(lease => lease.propertyId === property.id && getLeaseStatus(lease) !== 'ended')
  if (occupied) return fail('conflict')

  const now = new Date().toISOString()
  const lease: Lease = {
    id: newId('lease'),
    requestId: request.id,
    propertyId: property.id,
    buildingId: property.buildingId,
    unitNumber: property.unitNumber,
    ownerId: property.ownerId,
    managerId: property.managerId,
    tenantId: request.buyerId,
    tenantName,
    ownerName: userDirectory[property.ownerId] ?? property.agent.name,
    startDate: now,
    monthlyRent: property.price,
    status: 'pending-signature',
    createdAt: now,
  }
  updateState(current => ({
    ...current,
    leases: [lease, ...current.leases],
    payments: [...buildRentSchedule(lease), ...current.payments],
    contracts: [{ id: newId('contract'), leaseId: lease.id }, ...current.contracts],
  }))
  recordEvent({
    propertyId: property.id,
    type: 'lease_started',
    actor: { id: request.buyerId, name: tenantName, role: 'tenant' },
    relatedId: lease.id,
  })
  return ok(lease)
}

function findManagedLease(actor: User, leaseId: string): Result<Lease> {
  const lease = getState().leases.find(item => item.id === leaseId)
  if (!lease) return fail('not_found')
  if (!can(actor, 'lease.manage', leaseResource(lease))) return fail('forbidden')
  return ok(lease)
}

export function endLease(actor: User, leaseId: string, endDate: string): Result<Lease> {
  const found = findManagedLease(actor, leaseId)
  if (!found.ok) return found
  const lease = found.value
  if (!isValidIso(endDate)) return fail('invalid_date')
  if (new Date(endDate) < new Date(lease.startDate)) return fail('date_order')

  const endsNow = new Date(endDate) <= new Date()
  const next: Lease = { ...lease, endDate, status: endsNow ? 'ended' : lease.status, renewalOffer: undefined }
  updateState(state => ({
    ...state,
    leases: replaceLease(state.leases, next),
    payments: state.payments.filter(
      payment => payment.leaseId !== lease.id || payment.paidDate !== undefined || new Date(payment.dueDate) <= new Date(endDate),
    ),
  }))
  recordEvent({
    propertyId: lease.propertyId,
    type: 'lease_ended',
    actor: { id: actor.id, name: actor.name, role: actor.role },
    relatedId: lease.id,
  })
  return ok(next)
}

interface RenewalInput {
  endDate: string
  monthlyRent?: number
}

export function offerRenewal(actor: User, leaseId: string, input: Readonly<RenewalInput>): Result<Lease> {
  const found = findManagedLease(actor, leaseId)
  if (!found.ok) return found
  const lease = found.value
  const rent = input.monthlyRent ?? lease.monthlyRent
  if (!Number.isInteger(rent) || rent <= 0) return fail('invalid_amount')
  if (!isValidIso(input.endDate)) return fail('invalid_date')
  const floor = lease.endDate ? new Date(lease.endDate) : new Date()
  if (new Date(input.endDate) <= floor) return fail('date_order')
  if (getLeaseStatus(lease) === 'ended') return fail('invalid_transition')

  const next: Lease = {
    ...lease,
    renewalOffer: { endDate: input.endDate, monthlyRent: rent, offeredAt: new Date().toISOString(), status: 'offered' },
  }
  updateState(state => ({ ...state, leases: replaceLease(state.leases, next) }))
  recordEvent({
    propertyId: lease.propertyId,
    type: 'renewal_offered',
    actor: { id: actor.id, name: actor.name, role: actor.role },
    relatedId: lease.id,
  })
  return ok(next)
}

export function respondToRenewal(actor: User, leaseId: string, accept: boolean): Result<Lease> {
  const lease = getState().leases.find(item => item.id === leaseId)
  if (!lease) return fail('not_found')
  if (!can(actor, 'renewal.respond', leaseResource(lease))) return fail('forbidden')
  const offer = lease.renewalOffer
  if (offer?.status !== 'offered') return fail('invalid_transition')

  const actorRef = { id: actor.id, name: actor.name, role: actor.role }
  if (!accept) {
    const declined: Lease = { ...lease, renewalOffer: { ...offer, status: 'declined' } }
    updateState(state => ({ ...state, leases: replaceLease(state.leases, declined) }))
    recordEvent({ propertyId: lease.propertyId, type: 'renewal_declined', actor: actorRef, relatedId: lease.id })
    return ok(declined)
  }

  const renewed: Lease = {
    ...lease,
    endDate: offer.endDate,
    monthlyRent: offer.monthlyRent,
    status: lease.status === 'ended' ? 'active' : lease.status,
    renewalOffer: { ...offer, status: 'accepted' },
  }
  updateState(state => {
    const known = new Set(state.payments.map(payment => payment.id))
    const existingCount = state.payments.filter(payment => payment.leaseId === lease.id).length
    const targetCount = differenceInCalendarMonths(new Date(offer.endDate), new Date(lease.startDate))
    const added = buildPaymentRecords({
      leaseId: lease.id,
      startDate: lease.startDate,
      amount: offer.monthlyRent,
      fromIndex: existingCount,
      count: Math.max(0, targetCount - existingCount),
    }).filter(payment => !known.has(payment.id))
    return { ...state, leases: replaceLease(state.leases, renewed), payments: [...state.payments, ...added] }
  })
  recordEvent({ propertyId: lease.propertyId, type: 'renewal_accepted', actor: actorRef, relatedId: lease.id })
  return ok(renewed)
}
