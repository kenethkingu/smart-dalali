import { can } from '@/lib/rbac'
import { newId } from '@/lib/ids'
import type { User } from '@/types'
import { recordEvent } from './eventLog'
import { fail, findProperty, isValidIso, ok, validateText } from './shared'
import { storePhotos, validatePhotos } from './maintenanceService'
import { updateState } from './store'
import type { Inspection, InspectionItem, Result } from '@/types/management'

export const INSPECTION_CHECKLIST = [
  'management.inspection.items.plumbing',
  'management.inspection.items.electrical',
  'management.inspection.items.doors',
  'management.inspection.items.structure',
  'management.inspection.items.safety',
] as const
export const MAX_INSPECTION_PHOTOS = 5
const MAX_NAME_LENGTH = 80
const MAX_NOTE_LENGTH = 200

interface InspectionInput {
  propertyId: string
  inspectorName: string
  date: string
  items: readonly InspectionItem[]
  photos: readonly File[]
}

export function recordInspection(actor: User, input: Readonly<InspectionInput>): Result<Inspection> {
  const property = findProperty(input.propertyId)
  if (!property) return fail('not_found')
  if (!can(actor, 'inspection.record', { managerId: property.managerId })) return fail('forbidden')
  const nameError = validateText(input.inspectorName, MAX_NAME_LENGTH)
  if (nameError) return fail(nameError)
  if (!isValidIso(input.date)) return fail('invalid_date')
  if (input.items.length === 0 || input.items.some(item => item.note.length > MAX_NOTE_LENGTH)) return fail('too_long')
  const photoError = validatePhotos(input.photos, MAX_INSPECTION_PHOTOS)
  if (photoError) return fail(photoError)

  const inspection: Inspection = {
    id: newId('insp'),
    propertyId: property.id,
    inspectorName: input.inspectorName.trim(),
    date: input.date,
    items: input.items.map(item => ({ ...item, note: item.note.trim() })),
    photos: storePhotos(input.photos),
    recordedBy: actor.id,
    createdAt: new Date().toISOString(),
  }
  updateState(state => ({ ...state, inspections: [inspection, ...state.inspections] }))
  recordEvent({
    propertyId: property.id,
    type: 'inspection_completed',
    actor: { id: actor.id, name: actor.name, role: actor.role },
    relatedId: inspection.id,
  })
  return ok(inspection)
}
