import { AlertCircle, Ban, CalendarClock, CheckCircle2, Clock, FileClock, Hourglass, ShieldCheck, ShieldX, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { BadgeEmphasis } from './StatusBadge'
import type { DocumentStatus, LeaseStatus, RentStatus, TicketStatus } from '@/types/management'

export interface StatusMeta {
  icon: LucideIcon
  labelKey: string
  emphasis: BadgeEmphasis
}

export const RENT_STATUS_META: Record<RentStatus, StatusMeta> = {
  paid: { icon: CheckCircle2, labelKey: 'management.status.rent.paid', emphasis: 'positive' },
  upcoming: { icon: CalendarClock, labelKey: 'management.status.rent.upcoming', emphasis: 'muted' },
  due: { icon: Clock, labelKey: 'management.status.rent.due', emphasis: 'default' },
  overdue: { icon: AlertCircle, labelKey: 'management.status.rent.overdue', emphasis: 'default' },
}

export const LEASE_STATUS_META: Record<LeaseStatus, StatusMeta> = {
  'pending-signature': { icon: FileClock, labelKey: 'management.status.lease.pending-signature', emphasis: 'default' },
  active: { icon: CheckCircle2, labelKey: 'management.status.lease.active', emphasis: 'positive' },
  ended: { icon: Ban, labelKey: 'management.status.lease.ended', emphasis: 'muted' },
}

export const TICKET_STATUS_META: Record<TicketStatus, StatusMeta> = {
  open: { icon: Hourglass, labelKey: 'management.status.ticket.open', emphasis: 'default' },
  'in-progress': { icon: Wrench, labelKey: 'management.status.ticket.in-progress', emphasis: 'default' },
  resolved: { icon: CheckCircle2, labelKey: 'management.status.ticket.resolved', emphasis: 'positive' },
  cancelled: { icon: Ban, labelKey: 'management.status.ticket.cancelled', emphasis: 'muted' },
}

export const DOCUMENT_STATUS_META: Record<DocumentStatus, StatusMeta> = {
  pending: { icon: Clock, labelKey: 'management.status.document.pending', emphasis: 'default' },
  verified: { icon: ShieldCheck, labelKey: 'management.status.document.verified', emphasis: 'positive' },
  rejected: { icon: ShieldX, labelKey: 'management.status.document.rejected', emphasis: 'muted' },
}
