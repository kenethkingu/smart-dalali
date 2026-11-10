import { properties } from '@/data/mockData'
import type { Resource, Role } from '@/lib/rbac'
import type { ErrorCode, Lease, Result } from '@/types/management'

export const MAX_TEXT_LENGTH = 1000
export const MAX_TITLE_LENGTH = 120

export function ok<T>(value: T): Result<T> {
  return { ok: true, value }
}

export function fail<T = never>(error: ErrorCode): Result<T> {
  return { ok: false, error }
}

export function findProperty(propertyId: string) {
  return properties.find(property => property.id === propertyId)
}

export function leaseResource(lease: Pick<Lease, 'ownerId' | 'managerId' | 'tenantId'>): Resource {
  return { ownerId: lease.ownerId, managerId: lease.managerId, tenantId: lease.tenantId }
}

export function validateText(value: string, maxLength: number): ErrorCode | null {
  const trimmed = value.trim()
  if (!trimmed) return 'required'
  if (trimmed.length > maxLength) return 'too_long'
  return null
}

export function isValidIso(value: string): boolean {
  return !Number.isNaN(new Date(value).getTime())
}

export function actorOf(user: { id: string; name: string; role: Role }, role: Role = user.role) {
  return { id: user.id, name: user.name, role }
}
