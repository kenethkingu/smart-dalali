import { useState } from 'react'
import { MessageSquare, ChevronRight, Phone, Home, Filter } from 'lucide-react'
import { useLeads } from '@/lib/leads'
import { properties } from '@/data/mockData'
import type { LeadStage } from '@/types'

const STAGES: { key: LeadStage | 'all'; label: string }[] = [
  { key: 'all', label: 'All Leads' },
  { key: 'new', label: 'New' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'viewing_scheduled', label: 'Viewing Scheduled' },
  { key: 'negotiating', label: 'Negotiating' },
  { key: 'closed', label: 'Closed' },
]

const stageBadgeColors: Record<LeadStage, string> = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  contacted: 'bg-purple-50 text-purple-700 border-purple-200',
  viewing_scheduled: 'bg-amber-50 text-amber-700 border-amber-200',
  negotiating: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  closed: 'bg-zinc-100 text-pl-muted border-zinc-200',
}

export function AgentLeads() {
  const { leads, updateLeadStage, advanceLeadStage } = useLeads()
  const [filter, setFilter] = useState<LeadStage | 'all'>('all')

  const filteredLeads = leads.filter(lead => filter === 'all' || lead.stage === filter)

  const getPropertyTitle = (propertyId?: string) => {
    if (!propertyId) return 'General Inquiry'
    const prop = properties.find(p => p.id === propertyId)
    return prop ? prop.title : 'Property Listing'
  }

  return (
    <div className="max-w-6xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-pl-ink mb-1">Lead Pipeline</h1>
        <p className="text-pl-muted">Track and manage client leads through every stage of the transaction.</p>
      </div>

      {/* Stage Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-pl-line pb-4">
        {STAGES.map(({ key, label }) => {
          const count = key === 'all' ? leads.length : leads.filter(l => l.stage === key).length
          const active = filter === key
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors border flex items-center gap-2 ${
                active
                  ? 'bg-pl-ink text-white border-pl-ink shadow-sm'
                  : 'bg-white text-pl-muted border-pl-line hover:border-pl-ink/40 hover:text-pl-ink'
              }`}
            >
              <span>{label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${active ? 'bg-white/20 text-white' : 'bg-pl-surface text-pl-muted'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {filteredLeads.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-pl-line text-center">
            <Filter className="w-8 h-8 text-pl-muted mx-auto mb-3" />
            <h3 className="text-base font-bold text-pl-ink mb-1">No leads match this stage filter</h3>
            <p className="text-xs text-pl-muted">Try selecting "All Leads" to view your full pipeline.</p>
          </div>
        ) : (
          filteredLeads.map(lead => {
            const propTitle = getPropertyTitle(lead.interestedPropertyId)
            return (
              <div
                key={lead.id}
                className="bg-white p-6 rounded-2xl border border-pl-line shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-pl-ink/30 transition-all"
              >
                {/* Left details */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-bold text-pl-ink">{lead.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${stageBadgeColors[lead.stage]}`}>
                      {lead.stage.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-medium text-pl-muted flex-wrap">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-pl-accent" /> {lead.phone}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Home className="w-3.5 h-3.5 text-pl-accent" /> {propTitle}
                    </span>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
                  {/* Select dropdown to update stage directly */}
                  <select
                    value={lead.stage}
                    onChange={(e) => updateLeadStage(lead.id, e.target.value as LeadStage)}
                    className="border border-pl-line rounded-xl px-3 py-2 text-xs font-bold bg-pl-surface text-pl-ink outline-none focus:border-pl-accent"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="viewing_scheduled">Viewing Scheduled</option>
                    <option value="negotiating">Negotiating</option>
                    <option value="closed">Closed</option>
                  </select>

                  {/* WhatsApp Quick Action */}
                  <a
                    href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Habari ${lead.name}, I am your Proland agent following up on ${propTitle}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4" /> WhatsApp
                  </a>

                  {/* Quick Advance Button */}
                  {lead.stage !== 'closed' && (
                    <button
                      type="button"
                      onClick={() => advanceLeadStage(lead.id)}
                      className="px-4 py-2 bg-pl-ink text-white hover:bg-black rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1"
                    >
                      Advance <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
