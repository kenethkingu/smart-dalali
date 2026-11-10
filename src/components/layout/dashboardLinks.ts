import { ClipboardList, FileText, Home, LayoutDashboard, List, Bell, ShieldCheck, Users, Wallet, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { TFunction } from 'i18next'
import { can, canAccess } from '@/lib/rbac'
import type { User } from '@/types'

export interface DashboardLink {
  label: string
  path: string
  icon: LucideIcon
}

type Translate = TFunction

function roleLinks(user: User, t: Translate): DashboardLink[] {
  if (canAccess(user.role, 'manage_leads')) {
    return [
      { label: t('buyer_dashboard.tabs.overview'), path: '/agent/dashboard', icon: LayoutDashboard },
      { label: t('agent_dashboard.tabs.leads'), path: '/agent/leads', icon: Users },
      { label: t('agent_dashboard.tabs.listings'), path: '/agent/listings', icon: FileText },
    ]
  }
  switch (user.role) {
    case 'buyer':
      return [
        { label: t('buyer_dashboard.tabs.overview'), path: '/buyer/dashboard', icon: LayoutDashboard },
        { label: t('buyer_dashboard.tabs.requests'), path: '/buyer/requests', icon: List },
      ]
    case 'owner':
      return [
        { label: t('owner_dashboard.tabs.overview'), path: '/owner/dashboard', icon: LayoutDashboard },
        { label: t('owner_dashboard.tabs.properties'), path: '/owner/properties', icon: FileText },
        { label: t('owner_dashboard.tabs.requests'), path: '/owner/requests', icon: Bell },
      ]
    case 'admin':
      return [
        { label: t('admin_dashboard.tabs.overview'), path: '/admin/dashboard', icon: LayoutDashboard },
        { label: t('admin_dashboard.tabs.properties'), path: '/admin/properties', icon: FileText },
        { label: t('admin_dashboard.tabs.users'), path: '/admin/users', icon: Users },
        { label: t('admin_dashboard.tabs.requests'), path: '/admin/requests', icon: List },
      ]
    default:
      return []
  }
}

function managementLinks(user: User, t: Translate): DashboardLink[] {
  const links: DashboardLink[] = []
  if (can(user, 'rent.view')) {
    links.push(
      { label: t('management.nav.my_home'), path: '/tenant/dashboard', icon: Home },
      { label: t('management.nav.rent'), path: '/tenant/rent', icon: Wallet },
      { label: t('management.nav.maintenance'), path: '/tenant/maintenance', icon: Wrench },
      { label: t('management.nav.documents'), path: '/tenant/documents', icon: FileText },
    )
  }
  if (can(user, 'tenancy.list')) {
    links.push({ label: t('management.nav.tenancies'), path: '/owner/tenancies', icon: Users })
  }
  if (can(user, 'ticket.respond')) {
    links.push({ label: t('management.nav.maintenance'), path: '/owner/maintenance', icon: Wrench })
  }
  if (can(user, 'document.upload') && !can(user, 'rent.view')) {
    links.push({ label: t('management.nav.documents'), path: '/owner/documents', icon: FileText })
  }
  if (can(user, 'document.verify')) {
    links.push({ label: t('management.nav.verification'), path: '/admin/verification', icon: ShieldCheck })
  }
  return links
}

export function getDashboardLinks(user: User, t: Translate): DashboardLink[] {
  const links = [...roleLinks(user, t), ...managementLinks(user, t)]
  if (links.length === 0) return [{ label: t('nav.dashboard'), path: '/', icon: ClipboardList }]
  return links
}
