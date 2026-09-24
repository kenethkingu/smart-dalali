import type { Property, SiteVisitRequest, TransactionEvent, Building, Lead } from '@/types'

export const buildings: Building[] = [
  {
    id: 'b1',
    name: 'Mikocheni Heights',
    location: 'Mikocheni B, Dar es Salaam',
    ownerId: 'owner2',
    totalUnits: 12,
  },
]

export const properties: Property[] = [
  {
    id: 'p1', ownerId: 'owner1', title: '3-Bedroom House — Sinza',
    location: 'Sinza Mori, Dar es Salaam', price: 900_000, priceUnit: 'month',
    purpose: 'rent', type: 'house', bedrooms: 3, areaSqm: 120, titleVerified: true, titleType: 'Residential',
    amenities: ['WiFi', 'Parking', '24/7 Security', 'Reliable Water', 'Fenced Compound', 'Servant Quarters'],
    status: 'approved', sponsored: true,
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2000&auto=format&fit=crop',
    ],
    description: 'Nice house near the main road, reliable power and water, close to schools and the market.',
    tone: 'a', agent: { name: 'John Mwakalinga', phone: '+255700000000', verified: true, rating: 4.8 },
    lat: -6.7789, lng: 39.2245,
  },
  {
    id: 'p2', ownerId: 'owner2', buildingId: 'b1', unitNumber: '3B', title: 'Apartment — Mikocheni',
    location: 'Mikocheni B, Dar es Salaam', price: 900_000, priceUnit: 'month',
    purpose: 'rent', type: 'house', bedrooms: 3, areaSqm: 120, titleVerified: true, titleType: 'Commercial',
    amenities: ['WiFi', 'Elevator', '24/7 Security', 'Generator Backup', 'Distance to Main Road'],
    status: 'approved', sponsored: true,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000&auto=format&fit=crop',
    ],
    description: 'Modern apartment, gated building with 24/7 security, elevator, basement parking.',
    tone: 'a', agent: { name: 'Grace Kileo', phone: '+255700000000', verified: true, rating: 4.6 },
    lat: -6.7735, lng: 39.2601,
  },
  {
    id: 'p3', ownerId: 'owner2', title: 'Plot — Kigamboni',
    location: 'Kigamboni, Dar es Salaam', price: 25_000_000, priceUnit: 'total',
    purpose: 'sale', type: 'plot', areaSqm: 400, titleType: 'CCRO',
    amenities: ['Borehole/Water Source'],
    status: 'approved', sponsored: true,
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?q=80&w=2000&auto=format&fit=crop',
    ],
    description: 'Titled plot, close to the tarmac road, 800m from the beach.',
    tone: 'b', agent: { name: 'Hamis Rajabu', phone: '+255700000000', verified: false, rating: 4.2 },
    lat: -6.8235, lng: 39.3012,
  },
  {
    id: 'p4', ownerId: 'owner1', title: 'New Listing — Goba (awaiting review)',
    location: 'Goba, Dar es Salaam', price: 400_000, priceUnit: 'month',
    purpose: 'rent', type: 'house', bedrooms: 2, areaSqm: 80, titleType: 'Residential',
    amenities: ['Reliable Water', 'Fenced Compound'],
    status: 'pending',
    imageUrl: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?q=80&w=2000&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2000&auto=format&fit=crop',
    ],
    description: 'Quiet house in Goba, safe area, close to primary schools.',
    tone: 'e', agent: { name: 'John Mwakalinga', phone: '+255700000000', verified: true, rating: 4.8 },
    lat: -6.7392, lng: 39.2185,
  },
]

const hoursAgo = (h: number) => new Date(Date.now() - h * 60 * 60 * 1000).toISOString()

export const siteVisitRequests: SiteVisitRequest[] = [
  { id: 'v1', propertyId: 'p1', buyerId: 'buyer1', requestedAt: hoursAgo(5), status: 'pending', ownerConfirmedAt: hoursAgo(4) },
  { id: 'v2', propertyId: 'p2', buyerId: 'buyer1', requestedAt: hoursAgo(70), status: 'pending', ownerConfirmedAt: hoursAgo(69) },
  { id: 'v3', propertyId: 'p3', buyerId: 'buyer1', requestedAt: hoursAgo(100), status: 'pending', ownerConfirmedAt: hoursAgo(99) },
  {
    id: 'v4', propertyId: 'p1', buyerId: 'buyer1', requestedAt: hoursAgo(200),
    status: 'payment_confirmed', paymentConfirmedAt: hoursAgo(150), ownerConfirmedAt: hoursAgo(190)
  },
]

