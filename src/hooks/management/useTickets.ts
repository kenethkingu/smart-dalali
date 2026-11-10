import { useMemo } from 'react'
import type { User } from '@/types'
import { can } from '@/lib/rbac'
import { useManagementState } from '@/services/management/store'
import type { MaintenanceTicket } from '@/types/management'

function byUpdatedDesc(a: MaintenanceTicket, b: MaintenanceTicket): number {
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
}

export function useAllTickets(): MaintenanceTicket[] {
  return useManagementState(state => state.tickets)
}

export function useTenantTickets(userId: string | undefined): MaintenanceTicket[] {
  const tickets = useAllTickets()
  return useMemo(() => tickets.filter(ticket => ticket.tenantId === userId).sort(byUpdatedDesc), [tickets, userId])
}

export function useManagedTickets(user: User | null): MaintenanceTicket[] {
  const tickets = useAllTickets()
  return useMemo(() => tickets.filter(ticket => can(user, 'ticket.respond', ticket)).sort(byUpdatedDesc), [tickets, user])
}

export function useLeaseTickets(leaseId: string | undefined): MaintenanceTicket[] {
  const tickets = useAllTickets()
  return useMemo(() => tickets.filter(ticket => ticket.leaseId === leaseId).sort(byUpdatedDesc), [tickets, leaseId])
}
