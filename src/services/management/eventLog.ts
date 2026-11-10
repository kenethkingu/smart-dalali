import { newId } from '@/lib/ids'
import type { Role } from '@/lib/rbac'
import { paginate } from '@/lib/paginate'
import { getState, updateState } from './store'
import type { EventParams, Page, TransactionEvent, TransactionEventType } from '@/types/management'

interface RecordEventInput {
  propertyId: string
  type: TransactionEventType
  actor: { id: string; name: string; role: Role }
  relatedId?: string
  params?: EventParams
  summaryKey?: string
}

export function recordEvent({ propertyId, type, actor, relatedId, params, summaryKey }: Readonly<RecordEventInput>): void {
  const event: TransactionEvent = {
    id: newId('evt'),
    propertyId,
    type,
    timestamp: new Date().toISOString(),
    actorId: actor.id,
    actorRole: actor.role,
    summaryKey: summaryKey ?? `management.events.${type}`,
    summaryParams: { actor: actor.name, ...params },
    relatedId,
  }
  updateState(state => ({ ...state, events: [event, ...state.events] }))
}

export function selectEventsForProperty(events: readonly TransactionEvent[], propertyId: string): TransactionEvent[] {
  return events
    .filter(event => event.propertyId === propertyId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export function getEventsForProperty(propertyId: string, page = 1): Page<TransactionEvent> {
  return paginate(selectEventsForProperty(getState().events, propertyId), page)
}
