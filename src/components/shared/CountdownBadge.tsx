import { cn } from '@/lib/utils'
import { canDecline, formatCountdown, hoursLeftToDecline } from '@/lib/dates'
import type { SiteVisitRequest } from '@/types'

export function CountdownBadge({ request }: { request: SiteVisitRequest }) {
  if (request.status !== 'pending') return null

  const canStillDecline = canDecline(request)
  const countdown = formatCountdown(request)

  if (!canStillDecline) {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-pl-surface text-pl-muted border border-pl-line">
        Cancellation window closed
      </span>
    )
  }

  const hoursLeft = hoursLeftToDecline(request)
  const isAwaitingOwner = countdown === 'Awaiting owner confirmation'

  const color =
    isAwaitingOwner ? 'bg-pl-surface text-pl-muted border-pl-line'
    : hoursLeft < 8 ? 'bg-red-500/10 text-pl-danger dark:text-red-400 border-red-500/30'
    : hoursLeft < 24 ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30'
    : 'bg-emerald-500/10 text-pl-accent-dark dark:text-emerald-400 border-emerald-500/30'

  return (
    <span className={cn('inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border', color)}>
      ⏱ {countdown}
    </span>
  )
}
