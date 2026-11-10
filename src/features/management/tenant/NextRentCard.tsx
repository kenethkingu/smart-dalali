import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { PrimaryButton } from '@/components/shared/Bits'
import { formatDate } from '@/lib/dateFormat'
import { formatTZS } from '@/lib/money'
import { daysOverdue, getRentStatus } from '@/lib/rentStatus'
import { getLeaseStatus } from '@/services/management/leaseService'
import { findNextRent } from '@/services/management/rentService'
import { MetaBadge } from '../shared/MetaBadge'
import { RENT_STATUS_META } from '../shared/statusMeta'
import type { Lease, RentPayment } from '@/types/management'

interface NextRentCardProps {
  readonly lease: Lease
  readonly payments: readonly RentPayment[]
  readonly onPay: (payment: RentPayment) => void
}

export function NextRentCard({ lease, payments, onPay }: NextRentCardProps) {
  const { t } = useTranslation()
  const next = findNextRent(payments)
  const awaitingSignature = getLeaseStatus(lease) === 'pending-signature'

  if (!next) {
    return (
      <section className="rounded-2xl border border-pl-line bg-pl-surface p-5">
        <h2 className="mb-1 font-heading text-lg font-bold text-pl-text">{t('management.rent.next_title')}</h2>
        <p className="text-sm text-pl-muted">{t('management.rent.all_paid')}</p>
      </section>
    )
  }

  const status = getRentStatus(next)
  const lateDays = daysOverdue(next)
  return (
    <section className="rounded-2xl border border-pl-line bg-pl-surface p-5" aria-labelledby="next-rent-heading">
      <h2 id="next-rent-heading" className="mb-3 font-heading text-lg font-bold text-pl-text">
        {t('management.rent.next_title')}
      </h2>
      <div className="mb-1 flex flex-wrap items-center gap-3">
        <span className="text-3xl font-bold text-pl-text">{formatTZS(next.amount)}</span>
        <MetaBadge meta={RENT_STATUS_META[status]} />
      </div>
      <p className="mb-4 text-sm text-pl-muted">
        {status === 'overdue' ? t('management.rent.overdue_note', { count: lateDays }) : t('management.rent.due_on', { date: formatDate(next.dueDate) })}
      </p>
      {awaitingSignature ? (
        <p className="text-sm text-pl-muted">
          {t('management.rent.sign_first')}{' '}
          <Link to={`/tenant/agreement/${lease.id}`} className="font-semibold text-pl-accent hover:underline">
            {t('management.agreement.open')}
          </Link>
        </p>
      ) : (
        <PrimaryButton onClick={() => onPay(next)} className="min-h-11 sm:w-auto">
          {t('management.rent.pay_button')}
        </PrimaryButton>
      )}
    </section>
  )
}
