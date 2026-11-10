import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { TicketRow } from '../shared/TicketRow'
import { TicketDetailSheet } from '../shared/TicketDetailSheet'
import type { MaintenanceTicket } from '@/types/management'

const MAX_VISIBLE = 3

export function OpenTicketsCard({ tickets }: Readonly<{ tickets: readonly MaintenanceTicket[] }>) {
  const { t } = useTranslation()
  const [openId, setOpenId] = useState<string | null>(null)
  const active = tickets.filter(ticket => ticket.status === 'open' || ticket.status === 'in-progress')
  return (
    <section className="rounded-2xl border border-pl-line bg-pl-surface p-5" aria-labelledby="open-tickets-heading">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 id="open-tickets-heading" className="font-heading text-lg font-bold text-pl-text">
          {t('management.maintenance.open_title')}
        </h2>
        <Link to="/tenant/maintenance" className="inline-flex min-h-11 items-center text-sm font-semibold text-pl-accent hover:underline">
          {t('management.common.view_all')}
        </Link>
      </div>
      {active.length === 0 ? (
        <p className="text-sm text-pl-muted">{t('management.maintenance.none_open')}</p>
      ) : (
        <ul className="space-y-2">
          {active.slice(0, MAX_VISIBLE).map(ticket => (
            <TicketRow key={ticket.id} ticket={ticket} onOpen={setOpenId} />
          ))}
        </ul>
      )}
      <TicketDetailSheet ticketId={openId} onClose={() => setOpenId(null)} />
    </section>
  )
}
