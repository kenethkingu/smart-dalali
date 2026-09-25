import { siteVisitRequests, properties } from '@/data/mockData'
import { useTranslation } from 'react-i18next'

export function AdminRequests() {
  const { t } = useTranslation()

  const statusLabel: Record<string, string> = {
    pending: t('status.pending'),
    declined: t('status.cancelled'),
    payment_confirmed: t('buyer_dashboard.stat_confirmed'),
  }

  const statusClasses: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    declined: 'bg-pl-bg text-pl-muted border-pl-line',
    payment_confirmed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
  }

  const buyerNames: Record<string, string> = {
    buyer1: 'Amina Juma',
    buyer2: 'John Mwakalinga',
  }

  const enriched = siteVisitRequests.map(r => ({
    ...r,
    property: properties.find(p => p.id === r.propertyId),
    buyerName: buyerNames[r.buyerId] ?? r.buyerId,
    ownerName: 'John Mwakalinga',
  }))

  return (
    <div className="max-w-5xl text-pl-text">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-pl-text mb-1">{t('admin_dashboard.tabs.requests')}</h1>
        <p className="text-pl-muted">{t('admin_dashboard.subtitle')} — {enriched.length} total requests.</p>
      </div>

      <div className="bg-pl-surface rounded-2xl border border-pl-line overflow-hidden text-pl-text">
        <table className="hidden md:table w-full text-sm">
          <thead>
            <tr className="border-b border-pl-line bg-pl-bg">
              <th className="text-left px-5 py-3 text-xs font-bold text-pl-muted uppercase tracking-wide">{t('nav.properties')}</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-pl-muted uppercase tracking-wide">{t('nav.role_buyer')}</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-pl-muted uppercase tracking-wide">{t('nav.role_owner')}</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-pl-muted uppercase tracking-wide">{t('common.status')}</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-pl-muted uppercase tracking-wide">{t('history.visit_requested')}</th>
            </tr>
          </thead>
          <tbody>
            {enriched.map(r => (
              <tr key={r.id} className="border-b border-pl-line last:border-0 hover:bg-pl-bg/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="font-semibold text-pl-text">{r.property?.title ?? r.propertyId}</div>
                  <div className="text-xs text-pl-muted">{r.property?.location}</div>
                </td>
                <td className="px-5 py-4 text-pl-muted">{r.buyerName}</td>
                <td className="px-5 py-4 text-pl-muted">{r.ownerName}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusClasses[r.status]}`}>
                    {statusLabel[r.status] ?? r.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-pl-muted text-xs">
                  {new Date(r.requestedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="md:hidden divide-y divide-pl-line">
          {enriched.map(r => (
            <div key={r.id} className="p-5">
              <div className="font-bold text-pl-text mb-1">{r.property?.title ?? r.propertyId}</div>
              <div className="text-sm text-pl-muted mb-2">{r.property?.location}</div>
              <div className="flex flex-wrap gap-2 text-xs text-pl-muted mb-2">
                <span>Buyer: {r.buyerName}</span>
                <span>•</span>
                <span>Owner: {r.ownerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusClasses[r.status]}`}>
                  {statusLabel[r.status] ?? r.status}
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
