import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { TransactionEvent, TransactionEventType } from '@/types'
import { transactionEvents as initialEvents } from '@/data/mockData'

// ── Types ─────────────────────────────────────────────────────────────────────

interface NewEventInput {
  propertyId: string
  type: TransactionEventType
  actorId: string
  summary: string
  requestId?: string
}

interface EventsContextValue {
  events: TransactionEvent[]
  /** Appends a new event to the log. ID and timestamp are generated here. */
  addEvent: (event: NewEventInput) => void
  /** Returns all events for a given property, sorted oldest → newest. */
  getPropertyEvents: (propertyId: string) => TransactionEvent[]
}

// ── Context ───────────────────────────────────────────────────────────────────

const EventsContext = createContext<EventsContextValue | null>(null)

// ── Provider ──────────────────────────────────────────────────────────────────

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<TransactionEvent[]>(initialEvents)

  const addEvent = useCallback((input: NewEventInput) => {
    const newEvent: TransactionEvent = {
      ...input,
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
    }
    setEvents(prev => [...prev, newEvent])
  }, [])

  const getPropertyEvents = useCallback(
    (propertyId: string) =>
      events
        .filter(e => e.propertyId === propertyId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
    [events]
  )

  return (
    <EventsContext.Provider value={{ events, addEvent, getPropertyEvents }}>
      {children}
    </EventsContext.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useEvents() {
  const ctx = useContext(EventsContext)
  if (!ctx) throw new Error('useEvents must be used within EventsProvider')
  return ctx
}
