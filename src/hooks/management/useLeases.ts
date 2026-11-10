import { useMemo } from 'react'
import type { User } from '@/types'
import { can } from '@/lib/rbac'
import { leaseResource } from '@/services/management/shared'
import { useManagementState } from '@/services/management/store'
import type { Lease } from '@/types/management'

function byCreatedDesc(a: Lease, b: Lease): number {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
}

export function useLeases(): Lease[] {
  return useManagementState(state => state.leases)
}

export function useTenantLeases(userId: string | undefined): Lease[] {
  const leases = useLeases()
  return useMemo(() => leases.filter(lease => lease.tenantId === userId).sort(byCreatedDesc), [leases, userId])
}

export function useManagedLeases(user: User | null): Lease[] {
  const leases = useLeases()
  return useMemo(
    () => leases.filter(lease => can(user, 'tenancy.list', leaseResource(lease))).sort(byCreatedDesc),
    [leases, user],
  )
}

export function useLease(leaseId: string | undefined): Lease | undefined {
  const leases = useLeases()
  return useMemo(() => leases.find(lease => lease.id === leaseId), [leases, leaseId])
}
