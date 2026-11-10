import { useTranslation } from 'react-i18next'
import { formatDate } from '@/lib/dateFormat'
import { formatTZS } from '@/lib/money'
import { getLeaseStatus } from '@/services/management/leaseService'
import { MetaBadge } from '../shared/MetaBadge'
import { LEASE_STATUS_META } from '../shared/statusMeta'
import type { Lease } from '@/types/management'

export function LeaseSummary({ lease }: Readonly<{ lease: Lease }>) {
  const { t } = useTranslation()
  const rows: { label: string; value: string }[] = [
    { label: t('management.lease.start'), value: formatDate(lease.startDate) },
    { label: t('management.lease.end'), value: lease.endDate ? formatDate(lease.endDate) : t('management.lease.month_to_month') },
    { label: t('management.lease.rent'), value: t('management.lease.per_month', { amount: formatTZS(lease.monthlyRent) }) },
  ]
  return (
    <section className="rounded-2xl border border-pl-line bg-pl-surface p-5" aria-labelledby="lease-summary-heading">
      <h2 id="lease-summary-heading" className="mb-3 font-heading text-lg font-bold text-pl-text">
        {t('management.lease.summary')}
      </h2>
      <dl className="space-y-2 text-sm">
        {rows.map(row => (
          <div key={row.label} className="flex justify-between gap-3">
            <dt className="text-pl-muted">{row.label}</dt>
            <dd className="font-semibold text-pl-text">{row.value}</dd>
          </div>
        ))}
        <div className="flex items-center justify-between gap-3">
          <dt className="text-pl-muted">{t('common.status')}</dt>
          <dd>
            <MetaBadge meta={LEASE_STATUS_META[getLeaseStatus(lease)]} />
          </dd>
        </div>
      </dl>
    </section>
  )
}
