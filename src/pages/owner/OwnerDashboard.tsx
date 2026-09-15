import { Link } from 'react-router-dom'
import { Plus, Building2, Bell } from 'lucide-react'
import { PrimaryButton } from '@/components/shared/Bits'

export function OwnerDashboard() {
  return (
    <div className="max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2 text-pl-ink">Owner Dashboard</h1>
          <p className="text-pl-muted">Manage your properties and respond to visit requests.</p>
        </div>
        <Link to="/owner/properties/new">
          <PrimaryButton>
            <Plus className="w-4 h-4 mr-1" /> Add Property
          </PrimaryButton>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-pl-line flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-pl-surface flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6 text-pl-ink" />
          </div>
          <div>
            <div className="text-sm font-medium text-pl-muted">Active Properties</div>
            <div className="text-2xl font-bold text-pl-ink">2</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-pl-line flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-pl-accent-dark/10 flex items-center justify-center shrink-0">
            <Bell className="w-6 h-6 text-pl-accent-dark" />
          </div>
          <div>
            <div className="text-sm font-medium text-pl-muted">New Visit Requests</div>
            <div className="text-2xl font-bold text-pl-ink">1</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-pl-line p-8 text-center">
        <h3 className="text-lg font-bold mb-2 text-pl-ink">Ready to list another property?</h3>
        <p className="text-pl-muted mb-4">Reach thousands of potential buyers and renters.</p>
        <Link to="/owner/properties/new">
          <PrimaryButton>Create Listing</PrimaryButton>
        </Link>
      </div>
    </div>
  )
}
