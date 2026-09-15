import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Clock, CheckCircle, Search } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { siteVisitRequests } from '@/data/mockData'
import { VisitRequestCard } from '@/components/buyer/VisitRequestCard'
import { PrimaryButton } from '@/components/shared/Bits'

export function BuyerDashboard() {
  const { user } = useAuth()
  const [requests, setRequests] = useState(
    siteVisitRequests.filter(r => r.buyerId === 'buyer1') // mock: show buyer1's requests
  )

  const pending = requests.filter(r => r.status === 'pending').length
  const confirmed = requests.filter(r => r.status === 'payment_confirmed').length

  const handleDecline = (id: string) => {
    setRequests(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'declined' as const, declinedAt: new Date().toISOString() } : r)
    )
  }

  const handlePay = (id: string) => {
    setRequests(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'payment_confirmed' as const, paymentConfirmedAt: new Date().toISOString() } : r)
    )
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-pl-ink mb-1">
          Welcome back, {user?.name}
        </h1>
        <p className="text-pl-muted">Track your site visit requests below.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-pl-line">
          <div className="text-xs font-semibold text-pl-muted uppercase tracking-wide mb-2">Total Requests</div>
          <div className="text-3xl font-bold text-pl-ink">{requests.length}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-pl-line">
          <div className="text-xs font-semibold text-pl-muted uppercase tracking-wide mb-2 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Pending
          </div>
          <div className="text-3xl font-bold text-amber-600">{pending}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-pl-line">
          <div className="text-xs font-semibold text-pl-muted uppercase tracking-wide mb-2 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Confirmed
          </div>
          <div className="text-3xl font-bold text-pl-accent-dark">{confirmed}</div>
        </div>
      </div>

      {/* Requests list or empty state */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-pl-ink">Recent Site Visit Requests</h2>
        {requests.length > 3 && (
          <Link to="/buyer/requests" className="text-sm font-semibold text-pl-accent hover:text-pl-accent-dark">
            View All Requests →
          </Link>
        )}
      </div>

      {requests.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl border border-pl-line p-12 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-pl-surface flex items-center justify-center mx-auto mb-5">
            <Search className="w-7 h-7 text-pl-muted" />
          </div>
          <h3 className="text-xl font-bold text-pl-ink mb-2">No requests yet</h3>
          <p className="text-pl-muted mb-6 max-w-sm mx-auto">
            You haven't requested a site visit yet. Browse properties to get started.
          </p>
          <Link to="/properties">
            <PrimaryButton>Browse Properties</PrimaryButton>
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
                <PrimaryButton className="w-full text-sm font-semibold bg-white text-pl-ink border border-pl-line hover:bg-pl-surface hover:text-pl-ink">
                  View All {requests.length} Requests
                </PrimaryButton>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
