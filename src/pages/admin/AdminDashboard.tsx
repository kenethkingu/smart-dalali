import { Shield, Building2, Users } from 'lucide-react'

export function AdminDashboard() {
  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2 text-pl-ink flex items-center gap-2">
          <Shield className="w-8 h-8 text-pl-ink" /> Admin Control Panel
        </h1>
        <p className="text-pl-muted">Platform overview and moderation tools.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-pl-line">
          <div className="text-sm font-medium text-pl-muted mb-4 flex items-center gap-2">
            <Users className="w-4 h-4" /> Total Users
          </div>
          <div className="text-3xl font-bold text-pl-ink mb-1">1,248</div>
          <div className="text-sm text-emerald-600 font-medium">+12 this week</div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-pl-line">
          <div className="text-sm font-medium text-pl-muted mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4" /> Pending Approvals
          </div>
          <div className="text-3xl font-bold text-amber-600 mb-1">5</div>
          <div className="text-sm text-pl-muted font-medium">Properties awaiting review</div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-pl-line">
          <div className="text-sm font-medium text-pl-muted mb-4">Total Revenue</div>
          <div className="text-3xl font-bold text-pl-ink mb-1">TSh 45M</div>
          <div className="text-sm text-emerald-600 font-medium">+8% vs last month</div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-pl-line p-6">
        <h3 className="text-lg font-bold mb-4 text-pl-ink">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex gap-4 items-start py-3 border-b border-pl-line last:border-0">
            <div className="w-2 h-2 mt-2 rounded-full bg-pl-accent shrink-0" />
            <div>
              <p className="text-pl-ink font-medium">New property listed by Owner User</p>
              <p className="text-sm text-pl-muted">Modern House in Masaki • 2 hours ago</p>
            </div>
          </div>
          <div className="flex gap-4 items-start py-3 border-b border-pl-line last:border-0">
            <div className="w-2 h-2 mt-2 rounded-full bg-amber-500 shrink-0" />
            <div>
              <p className="text-pl-ink font-medium">Site Visit requested by Buyer User</p>
              <p className="text-sm text-pl-muted">Prime Plot in Kigamboni • 5 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
