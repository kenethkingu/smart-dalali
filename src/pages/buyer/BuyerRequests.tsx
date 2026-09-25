import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/lib/auth'
import { VisitRequestCard } from '@/components/buyer/VisitRequestCard'
import { Pill } from '@/components/shared/Bits'
import { useRequests } from '@/lib/requests'
import type { SiteVisitRequest } from '@/types'

export function BuyerRequests() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const { requests: allRequests } = useRequests()
  const [filter, setFilter] = useState<'all' | SiteVisitRequest['status']>('all')

  const myRequests = allRequests.filter(r => r.buyerId === user?.id || r.buyerId === 'buyer1')
  const filtered = myRequests.filter(r => filter === 'all' || r.status === filter)

  return (
    <div className="max-w-4xl text-pl-text">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-pl-text mb-1">{t('buyer_dashboard.tabs.requests')}</h1>
        <p className="text-pl-muted">{t('buyer_dashboard.subtitle')}</p>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <Pill active={filter === 'all'} onClick={() => setFilter('all')}>
          {t('common.all')} ({myRequests.length})
        </Pill>
        <Pill active={filter === 'pending'} onClick={() => setFilter('pending')}>
          {t('status.pending')}
        </Pill>
        <Pill active={filter === 'payment_confirmed'} onClick={() => setFilter('payment_confirmed')}>
          {t('buyer_dashboard.stat_confirmed')}
        </Pill>
        <Pill active={filter === 'declined'} onClick={() => setFilter('declined')}>
          {t('status.cancelled')}
        </Pill>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-pl-surface text-pl-text rounded-2xl border border-pl-line p-12 text-center text-pl-muted">
          {t('properties.zero_results_title')}
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map(req => (
              <VisitRequestCard
                key={req.id}
                request={req}
                onDecline={(id) => console.log('Decline', id)}
                onPay={(id) => console.log('Pay', id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
