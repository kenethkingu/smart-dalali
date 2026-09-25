import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Clock, CheckCircle, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/lib/auth'
import { VisitRequestCard } from '@/components/buyer/VisitRequestCard'
import { PrimaryButton } from '@/components/shared/Bits'

import { useRequests } from '@/lib/requests'
import { useEvents } from '@/lib/events'

export function BuyerDashboard() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const { requests: allRequests, updateRequest } = useRequests()
  const { addEvent } = useEvents()
  
  const requests = allRequests.filter(r => r.buyerId === user?.id || r.buyerId === 'buyer1')

  const pending = requests.filter(r => r.status === 'pending').length
  const confirmed = requests.filter(r => r.status === 'payment_confirmed').length

  const handleDecline = (id: string) => {
    updateRequest(id, { status: 'declined', declinedAt: new Date().toISOString() })
    const req = allRequests.find(r => r.id === id)
    if (req) {
      addEvent({
        propertyId: req.propertyId,
        type: 'visit_declined',
        actorId: user?.id ?? 'buyer1',
        summary: `${user?.name ?? 'Buyer'} declined the site visit request.`,
        requestId: id,
      })
    }
  }

  const handlePay = (id: string) => {
    updateRequest(id, { status: 'payment_confirmed', paymentConfirmedAt: new Date().toISOString() })
    const req = allRequests.find(r => r.id === id)
    if (req) {
      addEvent({
        propertyId: req.propertyId,
        type: 'payment_confirmed',
        actorId: user?.id ?? 'buyer1',
        summary: `${user?.name ?? 'Buyer'} confirmed payment for the site visit.`,
        requestId: id,
      })
    }
  }

  return (
    <div className="max-w-3xl text-pl-text">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-pl-text mb-1">
          {t('buyer_dashboard.title')}, {user?.name}
        </h1>
        <p className="text-pl-muted">{t('buyer_dashboard.subtitle')}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-pl-surface p-5 rounded-2xl shadow-sm border border-pl-line text-pl-text">
          <div className="text-xs font-semibold text-pl-muted uppercase tracking-wide mb-2">{t('buyer_dashboard.stat_requests')}</div>
          <div className="text-3xl font-bold text-pl-text">{requests.length}</div>
        </div>
        <div className="bg-pl-surface p-5 rounded-2xl shadow-sm border border-pl-line text-pl-text">
          <div className="text-xs font-semibold text-pl-muted uppercase tracking-wide mb-2 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" /> {t('status.pending')}
          </div>
          <div className="text-3xl font-bold text-amber-500">{pending}</div>
        </div>
        <div className="bg-pl-surface p-5 rounded-2xl shadow-sm border border-pl-line text-pl-text">
          <div className="text-xs font-semibold text-pl-muted uppercase tracking-wide mb-2 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-pl-accent" /> {t('status.verified')}
          </div>
          <div className="text-3xl font-bold text-pl-accent">{confirmed}</div>
        </div>
      </div>

      {/* Requests list or empty state */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-pl-text">{t('buyer_dashboard.tabs.requests')}</h2>
        {requests.length > 3 && (
          <Link to="/buyer/requests" className="text-sm font-semibold text-pl-accent hover:underline">
            {t('home.view_all')} →
          </Link>
        )}
      </div>

      {requests.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-pl-surface rounded-2xl border border-pl-line p-12 text-center text-pl-text"
        >
          <div className="w-16 h-16 rounded-full bg-pl-bg flex items-center justify-center mx-auto mb-5 border border-pl-line">
            <Search className="w-7 h-7 text-pl-muted" />
          </div>
          <h3 className="text-xl font-bold text-pl-text mb-2">{t('properties.zero_results_title')}</h3>
          <p className="text-pl-muted mb-6 max-w-sm mx-auto">
            {t('properties.zero_results_desc')}
          </p>
          <Link to="/properties">
            <PrimaryButton>{t('common.browse_properties')}</PrimaryButton>
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {requests.slice(0, 3).map(req => (
              <VisitRequestCard
                key={req.id}
                request={req}
                onDecline={handleDecline}
                onPay={handlePay}
              />
            ))}
          </AnimatePresence>
          {requests.length > 3 && (
            <div className="pt-2">
              <Link to="/buyer/requests">
                <PrimaryButton className="w-full text-sm font-semibold bg-pl-surface text-pl-text border border-pl-line hover:bg-pl-bg">
                  {t('home.view_all')} ({requests.length})
                </PrimaryButton>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
