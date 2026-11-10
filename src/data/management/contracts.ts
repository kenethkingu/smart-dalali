import { SEED_LEASE_ID } from './leases'
import { daysAgo } from './time'
import type { Contract } from '@/types/management'

export function seedContracts(): Contract[] {
  return [
    {
      id: 'contract-seed-1',
      leaseId: SEED_LEASE_ID,
      ownerSignature: { signerId: 'owner1', fullName: 'John Mwakalinga', signedAt: daysAgo(70) },
      tenantSignature: { signerId: 'tenant1', fullName: 'Baraka Mushi', signedAt: daysAgo(70) },
    },
  ]
}
