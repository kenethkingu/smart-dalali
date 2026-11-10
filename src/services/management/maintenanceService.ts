import { can } from '@/lib/rbac'
import { newId } from '@/lib/ids'
import { registerFileUrl } from '@/lib/objectUrls'
import type { User } from '@/types'
import { recordEvent } from './eventLog'
import { getLeaseStatus } from './leaseService'
import { fail, leaseResource, MAX_TEXT_LENGTH, MAX_TITLE_LENGTH, ok, validateText } from './shared'
import { getState, updateState } from './store'
import type {
  ErrorCode,
  MaintenanceTicket,
  Result,
  StoredPhoto,
  TicketCategory,
  TicketConfirmation,
  TicketStatus,
  TicketUrgency,
} from '@/types/management'

export const TICKET_CATEGORIES: readonly TicketCategory[] = ['plumbing', 'electrical', 'security', 'appliances', 'structure', 'other']
export const TICKET_URGENCIES: readonly TicketUrgency[] = ['normal', 'urgent']
export const MAX_PHOTOS = 3
export const MAX_PHOTO_BYTES = 2 * 1024 * 1024
const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const NEXT_STATUS: Record<TicketStatus, readonly TicketStatus[]> = {
  open: ['in-progress'],
  'in-progress': ['resolved'],
  resolved: [],
  cancelled: [],
}

export function validatePhotos(files: readonly File[], max: number): ErrorCode | null {
  if (files.length > max) return 'too_many_files'
  for (const file of files) {
    if (!PHOTO_TYPES.includes(file.type)) return 'file_type'
    if (file.size > MAX_PHOTO_BYTES) return 'file_size'
  }
  return null
}

export function storePhotos(files: readonly File[]): StoredPhoto[] {
  return files.map(file => {
    const id = newId('photo')
    registerFileUrl(id, file)
    return { id, name: file.name }
  })
}

interface CreateTicketInput {
  leaseId: string
  category: TicketCategory
  title: string
  description: string
  urgency: TicketUrgency
  photos: readonly File[]
}

function validateTicketInput(input: Readonly<CreateTicketInput>): ErrorCode | null {
  if (!TICKET_CATEGORIES.includes(input.category) || !TICKET_URGENCIES.includes(input.urgency)) return 'required'
  return validateText(input.title, MAX_TITLE_LENGTH) ?? validateText(input.description, MAX_TEXT_LENGTH) ?? validatePhotos(input.photos, MAX_PHOTOS)
}

export function createTicket(actor: User, input: Readonly<CreateTicketInput>): Result<MaintenanceTicket> {
  const lease = getState().leases.find(item => item.id === input.leaseId)
  if (!lease) return fail('not_found')
  if (!can(actor, 'ticket.create', leaseResource(lease))) return fail('forbidden')
  if (getLeaseStatus(lease) === 'ended') return fail('invalid_transition')
  const invalid = validateTicketInput(input)
  if (invalid) return fail(invalid)

  const now = new Date().toISOString()
  const ticket: MaintenanceTicket = {
    id: newId('tkt'),
    leaseId: lease.id,
    propertyId: lease.propertyId,
    ownerId: lease.ownerId,
    managerId: lease.managerId,
    tenantId: lease.tenantId,
    tenantName: lease.tenantName,
    category: input.category,
    title: input.title.trim(),
    description: input.description.trim(),
    urgency: input.urgency,
    status: 'open',
    photos: storePhotos(input.photos),
    notes: [],
    createdAt: now,
    updatedAt: now,
  }
  updateState(state => ({ ...state, tickets: [ticket, ...state.tickets] }))
  recordEvent({
    propertyId: lease.propertyId,
    type: 'maintenance_reported',
    actor: { id: actor.id, name: actor.name, role: 'tenant' },
    relatedId: ticket.id,
    params: { title: ticket.title },
  })
  return ok(ticket)
}

