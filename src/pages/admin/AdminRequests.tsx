import { siteVisitRequests, properties } from '@/data/mockData'

const statusLabel: Record<string, string> = {
  pending: 'Pending',
  declined: 'Declined',
  payment_confirmed: 'Paid',
}
const statusClasses: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  declined: 'bg-zinc-100 text-pl-muted border-zinc-200',
  payment_confirmed: 'bg-emerald-50 text-pl-accent-dark border-emerald-200',
}

// Mock buyer names (normally would come from users data)
const buyerNames: Record<string, string> = {
  buyer1: 'Amina Juma',
  buyer2: 'John Mwakalinga',
}

export function AdminRequests() {
  const enriched = siteVisitRequests.map(r => ({
    ...r,
    property: properties.find(p => p.id === r.propertyId),
    buyerName: buyerNames[r.buyerId] ?? r.buyerId,
    ownerName: 'John Mwakalinga', // mock — in production, look up from property.ownerId
  }))

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-pl-ink mb-1">All Site Visit Requests</h1>
        <p className="text-pl-muted">Platform-wide transaction oversight — {enriched.length} total requests.</p>
      </div>

      <div className="bg-white rounded-2xl border border-pl-line overflow-hidden">
        {/* Desktop table */}
        <table className="hidden md:table w-full text-sm">
          <thead>
            <tr className="border-b border-pl-line bg-pl-surface">
              <th className="text-left px-5 py-3 text-xs font-bold text-pl-muted uppercase tracking-wide">Property</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-pl-muted uppercase tracking-wide">Buyer</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-pl-muted uppercase tracking-wide">Owner</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-pl-muted uppercase tracking-wide">Status</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-pl-muted uppercase tracking-wide">Requested</th>
            </tr>
          </thead>
          <tbody>
            {enriched.map(r => (
              <tr key={r.id} className="border-b border-pl-line last:border-0 hover:bg-pl-surface/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="font-semibold text-pl-ink">{r.property?.title ?? r.propertyId}</div>
                  <div className="text-xs text-pl-muted">{r.property?.location}</div>
                </td>
                <td className="px-5 py-4 text-pl-muted">{r.buyerName}</td>
                <td className="px-5 py-4 text-pl-muted">{r.ownerName}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusClasses[r.status]}`}>
                    {statusLabel[r.status]}
                  </span>
                </td>
                <td className="px-5 py-4 text-pl-muted text-xs">
                  {new Date(r.requestedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-pl-line">
          {enriched.map(r => (
            <div key={r.id} className="p-5">
              <div className="font-bold text-pl-ink mb-1">{r.property?.title ?? r.propertyId}</div>
              <div className="text-sm text-pl-muted mb-2">{r.property?.location}</div>
              <div className="flex flex-wrap gap-2 text-xs text-pl-muted mb-2">
                <span>Buyer: {r.buyerName}</span>
                <span>•</span>
                <span>Owner: {r.ownerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusClasses[r.status]}`}>
                  {statusLabel[r.status]}
                </span>
                <span className="text-xs text-pl-muted">
                  {new Date(r.requestedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
