import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth'
import { siteVisitRequests } from '@/data/mockData'
import { VisitRequestCard } from '@/components/buyer/VisitRequestCard'
import { Pill } from '@/components/shared/Bits'
import type { SiteVisitRequest } from '@/types'

export function BuyerRequests() {
  const { user } = useAuth()
  const [filter, setFilter] = useState<'all' | SiteVisitRequest['status']>('all')

  const myRequests = siteVisitRequests.filter(r => r.buyerId === user?.id)
  const filtered = myRequests.filter(r => filter === 'all' || r.status === filter)

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-pl-ink mb-1">My Requests</h1>
        <p className="text-pl-muted">Manage your site visit requests and property viewings.</p>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <Pill active={filter === 'all'} onClick={() => setFilter('all')}>
          All Requests
        </Pill>
        <Pill active={filter === 'pending'} onClick={() => setFilter('pending')}>
          Pending
        </Pill>
        <Pill active={filter === 'payment_confirmed'} onClick={() => setFilter('payment_confirmed')}>
          Confirmed
        </Pill>
        <Pill active={filter === 'declined'} onClick={() => setFilter('declined')}>
          Declined
        </Pill>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-pl-line p-12 text-center text-pl-muted">
          No {filter !== 'all' ? filter : ''} requests found.
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
