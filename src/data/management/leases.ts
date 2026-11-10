import { daysAgo } from './time'
import { buildRentSchedule } from '@/services/management/rentSchedule'
import type { Lease, RentPayment } from '@/types/management'

export const SEED_LEASE_ID = 'lease-seed-1'

export function seedLeases(): Lease[] {
  return [
    {
      id: SEED_LEASE_ID,
      requestId: 'v4',
      propertyId: 'p5',
      ownerId: 'owner1',
      managerId: 'pm1',
      tenantId: 'tenant1',
      tenantName: 'Baraka Mushi',
      ownerName: 'John Mwakalinga',
      startDate: daysAgo(70),
      monthlyRent: 1_200_000,
      status: 'active',
      createdAt: daysAgo(72),
      signedAt: daysAgo(70),
    },
  ]
}

export function seedPayments(): RentPayment[] {
  const schedule = buildRentSchedule(seedLeases()[0])
  return schedule.map((payment, index) =>
    index < 2
      ? { ...payment, paidDate: payment.dueDate, method: 'M-Pesa', reference: `PL-RENT-${String(4800 + index)}` }
      : payment,
  )
}
