import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { useTenantLeases } from '@/hooks/management/useLeases'
import type { Lease } from '@/types/management'

export function useActiveLease(): { leases: Lease[]; lease: Lease | undefined; select: (leaseId: string) => void } {
  const { user } = useAuth()
  const leases = useTenantLeases(user?.id)
  const [selectedId, setSelectedId] = useState<string | undefined>()
  const lease = leases.find(item => item.id === selectedId) ?? leases[0]
  return { leases, lease, select: setSelectedId }
}
