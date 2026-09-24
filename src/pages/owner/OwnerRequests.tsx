import { useState } from 'react'
import { siteVisitRequests, properties } from '@/data/mockData'
import { useEvents } from '@/lib/events'
import { useAuth } from '@/lib/auth'

const statusLabel: Record<string, string> = {
  pending: 'Pending',
  declined: 'Declined',
  payment_confirmed: 'Payment Confirmed',
}

const statusClasses: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  declined: 'bg-zinc-100 text-pl-muted border-zinc-200',
  payment_confirmed: 'bg-emerald-50 text-pl-accent-dark border-emerald-200',
}

export function OwnerRequests() {
  const [requests, setRequests] = useState(siteVisitRequests)
  const { addEvent } = useEvents()
  const { user } = useAuth()

  const handleConfirm = (id: string) => {
    setRequests(prev => prev.map(r => 
      r.id === id ? { ...r, ownerConfirmedAt: new Date().toISOString(), visitDate: new Date(Date.now() + 86400000).toISOString() } : r
    ))
    const req = requests.find(r => r.id === id)
    if (req) {
      addEvent({
        propertyId: req.propertyId,
        type: 'visit_confirmed',
        actorId: user?.id ?? 'owner1',
        summary: `${user?.name ?? 'Property Owner'} confirmed the site visit.`,
        requestId: id,
      })
    }
  }

  // Mock: show all requests across all properties
  const enriched = requests.map(r => ({
    ...r,
    property: properties.find(p => p.id === r.propertyId),
  }))

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-pl-ink mb-1">Visit Requests</h1>
        <p className="text-pl-muted">All site visit requests across your properties.</p>
      </div>

      {enriched.length === 0 ? (
        <div className="bg-white rounded-2xl border border-pl-line p-12 text-center text-pl-muted">
          No visit requests yet. They'll appear here once buyers request to see your properties.
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-2xl border border-pl-line overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-pl-line bg-pl-surface">
                  <th className="text-left px-5 py-3 text-xs font-bold text-pl-muted uppercase tracking-wide">Property</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-pl-muted uppercase tracking-wide">Buyer</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-pl-muted uppercase tracking-wide">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-pl-muted uppercase tracking-wide">Requested</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-pl-muted uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody>
                {enriched.map(r => (
                  <tr key={r.id} className="border-b border-pl-line last:border-0 hover:bg-pl-surface/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-pl-ink">{r.property?.title ?? r.propertyId}</div>
                      <div className="text-xs text-pl-muted">{r.property?.location}</div>
                    </td>
                    <td className="px-5 py-4 text-pl-muted">buyer #{r.buyerId.slice(-4)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusClasses[r.status]}`}>
                        {statusLabel[r.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-pl-muted text-xs">
                      {new Date(r.requestedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4">
                      {r.status === 'pending' && !r.ownerConfirmedAt && (
                        <button 
                          onClick={() => handleConfirm(r.id)}
                          className="bg-pl-ink text-white px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-pl-ink/90 transition-colors"
                        >
                          Confirm This Visit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {enriched.map(r => (
              <div key={r.id} className="bg-white rounded-2xl border border-pl-line p-5">
                <div className="font-bold text-pl-ink mb-1">{r.property?.title ?? r.propertyId}</div>
                <div className="text-sm text-pl-muted mb-3">{r.property?.location}</div>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusClasses[r.status]}`}>
                    {statusLabel[r.status]}
                  </span>
                  <span className="text-xs text-pl-muted">
                    {new Date(r.requestedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                {r.status === 'pending' && !r.ownerConfirmedAt && (
                  <button 
                    onClick={() => handleConfirm(r.id)}
                    className="mt-3 w-full bg-pl-ink text-white px-3 py-2 rounded-xl text-sm font-semibold hover:bg-pl-ink/90 transition-colors"
                  >
                    Confirm This Visit
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
