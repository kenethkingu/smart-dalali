import { can } from '@/lib/rbac'
import { newId } from '@/lib/ids'
import type { User } from '@/types'
import { recordEvent } from './eventLog'
import { fail, findProperty, leaseResource, ok } from './shared'
import { getState, updateState } from './store'
import type { Contract, Lease, PropertyDocument, Result, Signature } from '@/types/management'

const MAX_NAME_LENGTH = 80
const MIN_NAME_PARTS = 2
export const CLAUSE_KEYS = ['rent', 'deposit', 'repairs', 'access', 'notice', 'conduct'] as const

export interface ContractView {
  lease: Lease
  propertyTitle: string
  propertyLocation: string
  unitLabel?: string
  clauseKeys: readonly (typeof CLAUSE_KEYS)[number][]
}

export function buildContract(lease: Lease): ContractView | null {
  const property = findProperty(lease.propertyId)
  if (!property) return null
  return {
    lease,
    propertyTitle: property.title,
    propertyLocation: property.location,
    unitLabel: lease.unitNumber,
    clauseKeys: CLAUSE_KEYS,
  }
}

export function selectContract(contracts: readonly Contract[], leaseId: string): Contract | undefined {
  return contracts.find(contract => contract.leaseId === leaseId)
}

interface SignInput {
  leaseId: string
  fullName: string
  consent: boolean
}

function agreementDocument(lease: Lease, signedAt: string): PropertyDocument {
  return {
    id: newId('doc'),
    propertyId: lease.propertyId,
    leaseId: lease.id,
    ownerId: lease.ownerId,
    managerId: lease.managerId,
    tenantId: lease.tenantId,
    uploaderId: 'proland',
    uploaderName: 'Proland',
    uploaderRole: 'admin',
    type: 'tenancy_agreement',
    fileName: `tenancy-agreement-${lease.id}`,
    mimeType: 'application/pdf',
    sizeBytes: 0,
    uploadedAt: signedAt,
    status: 'verified',
    verifiedBy: 'proland',
    verifiedAt: signedAt,
  }
}

function upsertContract(contracts: readonly Contract[], contract: Contract): Contract[] {
  if (!contracts.some(item => item.id === contract.id)) return [contract, ...contracts]
  return contracts.map(item => (item.id === contract.id ? contract : item))
}

function activateLease(leases: readonly Lease[], leaseId: string, signedAt: string): Lease[] {
  return leases.map(item => (item.id === leaseId ? { ...item, status: 'active', signedAt } : item))
}

function validateName(fullName: string): boolean {
  const trimmed = fullName.trim()
  return trimmed.length <= MAX_NAME_LENGTH && trimmed.split(/\s+/).length >= MIN_NAME_PARTS
}

export function signContract(actor: User, input: Readonly<SignInput>): Result<Contract> {
  const lease = getState().leases.find(item => item.id === input.leaseId)
  if (!lease) return fail('not_found')
  if (!can(actor, 'contract.sign', leaseResource(lease))) return fail('forbidden')
  if (lease.status !== 'pending-signature') return fail('invalid_transition')
  if (!input.consent) return fail('consent_required')
  if (!validateName(input.fullName)) return fail('invalid_name')

  const asOwner = actor.id === lease.ownerId
  const role = asOwner ? 'owner' : 'tenant'
  const existing = selectContract(getState().contracts, lease.id) ?? { id: newId('contract'), leaseId: lease.id }
  const already = asOwner ? existing.ownerSignature : existing.tenantSignature
  if (already) return fail('conflict')

  const signature: Signature = { signerId: actor.id, fullName: input.fullName.trim(), signedAt: new Date().toISOString() }
  const contract: Contract = asOwner ? { ...existing, ownerSignature: signature } : { ...existing, tenantSignature: signature }
  const complete = Boolean(contract.ownerSignature && contract.tenantSignature)

  updateState(state => ({
    ...state,
    contracts: upsertContract(state.contracts, contract),
    leases: complete ? activateLease(state.leases, lease.id, signature.signedAt) : state.leases,
    documents: complete ? [agreementDocument(lease, signature.signedAt), ...state.documents] : state.documents,
  }))
  recordEvent({
    propertyId: lease.propertyId,
    type: 'contract_signed',
    actor: { id: actor.id, name: actor.name, role },
    relatedId: lease.id,
  })
  return ok(contract)
}
