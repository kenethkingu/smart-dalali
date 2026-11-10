import { useMemo } from 'react'
import { selectContract } from '@/services/management/contractService'
import { useManagementState } from '@/services/management/store'
import type { Contract } from '@/types/management'

export function useContract(leaseId: string | undefined): Contract | undefined {
  const contracts = useManagementState(state => state.contracts)
  return useMemo(() => (leaseId ? selectContract(contracts, leaseId) : undefined), [contracts, leaseId])
}