function replaceTicket(tickets: readonly MaintenanceTicket[], next: MaintenanceTicket): MaintenanceTicket[] {
  return tickets.map(ticket => (ticket.id === next.id ? next : ticket))
}

function ticketResource(ticket: MaintenanceTicket) {
  return { ownerId: ticket.ownerId, managerId: ticket.managerId, tenantId: ticket.tenantId }
}

interface UpdateTicketInput {
  ticketId: string
  status?: TicketStatus
  note?: string
}

export function updateTicket(actor: User, input: Readonly<UpdateTicketInput>): Result<MaintenanceTicket> {
  const ticket = getState().tickets.find(item => item.id === input.ticketId)
  if (!ticket) return fail('not_found')
  if (!can(actor, 'ticket.respond', ticketResource(ticket))) return fail('forbidden')
  const nextStatus = input.status ?? ticket.status
  if (nextStatus !== ticket.status && !NEXT_STATUS[ticket.status].includes(nextStatus)) return fail('invalid_transition')
  const noteText = input.note?.trim() ?? ''
  if (noteText.length > MAX_TEXT_LENGTH) return fail('too_long')
  if (nextStatus === ticket.status && !noteText) return fail('required')

  const now = new Date().toISOString()
  const notes = noteText
    ? [...ticket.notes, { id: newId('note'), authorId: actor.id, authorName: actor.name, authorRole: actor.role, text: noteText, createdAt: now }]
    : ticket.notes
  const next: MaintenanceTicket = { ...ticket, status: nextStatus, notes, updatedAt: now }
  updateState(state => ({ ...state, tickets: replaceTicket(state.tickets, next) }))
  recordEvent({
    propertyId: ticket.propertyId,
    type: nextStatus === 'resolved' ? 'maintenance_resolved' : 'maintenance_updated',
    actor: { id: actor.id, name: actor.name, role: actor.role },
    relatedId: ticket.id,
    params: { title: ticket.title },
  })
  return ok(next)
}

export function cancelTicket(actor: User, ticketId: string): Result<MaintenanceTicket> {
  const ticket = getState().tickets.find(item => item.id === ticketId)
  if (!ticket) return fail('not_found')
  if (!can(actor, 'ticket.confirm', ticketResource(ticket))) return fail('forbidden')
  if (ticket.status !== 'open') return fail('invalid_transition')

  const next: MaintenanceTicket = { ...ticket, status: 'cancelled', updatedAt: new Date().toISOString() }
  updateState(state => ({ ...state, tickets: replaceTicket(state.tickets, next) }))
  recordEvent({
    propertyId: ticket.propertyId,
    type: 'maintenance_updated',
    actor: { id: actor.id, name: actor.name, role: 'tenant' },
    relatedId: ticket.id,
    params: { title: ticket.title },
    summaryKey: 'management.events.maintenance_cancelled',
  })
  return ok(next)
}

export function confirmResolution(actor: User, ticketId: string, answer: TicketConfirmation): Result<MaintenanceTicket> {
  const ticket = getState().tickets.find(item => item.id === ticketId)
  if (!ticket) return fail('not_found')
  if (!can(actor, 'ticket.confirm', ticketResource(ticket))) return fail('forbidden')
  if (ticket.status !== 'resolved' || ticket.confirmation) return fail('invalid_transition')

  const reopened = answer === 'not-fixed'
  const next: MaintenanceTicket = {
    ...ticket,
    status: reopened ? 'open' : ticket.status,
    confirmation: reopened ? undefined : 'fixed',
    updatedAt: new Date().toISOString(),
  }
  updateState(state => ({ ...state, tickets: replaceTicket(state.tickets, next) }))
  recordEvent({
    propertyId: ticket.propertyId,
    type: 'maintenance_updated',
    actor: { id: actor.id, name: actor.name, role: 'tenant' },
    relatedId: ticket.id,
    params: { title: ticket.title },
    summaryKey: reopened ? 'management.events.maintenance_reopened' : 'management.events.maintenance_confirmed',
  })
  return ok(next)
}
