import { differenceInCalendarDays } from 'date-fns'
import type { RentPayment, RentStatus } from '@/types/management'

const DUE_SOON_DAYS = 7

export function getRentStatus(payment: Pick<RentPayment, 'dueDate' | 'paidDate'>, today: Date = new Date()): RentStatus {
  if (payment.paidDate) return 'paid'
  const daysUntilDue = differenceInCalendarDays(new Date(payment.dueDate), today)
  if (daysUntilDue < 0) return 'overdue'
  if (daysUntilDue <= DUE_SOON_DAYS) return 'due'
  return 'upcoming'
}

export function daysOverdue(payment: Pick<RentPayment, 'dueDate'>, today: Date = new Date()): number {
  return Math.max(0, differenceInCalendarDays(today, new Date(payment.dueDate)))
}
