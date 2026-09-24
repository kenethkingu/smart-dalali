import { useState } from 'react'
import { Search } from 'lucide-react'
import type { UserRole } from '@/types'

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
  admin: 'bg-purple-50 text-purple-700 border-purple-200',
  owner: 'bg-blue-50 text-blue-700 border-blue-200',
  buyer: 'bg-zinc-100 text-pl-muted border-zinc-200',
  agent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  property_manager: 'bg-amber-50 text-amber-700 border-amber-200',
  tenant: 'bg-teal-50 text-teal-700 border-teal-200',
  inspector: 'bg-indigo-50 text-indigo-700 border-indigo-200',
}

export function AdminUsers() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')

  const filtered = mockUsers.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.phone.includes(search)
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-pl-ink mb-1">Users</h1>
        <p className="text-pl-muted">All {mockUsers.length} registered users on the platform.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pl-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or phone..."
            className="w-full border border-pl-line rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-pl-accent"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'buyer', 'owner', 'admin'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors capitalize
                ${roleFilter === r ? 'bg-pl-ink text-white border-pl-ink' : 'bg-white text-pl-muted border-pl-line hover:border-pl-ink/40'}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-pl-line overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-pl-line bg-pl-surface">
              <th className="text-left px-5 py-3 text-xs font-bold text-pl-muted uppercase tracking-wide">Name</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-pl-muted uppercase tracking-wide hidden sm:table-cell">Phone</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-pl-muted uppercase tracking-wide">Role</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-pl-muted uppercase tracking-wide hidden md:table-cell">Joined</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-pl-muted uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-pl-muted">No users match your search.</td>
              </tr>
            ) : filtered.map(u => (
              <tr key={u.id} className="border-b border-pl-line last:border-0 hover:bg-pl-surface/50 transition-colors">
                <td className="px-5 py-4 font-semibold text-pl-ink">{u.name}</td>
                <td className="px-5 py-4 text-pl-muted hidden sm:table-cell">{u.phone}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border capitalize ${roleColors[u.role]}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-4 text-pl-muted text-xs hidden md:table-cell">
                  {new Date(u.joined).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-5 py-4">
                  <span className={`text-xs font-bold ${u.status === 'active' ? 'text-pl-accent-dark' : 'text-pl-danger'}`}>
                    {u.status === 'active' ? '● Active' : '○ Suspended'}
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
