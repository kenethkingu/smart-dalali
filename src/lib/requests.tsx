import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { SiteVisitRequest } from '@/types'
import { siteVisitRequests as initialRequests, userDirectory } from '@/data/mockData'
import { useAuth } from '@/lib/auth'
import { newId } from '@/lib/ids'
import { createLeaseFromRequest } from '@/services/management/leaseService'

const REQUESTS_KEY = 'proland.requests.v1'

interface RequestsContextValue {
  requests: SiteVisitRequest[]
  updateRequest: (id: string, updates: Partial<SiteVisitRequest>) => void
  createRequest: (propertyId: string, buyerId: string) => SiteVisitRequest
}

const RequestsContext = createContext<RequestsContextValue | null>(null)

function loadRequests(): SiteVisitRequest[] {
  try {
    const stored = window.localStorage.getItem(REQUESTS_KEY)
    if (stored) return JSON.parse(stored) as SiteVisitRequest[]
  } catch {
    return initialRequests
  }
  return initialRequests
}

function saveRequests(requests: SiteVisitRequest[]): void {
  try {
    window.localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests))
  } catch {
    return
  }
}

export function RequestsProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<SiteVisitRequest[]>(loadRequests)
  const { user } = useAuth()

  const commit = useCallback((next: SiteVisitRequest[]) => {
    saveRequests(next)
    setRequests(next)
  }, [])

  const updateRequest = useCallback(
    (id: string, updates: Partial<SiteVisitRequest>) => {
      const current = requests.find(request => request.id === id)
      if (!current) return
      const updated = { ...current, ...updates }
      commit(requests.map(request => (request.id === id ? updated : request)))
      if (updated.status === 'payment_confirmed' && current.status !== 'payment_confirmed') {
        const tenantName = user?.id === updated.buyerId ? user.name : (userDirectory[updated.buyerId] ?? updated.buyerId)
        createLeaseFromRequest(updated, tenantName)
      }
    },
    [commit, requests, user],
  )

  const createRequest = useCallback(
    (propertyId: string, buyerId: string) => {
      const existing = requests.find(r => r.propertyId === propertyId && r.buyerId === buyerId && r.status === 'pending')
      if (existing) return existing
      const created: SiteVisitRequest = {
        id: newId('v'),
        propertyId,
        buyerId,
        requestedAt: new Date().toISOString(),
        status: 'pending',
      }
      commit([created, ...requests])
      return created
    },
    [commit, requests],
  )

  const value = useMemo(() => ({ requests, updateRequest, createRequest }), [requests, updateRequest, createRequest])

  return <RequestsContext.Provider value={value}>{children}</RequestsContext.Provider>
}

export function useRequests() {
  const ctx = useContext(RequestsContext)
  if (!ctx) throw new Error('useRequests must be used within RequestsProvider')
  return ctx
}
