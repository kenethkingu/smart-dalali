import type { Role } from '@/lib/rbac'

export type TransactionEventType =
  | 'visit_requested'
  | 'visit_confirmed'
  | 'visit_declined'
  | 'payment_confirmed'
  | 'document_uploaded'
  | 'document_verified'
  | 'contract_signed'
  | 'inspection_completed'
  | 'lease_started'
  | 'lease_ended'
  | 'renewal_offered'
  | 'renewal_accepted'
  | 'renewal_declined'
  | 'rent_paid'
  | 'maintenance_reported'
  | 'maintenance_updated'
  | 'maintenance_resolved'

export type EventParams = Readonly<Record<string, string | number>>

export interface TransactionEvent {
  id: string
  propertyId: string
  type: TransactionEventType
  timestamp: string
  actorId: string
  actorRole: Role
  summaryKey: string
  summaryParams: EventParams
  relatedId?: string
}

export type LeaseStatus = 'pending-signature' | 'active' | 'ended'
export type RenewalStatus = 'offered' | 'accepted' | 'declined'

export interface RenewalOffer {
  endDate: string
  monthlyRent: number
  offeredAt: string
  status: RenewalStatus
}

export interface Lease {
  id: string
  requestId: string
  propertyId: string
  buildingId?: string
  unitNumber?: string
  ownerId: string
  managerId?: string
  tenantId: string
  tenantName: string
  ownerName: string
  startDate: string
  endDate?: string
  monthlyRent: number
  status: LeaseStatus
  createdAt: string
  signedAt?: string
  renewalOffer?: RenewalOffer
}

export interface RentPayment {
  id: string
  leaseId: string
  dueDate: string
  amount: number
  paidDate?: string
  method?: string
  reference?: string
}

export type RentStatus = 'upcoming' | 'due' | 'overdue' | 'paid'

export type TicketCategory = 'plumbing' | 'electrical' | 'security' | 'appliances' | 'structure' | 'other'
export type TicketUrgency = 'normal' | 'urgent'
export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'cancelled'
export type TicketConfirmation = 'fixed' | 'not-fixed'

export interface StoredPhoto {
  id: string
  name: string
}

export interface TicketNote {
  id: string
  authorId: string
  authorName: string
  authorRole: Role
  text: string
  createdAt: string
}

export interface MaintenanceTicket {
  id: string
  leaseId: string
  propertyId: string
  ownerId: string
  managerId?: string
  tenantId: string
  tenantName: string
  category: TicketCategory
  title: string
  description: string
  urgency: TicketUrgency
  status: TicketStatus
  photos: StoredPhoto[]
  notes: TicketNote[]
  createdAt: string
  updatedAt: string
  confirmation?: TicketConfirmation
}

export type DocumentType = 'title_deed' | 'tenancy_agreement' | 'inspection_report' | 'id_verification' | 'other'
export type DocumentStatus = 'pending' | 'verified' | 'rejected'

export interface PropertyDocument {
  id: string
  propertyId: string
  leaseId?: string
  ownerId: string
  managerId?: string
  tenantId?: string
  uploaderId: string
  uploaderName: string
  uploaderRole: Role
  type: DocumentType
  fileName: string
  mimeType: string
  sizeBytes: number
  uploadedAt: string
  status: DocumentStatus
  rejectReason?: string
  verifiedBy?: string
  verifiedAt?: string
}

export interface Signature {
  signerId: string
  fullName: string
  signedAt: string
}

export interface Contract {
  id: string
  leaseId: string
  ownerSignature?: Signature
  tenantSignature?: Signature
}

export interface InspectionItem {
  label: string
  passed: boolean
  note: string
}

export interface Inspection {
  id: string
  propertyId: string
  inspectorName: string
  date: string
  items: InspectionItem[]
  photos: StoredPhoto[]
  recordedBy: string
  createdAt: string
}

export interface ManagementState {
  version: number
  events: TransactionEvent[]
  leases: Lease[]
  payments: RentPayment[]
  tickets: MaintenanceTicket[]
  documents: PropertyDocument[]
  contracts: Contract[]
  inspections: Inspection[]
}

export type ErrorCode =
  | 'forbidden'
  | 'not_found'
  | 'conflict'
  | 'invalid_transition'
  | 'invalid_amount'
  | 'invalid_date'
  | 'date_order'
  | 'required'
  | 'too_long'
  | 'too_many_files'
  | 'file_type'
  | 'file_size'
  | 'reason_short'
  | 'invalid_name'
  | 'consent_required'

export type Result<T> = { ok: true; value: T } | { ok: false; error: ErrorCode }

export interface Page<T> {
  items: T[]
  total: number
  page: number
  pageCount: number
}
