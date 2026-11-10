import { useMemo } from 'react'
import { sortByDueDate } from '@/services/management/rentService'
import { useManagementState } from '@/services/management/store'
import type { RentPayment } from '@/types/management'

export function useAllPayments(): RentPayment[] {
  return useManagementState(state => state.payments)
}

export function useLeasePayments(leaseId: string | undefined): RentPayment[] {
  const payments = useAllPayments()
  return useMemo(() => sortByDueDate(payments.filter(payment => payment.leaseId === leaseId)), [payments, leaseId])
}
