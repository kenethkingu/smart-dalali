import { Wrench } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/lib/auth'
import { usePagedList } from '@/hooks/management/usePagedList'
import { useManagedTickets } from '@/hooks/management/useTickets'
import { EmptyState } from '../shared/EmptyState'
import { FilterTabs } from '../shared/FilterTabs'
import { FormField } from '../shared/FormField'
import { INPUT_CLASS } from '../shared/formStyles'
import { PageHeader } from '../shared/PageHeader'
import { Pagination } from '../shared/Pagination'
import { propertyLabel } from '../shared/PropertyLabel'
import { TicketDetailSheet } from '../shared/TicketDetailSheet'
import { TicketRow } from '../shared/TicketRow'
import type { TicketStatus } from '@/types/management'

type TicketFilter = 'all' | TicketStatus

const FILTERS: readonly TicketFilter[] = ['all', 'open', 'in-progress', 'resolved', 'cancelled']
const ALL_PROPERTIES = 'all'

export default function OwnerMaintenancePage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const tickets = useManagedTickets(user)
  const [status, setStatus] = useState<TicketFilter>('all')
  const [propertyId, setPropertyId] = useState(ALL_PROPERTIES)
  const [openId, setOpenId] = useState<string | null>(null)

  const propertyIds = useMemo(() => [...new Set(tickets.map(ticket => ticket.propertyId))], [tickets])
  const filtered = useMemo(
    () => tickets.filter(ticket => (status === 'all' || ticket.status === status) && (propertyId === ALL_PROPERTIES || ticket.propertyId === propertyId)),
    [tickets, status, propertyId],
  )
  const { page, setPage } = usePagedList(filtered, `${status}-${propertyId}`)

  return (
    <div className="max-w-3xl text-pl-text">
      <PageHeader title={t('management.maintenance.title')} description={t('management.maintenance.owner_subtitle')} />
      {propertyIds.length > 1 && (
        <div className="mb-4 max-w-sm">
          <FormField id="maintenance-property" label={t('management.maintenance.property_filter')}>
            {props => (
              <select {...props} className={INPUT_CLASS} value={propertyId} onChange={e => setPropertyId(e.target.value)}>
                <option value={ALL_PROPERTIES}>{t('common.all')}</option>
                {propertyIds.map(id => (
                  <option key={id} value={id}>
                    {propertyLabel(id)}
                  </option>
                ))}
              </select>
            )}
          </FormField>
        </div>
      )}
      <FilterTabs
        label={t('management.maintenance.filter_label')}
        value={status}
        onChange={setStatus}
        options={FILTERS.map(value => ({ value, label: value === 'all' ? t('common.all') : t(`management.status.ticket.${value}`) }))}
      />
      {page.items.length === 0 ? (
        <EmptyState icon={Wrench} title={t('management.maintenance.owner_empty_title')} description={t('management.maintenance.owner_empty_description')} />
      ) : (
        <ul className="space-y-3">
          {page.items.map(ticket => (
            <TicketRow key={ticket.id} ticket={ticket} showContext onOpen={setOpenId} />
          ))}
        </ul>
      )}
      <Pagination page={page.page} pageCount={page.pageCount} onChange={setPage} />
      <TicketDetailSheet ticketId={openId} onClose={() => setOpenId(null)} />
    </div>
  )
}
