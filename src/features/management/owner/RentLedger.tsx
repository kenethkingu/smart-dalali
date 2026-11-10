import { useTranslation } from 'react-i18next'
import { formatDate } from '@/lib/dateFormat'
import { formatTZS } from '@/lib/money'
import { getRentStatus } from '@/lib/rentStatus'
import { usePagedList } from '@/hooks/management/usePagedList'
import { ledgerTotals } from '@/services/management/rentService'
import { MetaBadge } from '../shared/MetaBadge'
import { Pagination } from '../shared/Pagination'
import { RENT_STATUS_META } from '../shared/statusMeta'
import type { RentPayment } from '@/types/management'

export function RentLedger({ payments }: Readonly<{ payments: readonly RentPayment[] }>) {
  const { t } = useTranslation()
  const { page, setPage } = usePagedList(payments)
  const totals = ledgerTotals(payments)
  const summary = [
    { label: t('management.owner.ledger_collected'), value: totals.collected },
    { label: t('management.owner.ledger_outstanding'), value: totals.outstanding },
    { label: t('management.owner.ledger_overdue'), value: totals.overdue },
  ]
  return (
    <section aria-labelledby="ledger-heading">
      <h2 id="ledger-heading" className="mb-3 font-heading text-lg font-bold text-pl-text">
        {t('management.owner.ledger_title')}
      </h2>
      <dl className="mb-4 grid grid-cols-3 gap-3">
        {summary.map(item => (
          <div key={item.label} className="rounded-2xl border border-pl-line bg-pl-surface p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-pl-muted">{item.label}</dt>
            <dd className="mt-1 text-base font-bold text-pl-text">{formatTZS(item.value)}</dd>
          </div>
        ))}
      </dl>
      <ul className="space-y-2">
        {page.items.map(payment => (
          <li key={payment.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-pl-line bg-pl-surface px-4 py-3 text-sm">
            <span>
              <span className="font-semibold">{formatDate(payment.dueDate)}</span>
              <span className="ml-2 text-pl-muted">{formatTZS(payment.amount)}</span>
            </span>
            <MetaBadge meta={RENT_STATUS_META[getRentStatus(payment)]} />
          </li>
        ))}
      </ul>
      <Pagination page={page.page} pageCount={page.pageCount} onChange={setPage} />
    </section>
  )
}
