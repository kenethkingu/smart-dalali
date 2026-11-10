import { seedContracts } from './contracts'
import { seedDocuments } from './documents'
import { seedEvents } from './events'
import { seedInspections } from './inspections'
import { seedLeases, seedPayments } from './leases'
import { seedTickets } from './tickets'
import type { ManagementState } from '@/types/management'

export const STATE_VERSION = 1

export function createSeedState(): ManagementState {
  return {
    version: STATE_VERSION,
    events: seedEvents(),
    leases: seedLeases(),
    payments: seedPayments(),
    tickets: seedTickets(),
    documents: seedDocuments(),
    contracts: seedContracts(),
    inspections: seedInspections(),
  }
}
