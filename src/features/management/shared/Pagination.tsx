import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface PaginationProps {
  readonly page: number
  readonly pageCount: number
  readonly onChange: (page: number) => void
}

const BUTTON_CLASS =
  'inline-flex h-11 min-w-11 items-center justify-center gap-1 rounded-xl border border-pl-line bg-pl-bg px-3 text-sm font-semibold text-pl-text transition-colors hover:border-pl-accent disabled:pointer-events-none disabled:opacity-40'

export function Pagination({ page, pageCount, onChange }: PaginationProps) {
  const { t } = useTranslation()
  if (pageCount <= 1) return null
  return (
    <nav aria-label={t('management.pagination.label')} className="mt-6 flex items-center justify-between gap-3">
      <button type="button" className={BUTTON_CLASS} disabled={page <= 1} onClick={() => onChange(page - 1)}>
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        {t('management.pagination.previous')}
      </button>
      <span className="text-sm text-pl-muted" aria-live="polite">
        {t('management.pagination.status', { page, total: pageCount })}
      </span>
      <button type="button" className={BUTTON_CLASS} disabled={page >= pageCount} onClick={() => onChange(page + 1)}>
        {t('management.pagination.next')}
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  )
}
