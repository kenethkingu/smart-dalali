import { Shield, Building2, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function AdminDashboard() {
  const { t } = useTranslation()
  return (
    <div className="max-w-5xl text-pl-text">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2 text-pl-text flex items-center gap-2">
          <Shield className="w-8 h-8 text-pl-accent" /> {t('admin_dashboard.title')}
        </h1>
        <p className="text-pl-muted">{t('admin_dashboard.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-pl-surface p-6 rounded-2xl shadow-sm border border-pl-line text-pl-text">
          <div className="text-sm font-medium text-pl-muted mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-pl-accent" /> {t('admin_dashboard.stat_users')}
          </div>
          <div className="text-3xl font-bold text-pl-text mb-1">1,248</div>
          <div className="text-sm text-emerald-500 font-medium">{t('admin_dashboard.stat_users_growth', { n: 12 })}</div>
        </div>
        
        <div className="bg-pl-surface p-6 rounded-2xl shadow-sm border border-pl-line text-pl-text">
          <div className="text-sm font-medium text-pl-muted mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-500" /> {t('admin_dashboard.stat_pending_props')}
          </div>
          <div className="text-3xl font-bold text-amber-500 mb-1">5</div>
          <div className="text-sm text-pl-muted font-medium">{t('status.pending')}</div>
        </div>
        
        <div className="bg-pl-surface p-6 rounded-2xl shadow-sm border border-pl-line text-pl-text">
          <div className="text-sm font-medium text-pl-muted mb-4">{t('admin_dashboard.stat_revenue')}</div>
          <div className="text-3xl font-bold text-pl-text mb-1">TSh 45M</div>
          <div className="text-sm text-emerald-500 font-medium">{t('admin_dashboard.stat_revenue_growth')}</div>
        </div>
      </div>
      
      <div className="bg-pl-surface rounded-2xl shadow-sm border border-pl-line p-6 text-pl-text">
        <h3 className="text-lg font-bold mb-4 text-pl-text">{t('history.title')}</h3>
        <div className="space-y-4">
          <div className="flex gap-4 items-start py-3 border-b border-pl-line last:border-0">
            <div className="w-2 h-2 mt-2 rounded-full bg-pl-accent shrink-0" />
            <div>
              <p className="text-pl-text font-medium">{t('cta.owner_title')}</p>
              <p className="text-sm text-pl-muted">Modern House in Masaki • {t('common.two_hours_ago')}</p>
            </div>
          </div>
          <div className="flex gap-4 items-start py-3 border-b border-pl-line last:border-0">
            <div className="w-2 h-2 mt-2 rounded-full bg-amber-500 shrink-0" />
            <div>
              <p className="text-pl-text font-medium">{t('hero.subheadline')}</p>
              <p className="text-sm text-pl-muted">Prime Plot in Kigamboni • {t('common.five_hours_ago')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
