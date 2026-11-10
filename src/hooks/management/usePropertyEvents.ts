import { useMemo } from 'react'
import { selectEventsForProperty } from '@/services/management/eventLog'
import { useManagementState } from '@/services/management/store'
import type { TransactionEvent } from '@/types/management'

export function usePropertyEvents(propertyId: string | undefined): TransactionEvent[] {
  const events = useManagementState(state => state.events)
  return useMemo(() => (propertyId ? selectEventsForProperty(events, propertyId) : []), [events, propertyId])
}
