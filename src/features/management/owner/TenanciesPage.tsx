import { Users } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { buildings } from '@/data/mockData'
import { useAuth } from '@/lib/auth'
import { formatDate } from '@/lib/dateFormat'
import { formatTZS } from '@/lib/money'
import { getRentStatus } from '@/lib/rentStatus'
import { useManagedLeases } from '@/hooks/management/useLeases'
import { useAllPayments } from '@/hooks/management/usePayments'
import { usePagedList } from '@/hooks/management/usePagedList'
import { getLeaseStatus } from '@/services/management/leaseService'
import { findNextRent } from '@/services/management/rentService'
import { EmptyState } from '../shared/EmptyState'
import { MetaBadge } from '../shared/MetaBadge'
import { PageHeader } from '../shared/PageHeader'
import { Pagination } from '../shared/Pagination'
import { propertyLabel } from '../shared/PropertyLabel'
import { LEASE_STATUS_META, RENT_STATUS_META } from '../shared/statusMeta'
import type { Lease, RentPayment } from '@/types/management'

interface Group {
  key: string
  title: string
  leases: Lease[]
}

function groupByBuilding(leases: readonly Lease[], fallbackTitle: string): Group[] {
  const groups = new Map<string, Group>()
  for (const lease of leases) {
    const building = buildings.find(item => item.id === lease.buildingId)
    const key = building?.id ?? 'single'
    const group = groups.get(key) ?? { key, title: building?.name ?? fallbackTitle, leases: [] }
    group.leases.push(lease)
    groups.set(key, group)
  }
  return [...groups.values()]
}

function TenancyRow({ lease, nextRent }: Readonly<{ lease: Lease; nextRent?: RentPayment }>) {
  const { t } = useTranslation()
  return (
    <li>
      <Link
        to={`/owner/tenancies/${lease.id}`}
        className="flex min-h-11 flex-col gap-2 rounded-2xl border border-pl-line bg-pl-surface p-4 transition-colors hover:border-pl-accent sm:flex-row sm:items-center sm:justify-between"
      >
        <span>
          <span className="block font-semibold text-pl-text">{lease.tenantName}</span>
          <span className="block text-sm text-pl-muted">
            {propertyLabel(lease.propertyId, lease.unitNumber)} · {t('management.lease.per_month', { amount: formatTZS(lease.monthlyRent) })}
          </span>
          {nextRent && (
            <span className="block text-xs text-pl-muted">{t('management.owner.next_due', { date: formatDate(nextRent.dueDate) })}</span>
          )}
        </span>
        <span className="flex flex-wrap gap-2">
          {nextRent && <MetaBadge meta={RENT_STATUS_META[getRentStatus(nextRent)]} />}
          <MetaBadge meta={LEASE_STATUS_META[getLeaseStatus(lease)]} />
        </span>
      </Link>
    </li>
  )
}

export default function TenanciesPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const leases = useManagedLeases(user)
  const payments = useAllPayments()
  const { page, setPage } = usePagedList(leases)
  const nextRentByLease = useMemo(() => {
    const result = new Map<string, RentPayment | undefined>()
    for (const lease of page.items) result.set(lease.id, findNextRent(payments.filter(payment => payment.leaseId === lease.id)))
    return result
  }, [page.items, payments])
  const groups = useMemo(() => groupByBuilding(page.items, t('management.owner.single_properties')), [page.items, t])

  return (
    <div className="max-w-4xl text-pl-text">
      <PageHeader title={t('management.owner.tenancies_title')} description={t('management.owner.tenancies_subtitle')} />
      {leases.length === 0 ? (
        <EmptyState icon={Users} title={t('management.owner.tenancies_empty_title')} description={t('management.owner.tenancies_empty_description')} />
      ) : (
        <div className="space-y-8">
          {groups.map(group => (
            <section key={group.key} aria-label={group.title}>
              <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-pl-muted">{group.title}</h2>
              <ul className="space-y-3">
                {group.leases.map(lease => (
                  <TenancyRow key={lease.id} lease={lease} nextRent={nextRentByLease.get(lease.id)} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
      <Pagination page={page.page} pageCount={page.pageCount} onChange={setPage} />
    </div>
  )
}
