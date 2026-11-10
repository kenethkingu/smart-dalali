import { addMonths, formatISO } from 'date-fns'
import type { Lease, RentPayment } from '@/types/management'

export const SCHEDULE_LENGTH = 12

interface ScheduleInput {
  leaseId: string
  startDate: string
  amount: number
  fromIndex?: number
  count?: number
}

export function buildPaymentRecords({ leaseId, startDate, amount, fromIndex = 0, count = SCHEDULE_LENGTH }: Readonly<ScheduleInput>): RentPayment[] {
  const start = new Date(startDate)
  return Array.from({ length: count }, (_, offset) => {
    const index = fromIndex + offset
    return {
      id: `${leaseId}-rent-${String(index + 1).padStart(2, '0')}`,
      leaseId,
      dueDate: formatISO(addMonths(start, index)),
      amount,
    }
  })
}

export function buildRentSchedule(lease: Pick<Lease, 'id' | 'startDate' | 'monthlyRent'>): RentPayment[] {
  return buildPaymentRecords({ leaseId: lease.id, startDate: lease.startDate, amount: lease.monthlyRent })
}
