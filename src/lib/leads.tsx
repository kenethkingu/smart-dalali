import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Lead, LeadStage } from '@/types'
import { mockLeads } from '@/data/mockData'

const STAGE_ORDER: LeadStage[] = ['new', 'contacted', 'viewing_scheduled', 'negotiating', 'closed']

interface LeadsContextValue {
  leads: Lead[]
  updateLeadStage: (leadId: string, stage: LeadStage) => void
  advanceLeadStage: (leadId: string) => void
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void
}

const LeadsContext = createContext<LeadsContextValue | null>(null)

export function LeadsProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(mockLeads)

  const updateLeadStage = (leadId: string, stage: LeadStage) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage } : l))
  }

  const advanceLeadStage = (leadId: string) => {
    setLeads(prev => prev.map(l => {
      if (l.id !== leadId) return l
      const currentIdx = STAGE_ORDER.indexOf(l.stage)
      if (currentIdx === -1 || currentIdx >= STAGE_ORDER.length - 1) return l
      return { ...l, stage: STAGE_ORDER[currentIdx + 1] }
    }))
  }

  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `l-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setLeads(prev => [newLead, ...prev])
  }

  return (
    <LeadsContext.Provider value={{ leads, updateLeadStage, advanceLeadStage, addLead }}>
      {children}
    </LeadsContext.Provider>
  )
}

export function useLeads() {
  const ctx = useContext(LeadsContext)
  if (!ctx) throw new Error('useLeads must be used within LeadsProvider')
  return ctx
}
