import type { Page } from '@/types/management'

export const PAGE_SIZE = 10

export function paginate<T>(items: readonly T[], page: number, pageSize: number = PAGE_SIZE): Page<T> {
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const safePage = Math.min(Math.max(1, page), pageCount)
  const start = (safePage - 1) * pageSize
  return { items: items.slice(start, start + pageSize), total: items.length, page: safePage, pageCount }
}
