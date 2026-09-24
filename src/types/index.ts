import type { Role, Permission } from '@/lib/rbac'

export type { Role, Permission }
export type UserRole = Role

export interface Building {
  id: string
  name: string           // e.g. "Mikocheni Heights"
  location: string
  ownerId: string
  totalUnits: number
}

export type LeadStage = 'new' | 'contacted' | 'viewing_scheduled' | 'negotiating' | 'closed'

export interface Lead {
  id: string
  agentId: string
  name: string
  phone: string
  interestedPropertyId?: string
  stage: LeadStage
  createdAt: string
}

export type TransactionEventType =
  | 'visit_requested'
  | 'visit_confirmed'
  | 'visit_declined'
  | 'payment_confirmed'
  | 'document_uploaded'
  | 'contract_signed'
  | 'inspection_completed'
  | 'lease_started'
  | 'maintenance_reported'
  | 'maintenance_resolved'

export interface TransactionEvent {
  id: string
  propertyId: string
  type: TransactionEventType
  timestamp: string
  actorId: string
  /** Plain-language description shown on the timeline */
  summary: string
  /** Optional: links this event to a specific SiteVisitRequest */
  requestId?: string
}

export type PropertyStatus = 'pending' | 'approved' | 'rejected'
export type ListingPurpose = 'rent' | 'sale'
export type PropertyType = 'house' | 'plot' | 'office'
export type ThumbTone = 'a' | 'b' | 'c' | 'd' | 'e'

export interface User {
  id: string
  name: string
  phone: string
  role: UserRole
}

export interface Property {
  id: string
  ownerId: string
  buildingId?: string    // present only if this listing is a unit within a larger building
  unitNumber?: string    // e.g. "3B" — only meaningful when buildingId is set
  title: string
  location: string
  price: number
  priceUnit: 'month' | 'total'
  purpose: ListingPurpose
  type: PropertyType
  bedrooms?: number
  areaSqm?: number
  titleVerified?: boolean
  titleType?: string
  amenities: string[]
  status: PropertyStatus
  sponsored?: boolean
  imageUrl?: string
  galleryUrls?: string[]
  description: string
  tone: ThumbTone
  agent: { name: string; phone: string; verified: boolean; rating: number }
  lat: number
  lng: number
}

export type VisitStatus = 'pending' | 'declined' | 'payment_confirmed'

export interface SiteVisitRequest {
  id: string
  propertyId: string
  buyerId: string
  requestedAt: string
  status: VisitStatus
  ownerConfirmedAt?: string
  visitDate?: string
  declinedAt?: string
  paymentConfirmedAt?: string
}
