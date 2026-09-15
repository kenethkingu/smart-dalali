import { Link } from 'react-router-dom'
import { ArrowRight, Clock, CheckCircle } from 'lucide-react'
import { useAuth } from '@/lib/auth'

export function BuyerDashboard() {
  const { user } = useAuth()
  
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-heading font-bold mb-2 text-pl-ink">Welcome back, {user?.name}</h1>
      <p className="text-pl-muted mb-8">Here is an overview of your recent property requests.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-pl-line">
          <div className="text-sm font-medium text-pl-muted mb-1">Total Requests</div>
          <div className="text-3xl font-bold text-pl-ink">3</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-pl-line">
          <div className="text-sm font-medium text-pl-muted mb-1 flex items-center gap-1"><Clock className="w-4 h-4"/> Pending</div>
          <div className="text-3xl font-bold text-amber-600">1</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-pl-line">
          <div className="text-sm font-medium text-pl-muted mb-1 flex items-center gap-1"><CheckCircle className="w-4 h-4"/> Confirmed</div>
          <div className="text-3xl font-bold text-pl-accent-dark">2</div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4 text-pl-ink">Recent Requests</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-pl-line overflow-hidden">
        <div className="p-6 border-b border-pl-line flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div>
            <h3 className="font-bold text-pl-ink">Modern House in Masaki</h3>
            <p className="text-sm text-pl-muted">Requested on Sep 14, 2026</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
              Pending Owner Approval
            </span>
            <Link to="/buyer/requests/1" className="text-pl-accent hover:text-pl-accent-dark font-medium text-sm flex items-center">
              View <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
