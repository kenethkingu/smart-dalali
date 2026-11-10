import { Suspense } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/lib/auth'
import { LogOut } from 'lucide-react'
import { getDashboardLinks } from './dashboardLinks'
import { PageSkeleton } from '@/features/management/shared/PageSkeleton'
import { cn } from '@/lib/utils'

export function DashboardShell() {
  const { user, logout } = useAuth()
  const { t } = useTranslation()
  const location = useLocation()
  
  if (!user) return null

  const links = getDashboardLinks(user, t)

  const formatRoleLabel = (role: string) => {
    switch (role) {
      case 'agent': return t('nav.role_agent')
      case 'owner': return t('nav.role_owner')
      case 'admin': return t('nav.role_admin')
      case 'buyer': return t('nav.role_buyer')
      case 'property_manager': return t('management.nav.role_property_manager')
      default: return role
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-pl-bg text-pl-text">
      {/* Sidebar */}
      <aside className="w-64 bg-pl-surface border-r border-pl-line hidden md:block text-pl-text shrink-0">
        <div className="p-6 border-b border-pl-line">
          <div className="font-bold text-pl-text text-lg truncate">{user.name}</div>
          <div className="text-xs font-semibold text-pl-accent mt-0.5">{formatRoleLabel(user.role)}</div>
        </div>
        <nav className="px-4 py-4 space-y-1">
          {links.map((link) => {
            const active = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path + '/'))
            return (
              <Link 
                key={link.path} 
                to={link.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors border border-transparent",
                  active 
                    ? "bg-pl-bg text-pl-accent font-bold border-pl-line shadow-sm" 
                    : "text-pl-muted hover:text-pl-text hover:bg-pl-bg/50"
                )}
              >
                <link.icon className="w-4 h-4 shrink-0" />
                {link.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-pl-line sticky bottom-0 bg-pl-surface">
          <button 
            type="button"
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-left rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {t('nav.logout')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto min-w-0">
        <nav aria-label={t('management.nav.dashboard_menu')} className="md:hidden -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-2">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              aria-current={location.pathname === link.path ? 'page' : undefined}
              className={cn(
                'inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold',
                location.pathname === link.path ? 'border-pl-accent bg-pl-accent text-white' : 'border-pl-line bg-pl-surface text-pl-text',
              )}
            >
              <link.icon className="h-4 w-4" aria-hidden="true" />
              {link.label}
            </Link>
          ))}
        </nav>
        <Suspense fallback={<PageSkeleton />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}
