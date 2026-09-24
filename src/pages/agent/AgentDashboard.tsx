import { Link } from 'react-router-dom'
import { Users, Calendar, Building, ChevronRight, ArrowRight, MessageSquare } from 'lucide-react'
import { useLeads } from '@/lib/leads'
import { properties } from '@/data/mockData'
import { GhostButton } from '@/components/shared/Bits'
import type { LeadStage } from '@/types'

const stageLabels: Record<LeadStage, string> = {
  new: 'New Lead',
  contacted: 'Contacted',
  viewing_scheduled: 'Viewing Scheduled',
  negotiating: 'Negotiating',
  closed: 'Closed Deal',
}

const stageBadgeColors: Record<LeadStage, string> = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  contacted: 'bg-purple-50 text-purple-700 border-purple-200',
  viewing_scheduled: 'bg-amber-50 text-amber-700 border-amber-200',
  negotiating: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  closed: 'bg-zinc-100 text-pl-muted border-zinc-200',
}

export function AgentDashboard() {
  const { leads, advanceLeadStage } = useLeads()

  const activeLeads = leads.filter(l => l.stage !== 'closed')
  const viewingsScheduled = leads.filter(l => l.stage === 'viewing_scheduled')
  const managedListings = properties.length

  const getPropertyTitle = (propertyId?: string) => {
    if (!propertyId) return 'General Inquiry'
    const prop = properties.find(p => p.id === propertyId)
    return prop ? prop.title : 'Property Listing'
  }

  return (
    <div className="max-w-6xl space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-pl-ink mb-1">Agent Overview</h1>
        <p className="text-pl-muted">Manage your client leads, property viewings, and active listings.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-pl-line shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-pl-ink">{activeLeads.length}</div>
            <div className="text-xs font-semibold text-pl-muted">Active Leads</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-pl-line shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-pl-ink">{viewingsScheduled.length}</div>
            <div className="text-xs font-semibold text-pl-muted">Viewings Scheduled</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-pl-line shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-pl-ink">{managedListings}</div>
            <div className="text-xs font-semibold text-pl-muted">Listings Managed</div>
          </div>
        </div>
      </div>

      {/* Lead Pipeline Overview */}
      <div className="bg-white rounded-2xl border border-pl-line p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-pl-ink">Lead Pipeline</h2>
            <p className="text-xs text-pl-muted">Leads grouped by current status</p>
          </div>
          <Link to="/agent/leads" className="text-xs font-bold text-pl-accent hover:underline flex items-center gap-1">
            View All Pipeline <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {(['new', 'contacted', 'viewing_scheduled', 'negotiating', 'closed'] as LeadStage[]).map(stage => {
            const count = leads.filter(l => l.stage === stage).length
            return (
              <div key={stage} className="bg-pl-surface/60 rounded-xl p-4 border border-pl-line/70">
                <div className="text-xs font-bold text-pl-muted uppercase mb-1">{stageLabels[stage]}</div>
                <div className="text-2xl font-bold text-pl-ink">{count}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Active Leads List */}
      <div className="bg-white rounded-2xl border border-pl-line overflow-hidden shadow-sm">
        <div className="p-6 border-b border-pl-line flex items-center justify-between">
          <h2 className="text-lg font-bold text-pl-ink">Recent Active Leads</h2>
          <Link to="/agent/leads">
            <GhostButton className="text-xs py-1.5 h-8">View Lead Board</GhostButton>
          </Link>
        </div>

        <div className="divide-y divide-pl-line">
          {leads.slice(0, 4).map(lead => (
            <div key={lead.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-pl-surface/40 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-pl-ink">{lead.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${stageBadgeColors[lead.stage]}`}>
                    {stageLabels[lead.stage]}
                  </span>
                </div>
                <div className="text-xs text-pl-muted flex items-center gap-3">
                  <span>📱 {lead.phone}</span>
                  <span>•</span>
                  <span>🏠 {getPropertyTitle(lead.interestedPropertyId)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${lead.name}, this is your agent from Proland regarding your property inquiry.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                </a>

                {lead.stage !== 'closed' && (
                  <button
                    type="button"
                    onClick={() => advanceLeadStage(lead.id)}
                    className="px-3 py-1.5 bg-pl-ink text-white hover:bg-black rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                  >
                    Advance Stage <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
