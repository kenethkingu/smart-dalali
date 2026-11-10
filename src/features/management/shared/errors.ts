import type { TFunction } from 'i18next'
import type { Result } from '@/types/management'

export function errorText(t: TFunction, result: Result<unknown>): string {
  return result.ok ? '' : t(`management.errors.${result.error}`)
}
