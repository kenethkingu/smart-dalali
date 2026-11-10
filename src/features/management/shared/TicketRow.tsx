import { useTranslation } from 'react-i18next'
import { formatRelative } from '@/lib/dateFormat'
import { MetaBadge } from '../shared/MetaBadge'
import { TICKET_STATUS_META } from '../shared/statusMeta'
import { propertyLabel } from './PropertyLabel'
import type { MaintenanceTicket } from '@/types/management'

interface TicketRowProps {
  readonly ticket: MaintenanceTicket
  readonly showContext?: boolean
  readonly onOpen: (ticketId: string) => void
}

export function TicketRow({ ticket, showContext = false, onOpen }: TicketRowProps) {
  const { t } = useTranslation()
  return (
    <li>
      <button
        type="button"
        onClick={() => onOpen(ticket.id)}
        className="flex min-h-11 w-full flex-col gap-1 rounded-2xl border border-pl-line bg-pl-surface p-4 text-left transition-colors hover:border-pl-accent"
      >
        <span className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-semibold text-pl-text">{ticket.title}</span>
          <MetaBadge meta={TICKET_STATUS_META[ticket.status]} />
        </span>
        <span className="text-xs text-pl-muted">
          {t(`management.maintenance.category.${ticket.category}`)}
          {ticket.urgency === 'urgent' ? ` · ${t('management.maintenance.urgency.urgent')}` : ''}
          {showContext ? ` · ${propertyLabel(ticket.propertyId)} · ${ticket.tenantName}` : ''}
          {` · ${formatRelative(ticket.updatedAt)}`}
        </span>
      </button>
    </li>
  )
}
