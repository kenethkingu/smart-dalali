import { useSyncExternalStore } from 'react'
import { createSeedState, STATE_VERSION } from '@/data/management/seed'
import { syncTitleBadges } from './titleBadge'
import type { ManagementState } from '@/types/management'

export const STORAGE_KEY = 'proland.management.v1'

const COLLECTIONS = ['events', 'leases', 'payments', 'tickets', 'documents', 'contracts', 'inspections'] as const

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function migrate(raw: unknown): ManagementState {
  const seed = createSeedState()
  if (!isRecord(raw)) return seed
  const merged: Record<string, unknown> = { ...seed }
  for (const key of COLLECTIONS) {
    const value = raw[key]
    if (Array.isArray(value)) merged[key] = value
  }
  merged.version = STATE_VERSION
  return merged as unknown as ManagementState
}

function readStorage(): ManagementState {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return createSeedState()
    return migrate(JSON.parse(stored))
  } catch {
    return createSeedState()
  }
}

function writeStorage(state: ManagementState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    return
  }
}

let current: ManagementState = readStorage()
writeStorage(current)
syncTitleBadges(current.documents)

const listeners = new Set<() => void>()

export function getState(): ManagementState {
  return current
}

export function updateState(updater: (state: ManagementState) => ManagementState): void {
  current = updater(current)
  writeStorage(current)
  listeners.forEach(listener => listener())
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useManagementState<T>(select: (state: ManagementState) => T): T {
  return useSyncExternalStore(subscribe, () => select(current))
}
