import { useState } from 'react'
import { MessageSquare, ChevronRight, Phone, Home, Filter } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLeads } from '@/lib/leads'
import { properties } from '@/data/mockData'
import type { LeadStage } from '@/types'

export function AgentLeads() {
  const { t } = useTranslation()
  const { leads, updateLeadStage, advanceLeadStage } = useLeads()
  const [filter, setFilter] = useState<LeadStage | 'all'>('all')

  const STAGES: { key: LeadStage | 'all'; label: string }[] = [
    { key: 'all', label: t('common.all') },
    { key: 'new', label: t('agent_dashboard.lead_stages.new') },
    { key: 'contacted', label: t('agent_dashboard.lead_stages.contacted') },
    { key: 'viewing_scheduled', label: t('agent_dashboard.lead_stages.visit_scheduled') },
    { key: 'negotiating', label: t('agent_dashboard.lead_stages.negotiating') },
    { key: 'closed', label: t('agent_dashboard.lead_stages.closed') },
  ]

  const stageBadgeColors: Record<LeadStage, string> = {
    new: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
    contacted: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
    viewing_scheduled: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    negotiating: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
    closed: 'bg-pl-bg text-pl-muted border-pl-line',
  }

  const filteredLeads = leads.filter(lead => filter === 'all' || lead.stage === filter)

  const getPropertyTitle = (propertyId?: string) => {
    if (!propertyId) return t('common.details')
    const prop = properties.find(p => p.id === propertyId)
    return prop ? prop.title : t('nav.properties')
  }

  return (
    <div className="max-w-6xl space-y-8 text-pl-text">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-pl-text mb-1">{t('agent_dashboard.tabs.leads')}</h1>
        <p className="text-pl-muted">{t('agent_dashboard.subtitle')}</p>
      </div>

      {/* Stage Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-pl-line pb-4">
        {STAGES.map(({ key, label }) => {
          const count = key === 'all' ? leads.length : leads.filter(l => l.stage === key).length
          const active = filter === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors border flex items-center gap-2 ${
                active
                  ? 'bg-pl-accent text-white border-pl-accent shadow-sm'
                  : 'bg-pl-surface text-pl-muted border-pl-line hover:text-pl-text'
              }`}
            >
              <span>{label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${active ? 'bg-white/20 text-white' : 'bg-pl-bg text-pl-muted'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {filteredLeads.length === 0 ? (
          <div className="bg-pl-surface p-12 rounded-2xl border border-pl-line text-center text-pl-text">
            <Filter className="w-8 h-8 text-pl-muted mx-auto mb-3" />
            <h3 className="text-base font-bold text-pl-text mb-1">{t('properties.zero_results_title')}</h3>
            <p className="text-xs text-pl-muted">{t('properties.zero_results_desc')}</p>
          </div>
        ) : (
          filteredLeads.map(lead => {
            const propTitle = getPropertyTitle(lead.interestedPropertyId)
            return (
              <div
                key={lead.id}
                className="bg-pl-surface p-6 rounded-2xl border border-pl-line shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-pl-accent/50 transition-all text-pl-text"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-bold text-pl-text">{lead.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${stageBadgeColors[lead.stage]}`}>
                      {t(`agent_dashboard.lead_stages.${lead.stage === 'viewing_scheduled' ? 'visit_scheduled' : lead.stage}`, lead.stage.replace('_', ' '))}
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

                <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
                  <select
                    value={lead.stage}
                    onChange={(e) => updateLeadStage(lead.id, e.target.value as LeadStage)}
                    className="border border-pl-line rounded-xl px-3 py-2 text-xs font-bold bg-pl-bg text-pl-text outline-none focus:border-pl-accent"
                  >
                    <option value="new">{t('agent_dashboard.lead_stages.new')}</option>
                    <option value="contacted">{t('agent_dashboard.lead_stages.contacted')}</option>
                    <option value="viewing_scheduled">{t('agent_dashboard.lead_stages.visit_scheduled')}</option>
                    <option value="negotiating">{t('agent_dashboard.lead_stages.negotiating')}</option>
                    <option value="closed">{t('agent_dashboard.lead_stages.closed')}</option>
                  </select>

                  <a
                    href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Habari ${lead.name}, mimi ni wakala wako wa Proland.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4" /> WhatsApp
                  </a>

                  {lead.stage !== 'closed' && (
                    <button
                      type="button"
                      onClick={() => advanceLeadStage(lead.id)}
                      className="px-4 py-2 bg-pl-accent text-white hover:bg-pl-accent-dark rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1"
                    >
                      Next <ChevronRight className="w-4 h-4" />
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
