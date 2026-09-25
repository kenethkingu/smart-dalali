import { useState } from 'react'
import { Search } from 'lucide-react'
import type { UserRole } from '@/types'
import { useTranslation } from 'react-i18next'

// Mock users
const mockUsers = [
  { id: 'u1', name: 'Amina Juma', phone: '+255700000001', role: 'buyer' as UserRole, joined: '2026-07-12', status: 'active' },
  { id: 'u2', name: 'Hamisi Rajabu', phone: '+255700000002', role: 'owner' as UserRole, joined: '2026-06-03', status: 'active' },
  { id: 'u3', name: 'Grace Kileo', phone: '+255700000003', role: 'owner' as UserRole, joined: '2026-08-21', status: 'active' },
  { id: 'u4', name: 'John Mwakalinga', phone: '+255700000004', role: 'buyer' as UserRole, joined: '2026-09-01', status: 'active' },
  { id: 'u5', name: 'Fatuma Said', phone: '+255700000005', role: 'buyer' as UserRole, joined: '2026-09-10', status: 'suspended' },
  { id: 'u6', name: 'Admin User', phone: '+255700000000', role: 'admin' as UserRole, joined: '2026-01-01', status: 'active' },
]

const roleColors: Record<UserRole, string> = {
  admin: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
  owner: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
  buyer: 'bg-pl-surface text-pl-muted border-pl-line',
  agent: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
  property_manager: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
  tenant: 'bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/30',
  inspector: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/30',
}

export function AdminUsers() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')

  const filtered = mockUsers.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.phone.includes(search)
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  const roleLabel = (r: UserRole | 'all'): string => {
    switch (r) {
      case 'all': return t('common.all')
      case 'buyer': return t('nav.role_buyer')
      case 'owner': return t('nav.role_owner')
      case 'admin': return t('nav.role_admin')
      case 'agent': return t('nav.role_agent')
      default: return r
    }
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-pl-ink mb-1">{t('admin_dashboard.users_title')}</h1>
        <p className="text-pl-muted">{t('admin_dashboard.users_subtitle', { count: mockUsers.length })}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pl-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('admin_dashboard.users_search_ph')}
            className="w-full border border-pl-line rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-pl-accent bg-pl-bg text-pl-text placeholder:text-pl-muted"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'buyer', 'owner', 'admin'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors capitalize
                ${roleFilter === r ? 'bg-pl-ink text-pl-white border-pl-ink' : 'bg-pl-bg text-pl-muted border-pl-line hover:border-pl-ink/40 dark:hover:border-pl-white/30'}`}
            >
              {roleLabel(r)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-pl-surface rounded-2xl border border-pl-line overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-pl-line bg-pl-surface">
              <th className="text-left px-5 py-3 text-xs font-bold text-pl-muted uppercase tracking-wide">{t('admin_dashboard.user_table.name')}</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-pl-muted uppercase tracking-wide hidden sm:table-cell">{t('admin_dashboard.users_col_phone')}</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-pl-muted uppercase tracking-wide">{t('admin_dashboard.user_table.role')}</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-pl-muted uppercase tracking-wide hidden md:table-cell">{t('admin_dashboard.users_col_joined')}</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-pl-muted uppercase tracking-wide">{t('admin_dashboard.user_table.status')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-pl-muted">{t('admin_dashboard.users_no_match')}</td>
              </tr>
            ) : filtered.map(u => (
              <tr key={u.id} className="border-b border-pl-line last:border-0 hover:bg-pl-surface/50 transition-colors">
                <td className="px-5 py-4 font-semibold text-pl-ink">{u.name}</td>
                <td className="px-5 py-4 text-pl-muted hidden sm:table-cell">{u.phone}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border capitalize ${roleColors[u.role]}`}>
                    {roleLabel(u.role)}
                  </span>
                </td>
                <td className="px-5 py-4 text-pl-muted text-xs hidden md:table-cell">
                  {new Date(u.joined).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-5 py-4">
                  <span className={`text-xs font-bold ${u.status === 'active' ? 'text-pl-accent-dark' : 'text-pl-danger'}`}>
                    {u.status === 'active' ? `● ${t('admin_dashboard.users_status_active')}` : `○ ${t('admin_dashboard.users_status_suspended')}`}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
