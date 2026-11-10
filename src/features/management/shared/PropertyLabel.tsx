import { findProperty } from '@/services/management/shared'

export function propertyLabel(propertyId: string, unitNumber?: string): string {
  const title = findProperty(propertyId)?.title ?? propertyId
  return unitNumber ? `${title} (${unitNumber})` : title
}
