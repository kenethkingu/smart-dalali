import { SEED_LEASE_ID } from './leases'
import { daysAgo } from './time'
import type { PropertyDocument } from '@/types/management'

export function seedDocuments(): PropertyDocument[] {
  return [
    {
      id: 'doc-seed-1',
      propertyId: 'p5',
      ownerId: 'owner1',
      managerId: 'pm1',
      uploaderId: 'owner1',
      uploaderName: 'John Mwakalinga',
      uploaderRole: 'owner',
      type: 'title_deed',
      fileName: 'masaki-title-deed.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 1_480_000,
      uploadedAt: daysAgo(1),
      status: 'pending',
    },
    {
      id: 'doc-seed-2',
      propertyId: 'p5',
      leaseId: SEED_LEASE_ID,
      ownerId: 'owner1',
      managerId: 'pm1',
      tenantId: 'tenant1',
      uploaderId: 'tenant1',
      uploaderName: 'Baraka Mushi',
      uploaderRole: 'buyer',
      type: 'id_verification',
      fileName: 'baraka-nida.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 820_000,
      uploadedAt: daysAgo(3),
      status: 'pending',
    },
    {
      id: 'doc-seed-3',
      propertyId: 'p5',
      leaseId: SEED_LEASE_ID,
      ownerId: 'owner1',
      managerId: 'pm1',
      tenantId: 'tenant1',
      uploaderId: 'owner1',
      uploaderName: 'John Mwakalinga',
      uploaderRole: 'owner',
      type: 'tenancy_agreement',
      fileName: 'tenancy-agreement.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 310_000,
      uploadedAt: daysAgo(70),
      status: 'verified',
      verifiedBy: 'admin1',
      verifiedAt: daysAgo(69),
    },
  ]
}
