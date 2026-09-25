import { Link } from 'react-router-dom'
import { Plus, Building2, Eye, PenLine } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/lib/auth'
import { properties, siteVisitRequests } from '@/data/mockData'
import { PrimaryButton, PropertyStatusBadge, GhostButton, formatPrice } from '@/components/shared/Bits'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useState } from 'react'

export function OwnerDashboard() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const myProperties = properties
  const requestsThisWeek = siteVisitRequests.filter(r => {
    const ago = Date.now() - new Date(r.requestedAt).getTime()
    return ago < 7 * 24 * 60 * 60 * 1000
  }).length

  const approved = myProperties.filter(p => p.status === 'approved').length
  const pending = myProperties.filter(p => p.status === 'pending').length

  const [verificationStatus, setVerificationStatus] = useState<'unverified' | 'pending'>('unverified')
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false)

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setVerificationStatus('pending')
    setIsVerifyModalOpen(false)
  }

  return (
    <div className="max-w-4xl text-pl-text">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-pl-text mb-1">{t('owner_dashboard.title')}</h1>
          <p className="text-pl-muted">{t('owner_dashboard.subtitle')} ({user?.name})</p>
        </div>
        <Link to="/owner/properties/new">
          <PrimaryButton className="shrink-0">
            <Plus className="w-4 h-4" /> {t('owner_dashboard.form.title_add')}
          </PrimaryButton>
        </Link>
      </div>

      {verificationStatus === 'unverified' && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-amber-500 mb-1">{t('status.title_verified')}</h3>
            <p className="text-sm text-pl-muted">{t('cta.owner_desc')}</p>
          </div>
          <PrimaryButton onClick={() => setIsVerifyModalOpen(true)} className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white">
            {t('common.confirm')}
          </PrimaryButton>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-pl-surface p-5 rounded-2xl shadow-sm border border-pl-line text-pl-text">
          <div className="text-xs font-semibold text-pl-muted uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-pl-accent" /> {t('owner_dashboard.stat_active')}
          </div>
          <div className="text-3xl font-bold text-pl-text">{approved}</div>
        </div>
        <div className="bg-pl-surface p-5 rounded-2xl shadow-sm border border-pl-line text-pl-text">
          <div className="text-xs font-semibold text-pl-muted uppercase tracking-wide mb-2">{t('owner_dashboard.stat_pending')}</div>
          <div className="text-3xl font-bold text-amber-500">{pending}</div>
        </div>
        <div className="bg-pl-surface p-5 rounded-2xl shadow-sm border border-pl-line text-pl-text">
          <div className="text-xs font-semibold text-pl-muted uppercase tracking-wide mb-2">{t('owner_dashboard.stat_requests')}</div>
          <div className="text-3xl font-bold text-pl-text">{requestsThisWeek}</div>
        </div>
      </div>

      {/* My Properties */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-pl-text">{t('owner_dashboard.tabs.properties')}</h2>
        {myProperties.length > 3 && (
          <Link to="/owner/properties" className="text-sm font-semibold text-pl-accent hover:underline">
            {t('home.view_all')} →
          </Link>
        )}
      </div>

      {myProperties.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-pl-surface rounded-2xl border border-pl-line p-16 text-center text-pl-text"
        >
          <div className="w-16 h-16 rounded-full bg-pl-bg flex items-center justify-center mx-auto mb-5 border border-pl-line">
            <Building2 className="w-7 h-7 text-pl-muted" />
          </div>
          <h3 className="text-xl font-bold text-pl-text mb-2">{t('owner_dashboard.form.title_add')}</h3>
          <p className="text-pl-muted mb-6 max-w-sm mx-auto">
            {t('cta.owner_desc')}
          </p>
          <Link to="/owner/properties/new">
            <PrimaryButton className="h-12 px-8 text-base">
              <Plus className="w-4 h-4" /> {t('owner_dashboard.form.title_add')}
            </PrimaryButton>
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {myProperties.slice(0, 3).map(p => {
            const openRequests = siteVisitRequests.filter(r => r.propertyId === p.id && r.status === 'pending').length
            return (
              <div key={p.id} className="bg-pl-surface rounded-2xl border border-pl-line p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between text-pl-text">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-pl-text truncate">{p.title}</h3>
                    <PropertyStatusBadge status={p.status} />
                    {openRequests > 0 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/30">
                        {openRequests} {t('status.pending')}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-pl-muted truncate">{p.location}</p>
                  <p className="text-sm font-semibold text-pl-text mt-0.5">
                    TSh {formatPrice(p.price)}{p.priceUnit === 'month' ? '/mo' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link to={`/properties/${p.id}`}>
                    <GhostButton className="h-9 px-3 text-xs border-pl-line text-pl-text">
                      <Eye className="w-3.5 h-3.5" /> {t('common.view')}
                    </GhostButton>
                  </Link>
                  <Link to={`/owner/properties/${p.id}/edit`}>
                    <GhostButton className="h-9 px-3 text-xs border-pl-line text-pl-text">
                      <PenLine className="w-3.5 h-3.5" /> {t('common.edit')}
                    </GhostButton>
                  </Link>
                </div>
              </div>
            )
          })}
          {myProperties.length > 3 && (
            <div className="pt-2">
              <Link to="/owner/properties">
                <PrimaryButton className="w-full text-sm font-semibold bg-pl-surface text-pl-text border border-pl-line hover:bg-pl-bg">
                  {t('home.view_all')} ({myProperties.length})
                </PrimaryButton>
              </Link>
            </div>
          )}
        </div>
      )}

      <Dialog open={isVerifyModalOpen} onOpenChange={setIsVerifyModalOpen}>
        <DialogContent className="bg-pl-surface border border-pl-line text-pl-text">
          <form onSubmit={handleVerifySubmit}>
            <DialogHeader>
              <DialogTitle className="text-pl-text">{t('status.title_verified')}</DialogTitle>
              <DialogDescription className="text-pl-muted">
                Provide identity documents for property verification.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 text-pl-text">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-pl-text">NIDA Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. 199012345-67890-12345-67" 
                  className="w-full h-12 px-4 rounded-xl border border-pl-line bg-pl-bg text-pl-text placeholder:text-pl-muted focus:outline-none focus:border-pl-accent"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <PrimaryButton type="submit" className="w-full">
                {t('common.confirm')}
              </PrimaryButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
