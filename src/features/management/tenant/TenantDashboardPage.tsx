import { Home } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { PrimaryButton } from '@/components/shared/Bits'
import { useAuth } from '@/lib/auth'
import { useLeasePayments } from '@/hooks/management/usePayments'
import { useLeaseTickets } from '@/hooks/management/useTickets'
import { getLeaseStatus } from '@/services/management/leaseService'
import { EmptyState } from '../shared/EmptyState'
import { InlineNotice } from '../shared/InlineNotice'
import { PageHeader } from '../shared/PageHeader'
import { HomeCard } from './HomeCard'
import { LatestActivity } from './LatestActivity'
import { LeaseSummary } from './LeaseSummary'
import { LeaseSwitcher } from './LeaseSwitcher'
import { NextRentCard } from './NextRentCard'
import { OpenTicketsCard } from './OpenTicketsCard'
import { PayRentSheet } from './PayRentSheet'
import { ReceiptDialog } from './ReceiptDialog'
import { RenewalOfferCard } from './RenewalOfferCard'
import { useActiveLease } from './useActiveLease'
import type { RentPayment } from '@/types/management'

export default function TenantDashboardPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { leases, lease, select } = useActiveLease()
  const payments = useLeasePayments(lease?.id)
  const tickets = useLeaseTickets(lease?.id)
  const [paying, setPaying] = useState<RentPayment | null>(null)
  const [receipt, setReceipt] = useState<RentPayment | null>(null)

  if (!lease) {
    return (
      <div className="max-w-3xl">
        <PageHeader title={t('management.tenant.dashboard_title')} />
        <EmptyState
          icon={Home}
          title={t('management.tenant.empty_title')}
          description={t('management.tenant.empty_description')}
          action={
            <Link to="/properties">
              <PrimaryButton className="min-h-11 sm:w-auto">{t('common.browse_properties')}</PrimaryButton>
            </Link>
          }
        />
      </div>
    )
  }

  const awaitingSignature = getLeaseStatus(lease) === 'pending-signature'
  return (
    <div className="max-w-4xl text-pl-text">
      <PageHeader title={t('management.tenant.dashboard_title')} description={t('management.tenant.dashboard_subtitle', { name: user?.name ?? '' })} />
      <LeaseSwitcher leases={leases} value={lease.id} onChange={select} />
      <HomeCard lease={lease} />
      {awaitingSignature && (
        <div className="mb-6 space-y-3">
          <InlineNotice>{t('management.agreement.pending_notice')}</InlineNotice>
          <Link to={`/tenant/agreement/${lease.id}`}>
            <PrimaryButton className="min-h-11 sm:w-auto">{t('management.agreement.open')}</PrimaryButton>
          </Link>
        </div>
      )}
      <RenewalOfferCard lease={lease} />
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <NextRentCard lease={lease} payments={payments} onPay={setPaying} />
        <LeaseSummary lease={lease} />
      </div>
      <div className="mb-8">
        <OpenTicketsCard tickets={tickets} />
      </div>
      <LatestActivity propertyId={lease.propertyId} />
      <PayRentSheet payment={paying} onClose={() => setPaying(null)} onViewReceipt={setReceipt} />
      <ReceiptDialog payment={receipt} lease={lease} onClose={() => setReceipt(null)} />
    </div>
  )
}
