import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  readonly icon: LucideIcon
  readonly title: string
  readonly description?: string
  readonly action?: ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-pl-line bg-pl-surface p-10 text-center text-pl-text">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-pl-line bg-pl-bg">
        <Icon className="h-6 w-6 text-pl-muted" aria-hidden="true" />
      </div>
      <h2 className="mb-1 text-lg font-bold text-pl-text">{title}</h2>
      {description && <p className="mx-auto mb-5 max-w-sm text-sm text-pl-muted">{description}</p>}
      {action}
    </div>
  )
}
