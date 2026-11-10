import { useMemo } from 'react'
import { useManagementState } from '@/services/management/store'
import type { Inspection } from '@/types/management'

export function useInspections(propertyId: string | undefined): Inspection[] {
  const inspections = useManagementState(state => state.inspections)
  return useMemo(
    () => inspections.filter(item => item.propertyId === propertyId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [inspections, propertyId],
  )
}