export const demoUsers = {
  buyer: { id: 'buyer1', name: 'Amina Hassan', phone: '+255712000111', role: 'buyer' as const },
  owner: { id: 'owner1', name: 'John Mwakalinga', phone: '+255712000222', role: 'owner' as const },
  agent: { id: 'agent1', name: 'Juma Hassan (Dalali)', phone: '+255712000444', role: 'agent' as const },
  admin: { id: 'admin1', name: 'Proland Admin', phone: '+255712000333', role: 'admin' as const },
}

export const mockLeads: Lead[] = [
  { id: 'l1', agentId: 'agent1', name: 'Kassim Majaliwa', phone: '+255713111222', interestedPropertyId: 'p1', stage: 'new', createdAt: hoursAgo(12) },
  { id: 'l2', agentId: 'agent1', name: 'Neema Mollel', phone: '+255714333444', interestedPropertyId: 'p2', stage: 'contacted', createdAt: hoursAgo(36) },
  { id: 'l3', agentId: 'agent1', name: 'Rashid Ali', phone: '+255715555666', interestedPropertyId: 'p1', stage: 'viewing_scheduled', createdAt: hoursAgo(48) },
  { id: 'l4', agentId: 'agent1', name: 'Sarah Kimaro', phone: '+255716777888', interestedPropertyId: 'p3', stage: 'negotiating', createdAt: hoursAgo(96) },
  { id: 'l5', agentId: 'agent1', name: 'David Massawe', phone: '+255717999000', interestedPropertyId: 'p2', stage: 'closed', createdAt: hoursAgo(140) },
]

export const publicProperties = properties.filter(p => p.status === 'approved')

export const transactionEvents: TransactionEvent[] = [
  {
    id: 'evt-001', propertyId: 'p1', type: 'visit_requested',
    timestamp: hoursAgo(5), actorId: 'buyer1',
    summary: 'Amina Hassan requested a site visit.',
    requestId: 'v1',
  },
  {
    id: 'evt-002', propertyId: 'p1', type: 'visit_confirmed',
    timestamp: hoursAgo(4), actorId: 'owner1',
    summary: 'John Mwakalinga confirmed the site visit.',
    requestId: 'v1',
  },
  {
    id: 'evt-003', propertyId: 'p1', type: 'visit_requested',
    timestamp: hoursAgo(200), actorId: 'buyer1',
    summary: 'Amina Hassan requested a site visit.',
    requestId: 'v4',
  },
  {
    id: 'evt-004', propertyId: 'p1', type: 'visit_confirmed',
    timestamp: hoursAgo(190), actorId: 'owner1',
    summary: 'John Mwakalinga confirmed the site visit.',
    requestId: 'v4',
  },
  {
    id: 'evt-005', propertyId: 'p1', type: 'payment_confirmed',
    timestamp: hoursAgo(150), actorId: 'buyer1',
    summary: 'Amina Hassan confirmed payment for the site visit.',
    requestId: 'v4',
  },
  {
    id: 'evt-006', propertyId: 'p2', type: 'visit_requested',
    timestamp: hoursAgo(70), actorId: 'buyer1',
    summary: 'Amina Hassan requested a site visit.',
    requestId: 'v2',
  },
  {
    id: 'evt-007', propertyId: 'p2', type: 'visit_confirmed',
    timestamp: hoursAgo(69), actorId: 'owner2',
    summary: 'Grace Kileo confirmed the site visit.',
    requestId: 'v2',
  },
  {
    id: 'evt-008', propertyId: 'p3', type: 'visit_requested',
    timestamp: hoursAgo(100), actorId: 'buyer1',
    summary: 'Amina Hassan requested a site visit.',
    requestId: 'v3',
  },
  {
    id: 'evt-009', propertyId: 'p3', type: 'visit_confirmed',
    timestamp: hoursAgo(99), actorId: 'owner2',
    summary: 'Hamis Rajabu confirmed the site visit.',
    requestId: 'v3',
  },
]
