import { properties } from '@/data/mockData'
import type { PropertyDocument } from '@/types/management'

export function syncTitleBadges(documents: readonly PropertyDocument[]): void {
  const verifiedIds = new Set(documents.filter(doc => doc.type === 'title_deed' && doc.status === 'verified').map(doc => doc.propertyId))
  for (const property of properties) {
    if (verifiedIds.has(property.id)) property.titleVerified = true
  }
}
