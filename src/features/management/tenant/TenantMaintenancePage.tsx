import { Plus, Wrench } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { PrimaryButton } from '@/components/shared/Bits'
import { useAuth } from '@/lib/auth'
import { usePagedList } from '@/hooks/management/usePagedList'
import { useTenantTickets } from '@/hooks/management/useTickets'
import { EmptyState } from '../shared/EmptyState'
import { FilterTabs } from '../shared/FilterTabs'
import { PageHeader } from '../shared/PageHeader'
import { Pagination } from '../shared/Pagination'
import { TicketDetailSheet } from '../shared/TicketDetailSheet'
import { TicketRow } from '../shared/TicketRow'
import type { TicketStatus } from '@/types/management'

type TicketFilter = 'all' | TicketStatus

const FILTERS: readonly TicketFilter[] = ['all', 'open', 'in-progress', 'resolved', 'cancelled']

export default function TenantMaintenancePage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const tickets = useTenantTickets(user?.id)
  const [filter, setFilter] = useState<TicketFilter>('all')
  const [openId, setOpenId] = useState<string | null>(null)
  const filtered = useMemo(() => tickets.filter(ticket => filter === 'all' || ticket.status === filter), [tickets, filter])
  const { page, setPage } = usePagedList(filtered, filter)

  return (
    <div className="max-w-3xl text-pl-text">
      <PageHeader
        title={t('management.maintenance.title')}
        description={t('management.maintenance.tenant_subtitle')}
        actions={
          <Link to="/tenant/maintenance/new">
            <PrimaryButton className="min-h-11 sm:w-auto">
              <Plus className="h-4 w-4" aria-hidden="true" /> {t('management.maintenance.report')}
            </PrimaryButton>
          </Link>
        }
      />
      <FilterTabs
        label={t('management.maintenance.filter_label')}
        value={filter}
        onChange={setFilter}
        options={FILTERS.map(value => ({ value, label: value === 'all' ? t('common.all') : t(`management.status.ticket.${value}`) }))}
      />
      {page.items.length === 0 ? (
        <EmptyState icon={Wrench} title={t('management.maintenance.empty_title')} description={t('management.maintenance.empty_description')} />
      ) : (
        <ul className="space-y-3">
          {page.items.map(ticket => (
            <TicketRow key={ticket.id} ticket={ticket} onOpen={setOpenId} />
          ))}
        </ul>
      )}
      <Pagination page={page.page} pageCount={page.pageCount} onChange={setPage} />
      <TicketDetailSheet ticketId={openId} onClose={() => setOpenId(null)} />
    </div>
  )
}
