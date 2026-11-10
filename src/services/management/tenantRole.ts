import type { User } from '@/types'
import type { Lease } from '@/types/management'

export function withTenantRole(user: User, leases: readonly Lease[]): User {
  const isTenant = leases.some(lease => lease.tenantId === user.id)
  const hasRole = user.roles?.includes('tenant') ?? false
  if (!isTenant || hasRole || user.role === 'tenant') return user
  return { ...user, roles: [...(user.roles ?? []), 'tenant'] }
}
