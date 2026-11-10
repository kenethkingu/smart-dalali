import { daysAgo, hoursAgo } from './time'
import type { TransactionEvent, TransactionEventType } from '@/types/management'
import type { Role } from '@/lib/rbac'

interface SeedEvent {
  id: string
  propertyId: string
  type: TransactionEventType
  timestamp: string
  actorId: string
  actorRole: Role
  actor: string
  relatedId?: string
  extra?: Record<string, string | number>
}

function toEvent({ actor, extra, ...rest }: SeedEvent): TransactionEvent {
  return { ...rest, summaryKey: `management.events.${rest.type}`, summaryParams: { actor, ...extra } }
}

export function seedEvents(): TransactionEvent[] {
  const seeds: SeedEvent[] = [
    { id: 'evt-001', propertyId: 'p1', type: 'visit_requested', timestamp: hoursAgo(5), actorId: 'buyer1', actorRole: 'buyer', actor: 'Amina Hassan', relatedId: 'v1' },
    { id: 'evt-002', propertyId: 'p1', type: 'visit_confirmed', timestamp: hoursAgo(4), actorId: 'owner1', actorRole: 'owner', actor: 'John Mwakalinga', relatedId: 'v1' },
    { id: 'evt-006', propertyId: 'p2', type: 'visit_requested', timestamp: hoursAgo(70), actorId: 'buyer1', actorRole: 'buyer', actor: 'Amina Hassan', relatedId: 'v2' },
    { id: 'evt-007', propertyId: 'p2', type: 'visit_confirmed', timestamp: hoursAgo(69), actorId: 'owner2', actorRole: 'owner', actor: 'Grace Kileo', relatedId: 'v2' },
    { id: 'evt-008', propertyId: 'p3', type: 'visit_requested', timestamp: hoursAgo(100), actorId: 'buyer1', actorRole: 'buyer', actor: 'Amina Hassan', relatedId: 'v3' },
    { id: 'evt-009', propertyId: 'p3', type: 'visit_confirmed', timestamp: hoursAgo(99), actorId: 'owner2', actorRole: 'owner', actor: 'Grace Kileo', relatedId: 'v3' },
    { id: 'evt-101', propertyId: 'p5', type: 'inspection_completed', timestamp: daysAgo(75), actorId: 'pm1', actorRole: 'property_manager', actor: 'Zawadi Komba', relatedId: 'insp-seed-1' },
    { id: 'evt-102', propertyId: 'p5', type: 'visit_requested', timestamp: hoursAgo(200), actorId: 'tenant1', actorRole: 'buyer', actor: 'Baraka Mushi', relatedId: 'v4' },
    { id: 'evt-103', propertyId: 'p5', type: 'visit_confirmed', timestamp: hoursAgo(190), actorId: 'owner1', actorRole: 'owner', actor: 'John Mwakalinga', relatedId: 'v4' },
    { id: 'evt-104', propertyId: 'p5', type: 'payment_confirmed', timestamp: daysAgo(72), actorId: 'tenant1', actorRole: 'buyer', actor: 'Baraka Mushi', relatedId: 'v4' },
    { id: 'evt-105', propertyId: 'p5', type: 'lease_started', timestamp: daysAgo(72), actorId: 'tenant1', actorRole: 'tenant', actor: 'Baraka Mushi', relatedId: 'lease-seed-1' },
    { id: 'evt-106', propertyId: 'p5', type: 'contract_signed', timestamp: daysAgo(70), actorId: 'tenant1', actorRole: 'tenant', actor: 'Baraka Mushi', relatedId: 'lease-seed-1' },
    { id: 'evt-107', propertyId: 'p5', type: 'contract_signed', timestamp: daysAgo(70), actorId: 'owner1', actorRole: 'owner', actor: 'John Mwakalinga', relatedId: 'lease-seed-1' },
    { id: 'evt-108', propertyId: 'p5', type: 'rent_paid', timestamp: daysAgo(70), actorId: 'tenant1', actorRole: 'tenant', actor: 'Baraka Mushi', relatedId: 'lease-seed-1-rent-01' },
    { id: 'evt-109', propertyId: 'p5', type: 'rent_paid', timestamp: daysAgo(40), actorId: 'tenant1', actorRole: 'tenant', actor: 'Baraka Mushi', relatedId: 'lease-seed-1-rent-02' },
    { id: 'evt-110', propertyId: 'p5', type: 'maintenance_reported', timestamp: daysAgo(6), actorId: 'tenant1', actorRole: 'tenant', actor: 'Baraka Mushi', relatedId: 'tkt-seed-2', extra: { title: 'Bedroom socket not working' } },
    { id: 'evt-111', propertyId: 'p5', type: 'maintenance_resolved', timestamp: daysAgo(2), actorId: 'owner1', actorRole: 'owner', actor: 'John Mwakalinga', relatedId: 'tkt-seed-2', extra: { title: 'Bedroom socket not working' } },
    { id: 'evt-112', propertyId: 'p5', type: 'maintenance_reported', timestamp: hoursAgo(30), actorId: 'tenant1', actorRole: 'tenant', actor: 'Baraka Mushi', relatedId: 'tkt-seed-1', extra: { title: 'Kitchen sink is leaking' } },
    { id: 'evt-113', propertyId: 'p5', type: 'maintenance_updated', timestamp: hoursAgo(20), actorId: 'pm1', actorRole: 'property_manager', actor: 'Zawadi Komba', relatedId: 'tkt-seed-1', extra: { title: 'Kitchen sink is leaking' } },
    { id: 'evt-114', propertyId: 'p5', type: 'document_uploaded', timestamp: daysAgo(1), actorId: 'owner1', actorRole: 'owner', actor: 'John Mwakalinga', relatedId: 'doc-seed-1', extra: { document: 'masaki-title-deed.pdf' } },
  ]
  return seeds.map(toEvent)
}
