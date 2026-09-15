import { Link } from 'react-router-dom'
import { Plus, Building2, Eye, PenLine } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth'
import { properties, siteVisitRequests } from '@/data/mockData'
import { PrimaryButton, PropertyStatusBadge, GhostButton, formatPrice } from '@/components/shared/Bits'

export function OwnerDashboard() {
  const { user } = useAuth()
  // Mock: show all properties as belonging to this owner
  const myProperties = properties
  const requestsThisWeek = siteVisitRequests.filter(r => {
    const ago = Date.now() - new Date(r.requestedAt).getTime()
    return ago < 7 * 24 * 60 * 60 * 1000
  }).length

  const approved = myProperties.filter(p => p.status === 'approved').length
  const pending = myProperties.filter(p => p.status === 'pending').length

  return (
    <div className="max-w-4xl">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-pl-ink mb-1">Owner Dashboard</h1>
          <p className="text-pl-muted">Welcome back, {user?.name}. Manage your listings and visit requests.</p>
        </div>
        <Link to="/owner/properties/new">
          <PrimaryButton className="shrink-0">
            <Plus className="w-4 h-4" /> List a Property
          </PrimaryButton>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-pl-line">
          <div className="text-xs font-semibold text-pl-muted uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Building2 className="w-3 h-3" /> Active Listings
          </div>
          <div className="text-3xl font-bold text-pl-ink">{approved}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-pl-line">
          <div className="text-xs font-semibold text-pl-muted uppercase tracking-wide mb-2">Pending Review</div>
          <div className="text-3xl font-bold text-amber-600">{pending}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-pl-line">
          <div className="text-xs font-semibold text-pl-muted uppercase tracking-wide mb-2">Visit Requests This Week</div>
          <div className="text-3xl font-bold text-pl-ink">{requestsThisWeek}</div>
        </div>
      </div>

      {/* My Properties */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-pl-ink">Recent Properties</h2>
        {myProperties.length > 3 && (
          <Link to="/owner/properties" className="text-sm font-semibold text-pl-accent hover:text-pl-accent-dark">
            View All Properties →
          </Link>
        )}
      </div>

      {myProperties.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl border border-pl-line p-16 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-pl-surface flex items-center justify-center mx-auto mb-5">
            <Building2 className="w-7 h-7 text-pl-muted" />
          </div>
          <h3 className="text-xl font-bold text-pl-ink mb-2">List your first property</h3>
          <p className="text-pl-muted mb-6 max-w-sm mx-auto">
            Once you list a property and it's approved, you'll start receiving site visit requests here.
          </p>
          <Link to="/owner/properties/new">
            <PrimaryButton className="h-12 px-8 text-base">
              <Plus className="w-4 h-4" /> Create Your First Listing
            </PrimaryButton>
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {myProperties.slice(0, 3).map(p => {
            const openRequests = siteVisitRequests.filter(r => r.propertyId === p.id && r.status === 'pending').length
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-pl-line p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-pl-ink truncate">{p.title}</h3>
                    <PropertyStatusBadge status={p.status} />
                    {openRequests > 0 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {openRequests} open request{openRequests > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-pl-muted truncate">{p.location}</p>
                  <p className="text-sm font-semibold text-pl-ink mt-0.5">
                    TSh {formatPrice(p.price)}{p.priceUnit === 'month' ? '/mo' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link to={`/properties/${p.id}`}>
                    <GhostButton className="h-9 px-3 text-xs">
                      <Eye className="w-3.5 h-3.5" /> View
                    </GhostButton>
                  </Link>
                  <Link to={`/owner/properties/${p.id}/edit`}>
                    <GhostButton className="h-9 px-3 text-xs">
                      <PenLine className="w-3.5 h-3.5" /> Edit
                    </GhostButton>
                  </Link>
                </div>
              </div>
            )
          })}
          {myProperties.length > 3 && (
            <div className="pt-2">
              <Link to="/owner/properties">
                <PrimaryButton className="w-full text-sm font-semibold bg-white text-pl-ink border border-pl-line hover:bg-pl-surface hover:text-pl-ink">
                  View All {myProperties.length} Properties
                </PrimaryButton>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
