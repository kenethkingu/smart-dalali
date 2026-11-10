import { daysAgo } from './time'
import type { Inspection } from '@/types/management'

export function seedInspections(): Inspection[] {
  return [
    {
      id: 'insp-seed-1',
      propertyId: 'p5',
      inspectorName: 'Zawadi Komba',
      date: daysAgo(75),
      items: [
        { label: 'Plumbing and water pressure', passed: true, note: '' },
        { label: 'Electrical sockets and lighting', passed: true, note: '' },
        { label: 'Doors, locks and windows', passed: false, note: 'Balcony door latch is loose.' },
      ],
      photos: [],
      recordedBy: 'pm1',
      createdAt: daysAgo(75),
    },
  ]
}
