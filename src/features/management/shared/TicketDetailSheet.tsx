import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GhostButton, PrimaryButton } from '@/components/shared/Bits'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useAuth } from '@/lib/auth'
import { formatDate } from '@/lib/dateFormat'
import { getFileUrl } from '@/lib/objectUrls'
import { can } from '@/lib/rbac'
import { useAllTickets } from '@/hooks/management/useTickets'
import { cancelTicket, confirmResolution, updateTicket } from '@/services/management/maintenanceService'
import { FormField } from './FormField'
import { INPUT_CLASS } from './formStyles'
import { InlineNotice } from './InlineNotice'
import { MetaBadge } from './MetaBadge'
import { TICKET_STATUS_META } from './statusMeta'
import { errorText } from './errors'
import { propertyLabel } from './PropertyLabel'
import type { MaintenanceTicket, Result, TicketStatus } from '@/types/management'

const NEXT_OPTIONS: Record<TicketStatus, readonly TicketStatus[]> = {
  open: ['in-progress'],
  'in-progress': ['resolved'],
  resolved: [],
  cancelled: [],
}

interface TicketDetailSheetProps {
  readonly ticketId: string | null
  readonly onClose: () => void
}

function ResponderForm({ ticket, onResult }: Readonly<{ ticket: MaintenanceTicket; onResult: (result: Result<MaintenanceTicket>) => void }>) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [status, setStatus] = useState<TicketStatus>(ticket.status)
  const [note, setNote] = useState('')
  const options = [ticket.status, ...NEXT_OPTIONS[ticket.status]]

  const submit = () => {
    if (!user) return
    const result = updateTicket(user, { ticketId: ticket.id, status, note })
    if (result.ok) setNote('')
    onResult(result)
  }

  return (
    <form
      className="mt-6 space-y-4 border-t border-pl-line pt-5"
      onSubmit={event => {
        event.preventDefault()
        submit()
      }}
    >
      <FormField id="ticket-status" label={t('management.maintenance.set_status')}>
        {props => (
          <select {...props} className={INPUT_CLASS} value={status} onChange={e => setStatus(e.target.value as TicketStatus)}>
            {options.map(option => (
              <option key={option} value={option}>
                {t(TICKET_STATUS_META[option].labelKey)}
              </option>
            ))}
          </select>
        )}
      </FormField>
      <FormField id="ticket-note" label={t('management.maintenance.add_note')} hint={t('management.maintenance.note_hint')}>
        {props => <textarea {...props} className={INPUT_CLASS} rows={3} maxLength={1000} value={note} onChange={e => setNote(e.target.value)} />}
      </FormField>
      <PrimaryButton type="submit" className="min-h-11">
        {t('management.maintenance.save_update')}
      </PrimaryButton>
    </form>
  )
}

function TenantActions({ ticket, onResult }: Readonly<{ ticket: MaintenanceTicket; onResult: (result: Result<MaintenanceTicket>) => void }>) {
  const { t } = useTranslation()
  const { user } = useAuth()
  if (!user) return null

  if (ticket.status === 'open') {
    return (
      <GhostButton className="mt-6 min-h-11" onClick={() => onResult(cancelTicket(user, ticket.id))}>
        {t('management.maintenance.cancel_request')}
      </GhostButton>
    )
  }
  if (ticket.status === 'resolved' && !ticket.confirmation) {
    return (
      <div className="mt-6 border-t border-pl-line pt-5">
        <p className="mb-3 text-sm font-semibold text-pl-text">{t('management.maintenance.confirm_question')}</p>
        <div className="flex gap-2">
          <PrimaryButton className="min-h-11" onClick={() => onResult(confirmResolution(user, ticket.id, 'fixed'))}>
            {t('management.maintenance.fixed')}
          </PrimaryButton>
          <GhostButton className="min-h-11" onClick={() => onResult(confirmResolution(user, ticket.id, 'not-fixed'))}>
            {t('management.maintenance.not_fixed')}
          </GhostButton>
        </div>
      </div>
    )
  }
  return null
}

function TicketBody({ ticket }: Readonly<{ ticket: MaintenanceTicket }>) {
  const { t } = useTranslation()
  return (
    <div className="mt-4 space-y-4 text-sm">
      <p className="whitespace-pre-line text-pl-text">{ticket.description}</p>
      {ticket.photos.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {ticket.photos.map(photo => {
            const url = getFileUrl(photo.id)
            return url ? (
              <img key={photo.id} src={url} alt={photo.name} className="h-20 w-20 rounded-lg border border-pl-line object-cover" />
            ) : (
              <span key={photo.id} className="rounded-lg border border-pl-line px-2 py-1 text-xs text-pl-muted">
                {photo.name}
              </span>
            )
          })}
        </div>
      )}
      <div>
        <h3 className="mb-2 font-semibold text-pl-text">{t('management.maintenance.updates')}</h3>
        {ticket.notes.length === 0 ? (
          <p className="text-pl-muted">{t('management.maintenance.no_updates')}</p>
        ) : (
          <ol className="space-y-2">
            {ticket.notes.map(note => (
              <li key={note.id} className="rounded-xl border border-pl-line bg-pl-bg p-3">
                <p className="text-pl-text">{note.text}</p>
                <p className="mt-1 text-xs text-pl-muted">
                  {note.authorName} · {formatDate(note.createdAt)}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}

export function TicketDetailSheet({ ticketId, onClose }: TicketDetailSheetProps) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const tickets = useAllTickets()
  const [feedback, setFeedback] = useState<{ error?: string; saved?: boolean }>({})
  const ticket = tickets.find(item => item.id === ticketId)

  const handleOpenChange = (open: boolean) => {
    if (open) return
    setFeedback({})
    onClose()
  }

  const handleResult = (result: Result<MaintenanceTicket>) =>
    setFeedback(result.ok ? { saved: true } : { error: errorText(t, result) })

  return (
    <Sheet open={ticket !== undefined} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full overflow-y-auto border-pl-line bg-pl-surface text-pl-text sm:max-w-md">
        {ticket && (
          <>
            <SheetHeader>
              <SheetTitle className="text-pl-text">{ticket.title}</SheetTitle>
              <SheetDescription className="text-pl-muted">
                {propertyLabel(ticket.propertyId)} · {t(`management.maintenance.category.${ticket.category}`)}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-3">
              <MetaBadge meta={TICKET_STATUS_META[ticket.status]} />
            </div>
            <TicketBody ticket={ticket} />
            {feedback.error && (
              <p role="alert" className="mt-4 text-sm font-semibold text-pl-danger">
                {feedback.error}
              </p>
            )}
            {feedback.saved && (
              <div className="mt-4">
                <InlineNotice variant="success">{t('management.maintenance.saved')}</InlineNotice>
              </div>
            )}
            {can(user, 'ticket.respond', ticket) && NEXT_OPTIONS[ticket.status].length > 0 && (
              <ResponderForm key={`${ticket.id}-${ticket.status}`} ticket={ticket} onResult={handleResult} />
            )}
            {can(user, 'ticket.confirm', ticket) && <TenantActions ticket={ticket} onResult={handleResult} />}
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
