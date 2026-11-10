import type { ReactNode } from 'react'

interface PageHeaderProps {
  readonly title: string
  readonly description?: string
  readonly actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="mb-1 font-heading text-3xl font-bold text-pl-text">{title}</h1>
        {description && <p className="text-pl-muted">{description}</p>}
      </div>
      {actions}
    </div>
  )
}
