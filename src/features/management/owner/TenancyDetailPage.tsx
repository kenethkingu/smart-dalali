import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { can } from '@/lib/rbac'
import { useLeaseDocuments } from '@/hooks/management/useDocuments'
import { useLease } from '@/hooks/management/useLeases'
import { useLeasePayments } from '@/hooks/management/usePayments'
import { useLeaseTickets } from '@/hooks/management/useTickets'
import { getLeaseStatus } from '@/services/management/leaseService'
import { leaseResource } from '@/services/management/shared'
import { AccessDenied } from '../shared/AccessDenied'
import { DocumentList } from '../shared/DocumentList'
import { NotFoundState } from '../shared/NotFoundState'
import { PageHeader } from '../shared/PageHeader'
import { TicketDetailSheet } from '../shared/TicketDetailSheet'
import { TicketRow } from '../shared/TicketRow'
import { HomeCard } from '../tenant/HomeCard'
import { LatestActivity } from '../tenant/LatestActivity'
import { LeaseSummary } from '../tenant/LeaseSummary'
import { LeaseActionDialogs } from './LeaseActionDialogs'
import { RentLedger } from './RentLedger'

export default function TenancyDetailPage() {
  const { leaseId } = useParams()
  const { t } = useTranslation()
  const { user } = useAuth()
  const lease = useLease(leaseId)
  const payments = useLeasePayments(leaseId)
  const tickets = useLeaseTickets(leaseId)
  const documents = useLeaseDocuments(leaseId)
  const [openTicket, setOpenTicket] = useState<string | null>(null)

  if (!lease) return <NotFoundState backTo="/owner/tenancies" />
  const resource = leaseResource(lease)
  if (!can(user, 'lease.view', resource)) return <AccessDenied />

  const ended = getLeaseStatus(lease) === 'ended'
  return (
    <div className="max-w-4xl space-y-8 text-pl-text">
      <div>
        <Link to="/owner/tenancies" className="mb-4 inline-flex min-h-11 items-center text-sm font-medium text-pl-muted hover:text-pl-text">
          <ArrowLeft className="mr-1 h-4 w-4 text-pl-accent" aria-hidden="true" /> {t('common.back')}
        </Link>
        <PageHeader title={lease.tenantName} description={t('management.owner.tenancy_subtitle')} />
        <HomeCard lease={lease} />
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <Link to={`/tenant/agreement/${lease.id}`} className="inline-flex min-h-11 items-center font-semibold text-pl-accent hover:underline">
            {t('management.agreement.open')}
          </Link>
          {can(user, 'lease.manage', resource) && !ended && <LeaseActionDialogs lease={lease} />}
        </div>
        {lease.renewalOffer?.status === 'offered' && <p className="text-sm text-pl-muted">{t('management.owner.renewal_pending')}</p>}
      </div>
      <LeaseSummary lease={lease} />
      <RentLedger payments={payments} />
      <section aria-labelledby="tenancy-tickets-heading">
        <h2 id="tenancy-tickets-heading" className="mb-3 font-heading text-lg font-bold">
          {t('management.maintenance.title')}
        </h2>
        {tickets.length === 0 ? (
          <p className="text-sm text-pl-muted">{t('management.maintenance.empty_description')}</p>
        ) : (
          <ul className="space-y-2">
            {tickets.slice(0, 5).map(ticket => (
              <TicketRow key={ticket.id} ticket={ticket} onOpen={setOpenTicket} />
            ))}
          </ul>
        )}
      </section>
      <DocumentList documents={documents} />
      <LatestActivity propertyId={lease.propertyId} />
      <TicketDetailSheet ticketId={openTicket} onClose={() => setOpenTicket(null)} />
    </div>
  )
}
