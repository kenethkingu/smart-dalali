import { createContext, useContext, useState, type ReactNode } from 'react'
import type { SiteVisitRequest } from '@/types'
import { siteVisitRequests as initialRequests } from '@/data/mockData'

interface RequestsContextValue {
  requests: SiteVisitRequest[]
  updateRequest: (id: string, updates: Partial<SiteVisitRequest>) => void
}

const RequestsContext = createContext<RequestsContextValue | null>(null)

export function RequestsProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<SiteVisitRequest[]>(initialRequests)

  const updateRequest = (id: string, updates: Partial<SiteVisitRequest>) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)))
  }

  return (
    <RequestsContext.Provider value={{ requests, updateRequest }}>
      {children}
    </RequestsContext.Provider>
  )
}

export function useRequests() {
  const ctx = useContext(RequestsContext)
  if (!ctx) throw new Error('useRequests must be used within RequestsProvider')
  return ctx
}
