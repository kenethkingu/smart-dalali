import { cn } from '@/lib/utils'
import { canDecline, formatCountdown, hoursLeftToDecline } from '@/lib/dates'
import type { SiteVisitRequest } from '@/types'

export function CountdownBadge({ request }: { request: SiteVisitRequest }) {
  if (request.status !== 'pending') return null

  const canStillDecline = canDecline(request)
  const countdown = formatCountdown(request)

  if (!canStillDecline) {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-pl-muted border border-pl-line">
        Cancellation window closed
      </span>
    )
  }

  const hoursLeft = hoursLeftToDecline(request)
  const isAwaitingOwner = countdown === 'Awaiting owner confirmation'

  const color =
    isAwaitingOwner ? 'bg-zinc-100 text-pl-muted border-zinc-200'
    : hoursLeft < 8 ? 'bg-red-50 text-pl-danger border-red-200'
    : hoursLeft < 24 ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-emerald-50 text-pl-accent-dark border-emerald-200'

  return (
    <span className={cn('inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border', color)}>
      ⏱ {countdown}
    </span>
  )
}
