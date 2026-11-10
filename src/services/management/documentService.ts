import { can } from '@/lib/rbac'
import { newId } from '@/lib/ids'
import { registerFileUrl } from '@/lib/objectUrls'
import type { User } from '@/types'
import { recordEvent } from './eventLog'
import { fail, findProperty, leaseResource, ok } from './shared'
import { getState, updateState } from './store'
import { syncTitleBadges } from './titleBadge'
import type { DocumentType, ErrorCode, PropertyDocument, Result } from '@/types/management'

export const DOCUMENT_TYPES: readonly DocumentType[] = ['title_deed', 'tenancy_agreement', 'inspection_report', 'id_verification', 'other']
export const DOCUMENT_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png']
export const MAX_DOCUMENT_BYTES = 5 * 1024 * 1024
const MIN_REASON_LENGTH = 10
const MAX_REASON_LENGTH = 300

export function validateDocumentFile(file: Pick<File, 'type' | 'size'>): ErrorCode | null {
  if (!DOCUMENT_MIME_TYPES.includes(file.type)) return 'file_type'
  if (file.size <= 0 || file.size > MAX_DOCUMENT_BYTES) return 'file_size'
  return null
}

interface UploadInput {
  propertyId: string
  leaseId?: string
  type: DocumentType
  file: File
}

function uploadScope(input: Readonly<UploadInput>) {
  const property = findProperty(input.propertyId)
  if (!property) return null
  const lease = input.leaseId ? getState().leases.find(item => item.id === input.leaseId) : undefined
  if (input.leaseId && (!lease || lease.propertyId !== property.id)) return null
  const resource = lease
    ? leaseResource(lease)
    : { ownerId: property.ownerId, managerId: property.managerId }
  return { resource, lease }
}

export function uploadDocument(actor: User, input: Readonly<UploadInput>): Result<PropertyDocument> {
  const scope = uploadScope(input)
  if (!scope) return fail('not_found')
  if (!can(actor, 'document.upload', scope.resource)) return fail('forbidden')
  if (!DOCUMENT_TYPES.includes(input.type)) return fail('required')
  const invalid = validateDocumentFile(input.file)
  if (invalid) return fail(invalid)

  const doc: PropertyDocument = {
    id: newId('doc'),
    propertyId: input.propertyId,
    leaseId: input.leaseId,
    ownerId: scope.resource.ownerId ?? '',
    managerId: scope.resource.managerId,
    tenantId: scope.lease?.tenantId,
    uploaderId: actor.id,
    uploaderName: actor.name,
    uploaderRole: actor.role,
    type: input.type,
    fileName: input.file.name,
    mimeType: input.file.type,
    sizeBytes: input.file.size,
    uploadedAt: new Date().toISOString(),
    status: 'pending',
  }
  registerFileUrl(doc.id, input.file)
  updateState(state => ({ ...state, documents: [doc, ...state.documents] }))
  recordEvent({
    propertyId: doc.propertyId,
    type: 'document_uploaded',
    actor: { id: actor.id, name: actor.name, role: actor.role },
    relatedId: doc.id,
    params: { document: doc.fileName },
  })
  return ok(doc)
}

function findPending(actor: User, documentId: string): Result<PropertyDocument> {
  const doc = getState().documents.find(item => item.id === documentId)
  if (!doc) return fail('not_found')
  if (!can(actor, 'document.verify')) return fail('forbidden')
  if (doc.status !== 'pending') return fail('invalid_transition')
  return ok(doc)
}

function replaceDocument(documents: readonly PropertyDocument[], next: PropertyDocument): PropertyDocument[] {
  return documents.map(doc => (doc.id === next.id ? next : doc))
}

export function verifyDocument(actor: User, documentId: string): Result<PropertyDocument> {
  const found = findPending(actor, documentId)
  if (!found.ok) return found
  const next: PropertyDocument = {
    ...found.value,
    status: 'verified',
    rejectReason: undefined,
    verifiedBy: actor.id,
    verifiedAt: new Date().toISOString(),
  }
  updateState(state => ({ ...state, documents: replaceDocument(state.documents, next) }))
  syncTitleBadges([next])
  recordEvent({
    propertyId: next.propertyId,
    type: 'document_verified',
    actor: { id: actor.id, name: actor.name, role: actor.role },
    relatedId: next.id,
    params: { document: next.fileName },
  })
  return ok(next)
}

export function rejectDocument(actor: User, documentId: string, reason: string): Result<PropertyDocument> {
  const found = findPending(actor, documentId)
  if (!found.ok) return found
  const trimmed = reason.trim()
  if (trimmed.length < MIN_REASON_LENGTH) return fail('reason_short')
  if (trimmed.length > MAX_REASON_LENGTH) return fail('too_long')

  const next: PropertyDocument = { ...found.value, status: 'rejected', rejectReason: trimmed }
  updateState(state => ({ ...state, documents: replaceDocument(state.documents, next) }))
  return ok(next)
}

export function selectPendingDocuments(documents: readonly PropertyDocument[]): PropertyDocument[] {
  return documents
    .filter(doc => doc.status === 'pending')
    .sort((a, b) => new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime())
}
