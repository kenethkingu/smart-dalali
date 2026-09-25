import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { siteVisitRequests, properties } from '@/data/mockData'
import { useEvents } from '@/lib/events'
import { useAuth } from '@/lib/auth'

export function OwnerRequests() {
  const [requests, setRequests] = useState(siteVisitRequests)
  const { addEvent } = useEvents()
  const { user } = useAuth()
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

  const enriched = requests.map(r => ({
    ...r,
    property: properties.find(p => p.id === r.propertyId),
  }))

  return (
    <div className="max-w-5xl text-pl-text">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-pl-text mb-1">{t('owner_dashboard.stat_requests')}</h1>
        <p className="text-pl-muted">{t('owner_dashboard.subtitle')}</p>
      </div>

      {enriched.length === 0 ? (
        <div className="bg-pl-surface rounded-2xl border border-pl-line p-12 text-center text-pl-muted">
          {t('properties.zero_results_title')}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-pl-surface rounded-2xl border border-pl-line overflow-hidden text-pl-text">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-pl-line bg-pl-bg">
                  <th className="text-left px-5 py-3 text-xs font-bold text-pl-muted uppercase tracking-wide">{t('nav.properties')}</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-pl-muted uppercase tracking-wide">{t('nav.role_buyer')}</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-pl-muted uppercase tracking-wide">{t('common.status')}</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-pl-muted uppercase tracking-wide">{t('history.visit_requested')}</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-pl-muted uppercase tracking-wide">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {enriched.map(r => (
                  <tr key={r.id} className="border-b border-pl-line last:border-0 hover:bg-pl-bg/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-pl-text">{r.property?.title ?? r.propertyId}</div>
                      <div className="text-xs text-pl-muted">{r.property?.location}</div>
                    </td>
                    <td className="px-5 py-4 text-pl-muted">buyer #{r.buyerId.slice(-4)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusClasses[r.status]}`}>
                        {statusLabel[r.status] ?? r.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-pl-muted text-xs">
                      {new Date(r.requestedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4">
                      {r.status === 'pending' && !r.ownerConfirmedAt && (
                        <button 
                          onClick={() => handleConfirm(r.id)}
                          className="bg-pl-accent text-white px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-pl-accent-dark transition-colors"
                        >
                          {t('common.confirm')}
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
              <div key={r.id} className="bg-pl-surface rounded-2xl border border-pl-line p-5 text-pl-text">
                <div className="font-bold text-pl-text mb-1">{r.property?.title ?? r.propertyId}</div>
                <div className="text-sm text-pl-muted mb-3">{r.property?.location}</div>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusClasses[r.status]}`}>
                    {statusLabel[r.status] ?? r.status}
                  </span>
                  <span className="text-xs text-pl-muted">
                    {new Date(r.requestedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                {r.status === 'pending' && !r.ownerConfirmedAt && (
                  <button 
                    onClick={() => handleConfirm(r.id)}
                    className="mt-3 w-full bg-pl-accent text-white px-3 py-2 rounded-xl text-sm font-semibold hover:bg-pl-accent-dark transition-colors"
                  >
                    {t('common.confirm')}
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
