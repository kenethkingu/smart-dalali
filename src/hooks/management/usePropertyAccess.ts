import { useMemo } from 'react'
import { useAuth } from '@/lib/auth'
import { can, type Resource } from '@/lib/rbac'
import type { Property } from '@/types'
import { useLeases } from './useLeases'

interface PropertyAccess {
  resource: Resource
  canViewHistory: boolean
  canRecordInspection: boolean
}

export function usePropertyAccess(property: Property | undefined): PropertyAccess {
  const { user } = useAuth()
  const leases = useLeases()
  return useMemo(() => {
    if (!property) return { resource: {}, canViewHistory: false, canRecordInspection: false }
    const tenantLease = leases.find(lease => lease.propertyId === property.id && lease.tenantId === user?.id)
    const resource: Resource = { ownerId: property.ownerId, managerId: property.managerId, tenantId: tenantLease?.tenantId }
    return {
      resource,
      canViewHistory: can(user, 'history.view', resource),
      canRecordInspection: can(user, 'inspection.record', resource),
    }
  }, [property, leases, user])
}
