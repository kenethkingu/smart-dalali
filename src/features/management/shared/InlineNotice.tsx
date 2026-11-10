import { CheckCircle2, Info } from 'lucide-react'
import type { ReactNode } from 'react'

interface InlineNoticeProps {
  readonly children: ReactNode
  readonly variant?: 'success' | 'info'
}

export function InlineNotice({ children, variant = 'info' }: InlineNoticeProps) {
  const Icon = variant === 'success' ? CheckCircle2 : Info
  return (
    <div role="status" className="flex items-start gap-2 rounded-xl border border-pl-line bg-pl-bg p-3 text-sm text-pl-text">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-pl-accent" aria-hidden="true" />
      <div>{children}</div>
    </div>
  )
}
