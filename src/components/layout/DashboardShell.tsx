import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { LayoutDashboard, List, Users, Bell, LogOut, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

export function DashboardShell() {
  const { user, logout } = useAuth()
  const location = useLocation()
  
  if (!user) return null

  const getLinks = () => {
    switch(user.role) {
      case 'buyer': return [
        { label: 'Overview', path: '/buyer/dashboard', icon: LayoutDashboard },
        { label: 'My Requests', path: '/buyer/requests', icon: List }
      ]
      case 'owner': return [
        { label: 'Overview', path: '/owner/dashboard', icon: LayoutDashboard },
        { label: 'My Properties', path: '/owner/properties', icon: FileText },
        { label: 'Visit Requests', path: '/owner/requests', icon: Bell }
      ]
      case 'admin': return [
        { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Properties', path: '/admin/properties', icon: FileText },
        { label: 'Users', path: '/admin/users', icon: Users },
        { label: 'All Requests', path: '/admin/requests', icon: List }
      ]
    }
    return []
  }

  const links = getLinks()

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-pl-surface">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-pl-line hidden md:block">
        <div className="p-6">
          <div className="font-bold text-pl-ink text-lg truncate">{user.name}</div>
          <div className="text-sm text-pl-muted capitalize">{user.role} Account</div>
        </div>
        <nav className="px-4 py-2 space-y-1">
          {links.map((link) => {
            const active = location.pathname === link.path || location.pathname.startsWith(link.path + '/')
            return (
              <Link 
                key={link.path} 
                to={link.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                  active ? "bg-pl-surface text-pl-ink font-bold" : "text-pl-muted hover:text-pl-ink hover:bg-pl-surface/50"
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 mt-auto border-t border-pl-line absolute bottom-0 w-64">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-xl text-sm font-medium text-pl-danger hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
