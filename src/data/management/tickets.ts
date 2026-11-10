import { SEED_LEASE_ID } from './leases'
import { daysAgo, hoursAgo } from './time'
import type { MaintenanceTicket } from '@/types/management'

const base = {
  leaseId: SEED_LEASE_ID,
  propertyId: 'p5',
  ownerId: 'owner1',
  managerId: 'pm1',
  tenantId: 'tenant1',
  tenantName: 'Baraka Mushi',
  photos: [],
}

export function seedTickets(): MaintenanceTicket[] {
  return [
    {
      ...base,
      id: 'tkt-seed-1',
      category: 'plumbing',
      title: 'Kitchen sink is leaking',
      description: 'Water drips under the sink whenever the tap is running. The cupboard floor is getting wet.',
      urgency: 'urgent',
      status: 'in-progress',
      notes: [
        {
          id: 'note-seed-1',
          authorId: 'pm1',
          authorName: 'Zawadi Komba',
          authorRole: 'property_manager',
          text: 'A plumber will visit tomorrow morning. Please keep the cupboard clear.',
          createdAt: hoursAgo(20),
        },
      ],
      createdAt: hoursAgo(30),
      updatedAt: hoursAgo(20),
    },
    {
      ...base,
      id: 'tkt-seed-2',
      category: 'electrical',
      title: 'Bedroom socket not working',
      description: 'The socket next to the bed has no power. Other sockets in the room work.',
      urgency: 'normal',
      status: 'resolved',
      notes: [
        {
          id: 'note-seed-2',
          authorId: 'owner1',
          authorName: 'John Mwakalinga',
          authorRole: 'owner',
          text: 'Electrician replaced the faulty socket. Please check it works.',
          createdAt: daysAgo(2),
        },
      ],
      createdAt: daysAgo(6),
      updatedAt: daysAgo(2),
    },
  ]
}
