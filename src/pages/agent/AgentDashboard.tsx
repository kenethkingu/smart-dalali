import { Link } from 'react-router-dom'
import { Users, Calendar, Building, ArrowRight, MessageSquare, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLeads } from '@/lib/leads'
import { properties } from '@/data/mockData'
import { GhostButton } from '@/components/shared/Bits'
import type { LeadStage } from '@/types'

export function AgentDashboard() {
  const { t } = useTranslation()
  const { leads, advanceLeadStage } = useLeads()

  const stageLabels: Record<LeadStage, string> = {
    new: t('agent_dashboard.lead_stages.new'),
    contacted: t('agent_dashboard.lead_stages.contacted'),
    viewing_scheduled: t('agent_dashboard.lead_stages.visit_scheduled'),
    negotiating: t('agent_dashboard.lead_stages.negotiating'),
    closed: t('agent_dashboard.lead_stages.closed'),
  }

  const stageBadgeColors: Record<LeadStage, string> = {
    new: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
    contacted: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
    viewing_scheduled: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    negotiating: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
    closed: 'bg-pl-bg text-pl-muted border-pl-line',
  }

  const activeLeads = leads.filter(l => l.stage !== 'closed')
  const viewingsScheduled = leads.filter(l => l.stage === 'viewing_scheduled')
  const managedListings = properties.length

  const getPropertyTitle = (propertyId?: string) => {
    if (!propertyId) return t('common.details')
    const prop = properties.find(p => p.id === propertyId)
    return prop ? prop.title : t('nav.properties')
  }

  return (
    <div className="max-w-6xl space-y-8 text-pl-text">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-pl-text mb-1">{t('agent_dashboard.title')}</h1>
        <p className="text-pl-muted">{t('agent_dashboard.subtitle')}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-pl-surface p-6 rounded-2xl border border-pl-line shadow-sm flex items-center gap-4 text-pl-text">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-pl-text">{activeLeads.length}</div>
            <div className="text-xs font-semibold text-pl-muted">{t('agent_dashboard.stat_leads')}</div>
          </div>
        </div>

        <div className="bg-pl-surface p-6 rounded-2xl border border-pl-line shadow-sm flex items-center gap-4 text-pl-text">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-pl-text">{viewingsScheduled.length}</div>
            <div className="text-xs font-semibold text-pl-muted">{t('agent_dashboard.lead_stages.visit_scheduled')}</div>
          </div>
        </div>

        <div className="bg-pl-surface p-6 rounded-2xl border border-pl-line shadow-sm flex items-center gap-4 text-pl-text">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-pl-text">{managedListings}</div>
            <div className="text-xs font-semibold text-pl-muted">{t('agent_dashboard.stat_listings')}</div>
          </div>
        </div>
      </div>

      {/* Lead Pipeline Overview */}
      <div className="bg-pl-surface rounded-2xl border border-pl-line p-6 shadow-sm text-pl-text">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-pl-text">{t('agent_dashboard.tabs.leads')}</h2>
            <p className="text-xs text-pl-muted">{t('agent_dashboard.subtitle')}</p>
          </div>
          <Link to="/agent/leads" className="text-xs font-bold text-pl-accent hover:underline flex items-center gap-1">
            {t('home.view_all')} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {(['new', 'contacted', 'viewing_scheduled', 'negotiating', 'closed'] as LeadStage[]).map(stage => {
            const count = leads.filter(l => l.stage === stage).length
            return (
              <div key={stage} className="bg-pl-bg rounded-xl p-4 border border-pl-line">
                <div className="text-xs font-bold text-pl-muted uppercase mb-1">{stageLabels[stage]}</div>
                <div className="text-2xl font-bold text-pl-text">{count}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Active Leads List */}
      <div className="bg-pl-surface rounded-2xl border border-pl-line overflow-hidden shadow-sm text-pl-text">
        <div className="p-6 border-b border-pl-line flex items-center justify-between">
          <h2 className="text-lg font-bold text-pl-text">{t('agent_dashboard.stat_leads')}</h2>
          <Link to="/agent/leads">
            <GhostButton className="text-xs py-1.5 h-8 border border-pl-line text-pl-text">{t('home.view_all')}</GhostButton>
          </Link>
        </div>

        <div className="divide-y divide-pl-line">
          {leads.slice(0, 4).map(lead => (
            <div key={lead.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-pl-bg/50 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-pl-text">{lead.name}</span>
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
                  href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Habari ${lead.name}, mimi ni wakala wako wa Proland.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5 border border-emerald-500/30"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                </a>

                {lead.stage !== 'closed' && (
                  <button
                    type="button"
                    onClick={() => advanceLeadStage(lead.id)}
                    className="px-3 py-1.5 bg-pl-accent text-white hover:bg-pl-accent-dark rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
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
