import { useMemo, useState } from 'react'
import { paginate } from '@/lib/paginate'
import type { Page } from '@/types/management'

interface PageState {
  page: number
  key: string
}

export function usePagedList<T>(items: readonly T[], resetKey: string = ''): { page: Page<T>; setPage: (page: number) => void } {
  const [state, setState] = useState<PageState>({ page: 1, key: resetKey })
  const pageNumber = state.key === resetKey ? state.page : 1
  const page = useMemo(() => paginate(items, pageNumber), [items, pageNumber])
  return { page, setPage: (next: number) => setState({ page: next, key: resetKey }) }
}
