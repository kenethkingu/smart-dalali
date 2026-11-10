import { Wallet } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatDate } from '@/lib/dateFormat'
import { formatTZS } from '@/lib/money'
import { getRentStatus } from '@/lib/rentStatus'
import { usePagedList } from '@/hooks/management/usePagedList'
import { useLeasePayments } from '@/hooks/management/usePayments'
import { getLeaseStatus } from '@/services/management/leaseService'
import { EmptyState } from '../shared/EmptyState'
import { FilterTabs } from '../shared/FilterTabs'
import { MetaBadge } from '../shared/MetaBadge'
import { PageHeader } from '../shared/PageHeader'
import { Pagination } from '../shared/Pagination'
import { RENT_STATUS_META } from '../shared/statusMeta'
import { LeaseSwitcher } from './LeaseSwitcher'
import { PayRentSheet } from './PayRentSheet'
import { ReceiptDialog } from './ReceiptDialog'
import { useActiveLease } from './useActiveLease'
import type { RentPayment, RentStatus } from '@/types/management'

type RentFilter = 'all' | 'upcoming' | 'paid' | 'overdue'

const FILTER_STATUSES: Record<RentFilter, readonly RentStatus[]> = {
  all: ['paid', 'upcoming', 'due', 'overdue'],
  upcoming: ['upcoming', 'due'],
  paid: ['paid'],
  overdue: ['overdue'],
}

const FILTERS: readonly RentFilter[] = ['all', 'upcoming', 'paid', 'overdue']

export default function TenantRentPage() {
  const { t } = useTranslation()
  const { leases, lease, select } = useActiveLease()
  const payments = useLeasePayments(lease?.id)
  const [filter, setFilter] = useState<RentFilter>('all')
  const [paying, setPaying] = useState<RentPayment | null>(null)
  const [receipt, setReceipt] = useState<RentPayment | null>(null)

  const filtered = useMemo(
    () => payments.filter(payment => FILTER_STATUSES[filter].includes(getRentStatus(payment))),
    [payments, filter],
  )
  const { page, setPage } = usePagedList(filtered, `${filter}-${lease?.id}`)

  if (!lease) {
    return (
      <div className="max-w-4xl">
        <PageHeader title={t('management.rent.title')} />
        <EmptyState icon={Wallet} title={t('management.tenant.empty_title')} description={t('management.tenant.empty_description')} />
      </div>
    )
  }

  const canPay = getLeaseStatus(lease) === 'active'
  return (
    <div className="max-w-4xl text-pl-text">
      <PageHeader title={t('management.rent.title')} description={t('management.rent.subtitle')} />
      <LeaseSwitcher leases={leases} value={lease.id} onChange={select} />
      <FilterTabs
        label={t('management.rent.filter_label')}
        value={filter}
        onChange={setFilter}
        options={FILTERS.map(value => ({ value, label: t(`management.rent.filter.${value}`) }))}
      />
      {page.items.length === 0 ? (
        <EmptyState icon={Wallet} title={t('management.rent.empty_title')} description={t('management.rent.empty_description')} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-pl-line bg-pl-surface">
          <table className="w-full min-w-[34rem] text-sm">
            <thead>
              <tr className="border-b border-pl-line bg-pl-bg text-left text-xs font-bold uppercase tracking-wide text-pl-muted">
                <th scope="col" className="px-4 py-3">{t('management.rent.due_date')}</th>
                <th scope="col" className="px-4 py-3">{t('management.rent.amount')}</th>
                <th scope="col" className="px-4 py-3">{t('common.status')}</th>
                <th scope="col" className="px-4 py-3">{t('management.rent.paid_date')}</th>
                <th scope="col" className="px-4 py-3">
                  <span className="sr-only">{t('common.actions')}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {page.items.map(payment => (
                <tr key={payment.id} className="border-b border-pl-line last:border-0">
                  <td className="px-4 py-3">{formatDate(payment.dueDate)}</td>
                  <td className="px-4 py-3 font-semibold">{formatTZS(payment.amount)}</td>
                  <td className="px-4 py-3">
                    <MetaBadge meta={RENT_STATUS_META[getRentStatus(payment)]} />
                  </td>
                  <td className="px-4 py-3 text-pl-muted">{payment.paidDate ? formatDate(payment.paidDate) : '-'}</td>
                  <td className="px-4 py-3 text-right">
                    {payment.paidDate ? (
                      <button type="button" onClick={() => setReceipt(payment)} className="min-h-11 font-semibold text-pl-accent hover:underline">
                        {t('management.rent.receipt')}
                      </button>
                    ) : (
                      canPay && (
                        <button type="button" onClick={() => setPaying(payment)} className="min-h-11 font-semibold text-pl-accent hover:underline">
                          {t('management.rent.pay_button')}
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page.page} pageCount={page.pageCount} onChange={setPage} />
      <PayRentSheet payment={paying} onClose={() => setPaying(null)} onViewReceipt={setReceipt} />
      <ReceiptDialog payment={receipt} lease={lease} onClose={() => setReceipt(null)} />
    </div>
  )
}
