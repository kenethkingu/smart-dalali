export type UserRole = 'admin' | 'owner' | 'buyer'

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
  title: string
  location: string
  price: number
  priceUnit: 'month' | 'total'
  purpose: ListingPurpose
  type: PropertyType
  bedrooms?: number
  areaSqm?: number
  amenities: string[]
  status: PropertyStatus
  sponsored?: boolean
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
  visitDate?: string
  declinedAt?: string
  paymentConfirmedAt?: string
}
