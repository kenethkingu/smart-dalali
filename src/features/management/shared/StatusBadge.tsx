import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type BadgeEmphasis = 'default' | 'positive' | 'muted'

interface StatusBadgeProps {
  readonly icon: LucideIcon
  readonly label: string
  readonly emphasis?: BadgeEmphasis
  readonly className?: string
}

const ICON_CLASSES: Record<BadgeEmphasis, string> = {
  default: 'text-pl-text',
  positive: 'text-pl-accent',
  muted: 'text-pl-muted',
}

export function StatusBadge({ icon: Icon, label, emphasis = 'default', className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-pl-line bg-pl-bg px-2.5 py-1 text-xs font-semibold text-pl-text',
        emphasis === 'muted' && 'text-pl-muted',
        className,
      )}
    >
      <Icon className={cn('h-3.5 w-3.5 shrink-0', ICON_CLASSES[emphasis])} aria-hidden="true" />
      {label}
    </span>
  )
}
