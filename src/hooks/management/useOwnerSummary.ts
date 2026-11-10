import { useMemo } from 'react'
import { selectOwnerSummary, type OwnerSummary } from '@/services/management/rentService'
import { useManagementState } from '@/services/management/store'

export function useOwnerSummary(ownerId: string | undefined): OwnerSummary {
  const leases = useManagementState(state => state.leases)
  const payments = useManagementState(state => state.payments)
  const tickets = useManagementState(state => state.tickets)
  return useMemo(() => selectOwnerSummary({ leases, payments, tickets, ownerId: ownerId ?? '' }), [leases, payments, tickets, ownerId])
}
