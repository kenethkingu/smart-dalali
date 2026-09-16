import { differenceInHours, differenceInMinutes } from 'date-fns'
import type { SiteVisitRequest } from '@/types'

const DECLINE_WINDOW_HOURS = 72 // 3 days

export function canDecline(request: SiteVisitRequest): boolean {
  if (request.status !== 'pending') return false
  if (!request.ownerConfirmedAt) return true // can always decline before confirmation
  return differenceInHours(new Date(), new Date(request.ownerConfirmedAt)) < DECLINE_WINDOW_HOURS
}

export function hoursLeftToDecline(request: SiteVisitRequest): number {
  if (!request.ownerConfirmedAt) return DECLINE_WINDOW_HOURS
  const elapsed = differenceInHours(new Date(), new Date(request.ownerConfirmedAt))
  return Math.max(0, DECLINE_WINDOW_HOURS - elapsed)
}

export function formatCountdown(request: SiteVisitRequest): string {
  if (!request.ownerConfirmedAt) return 'Awaiting owner confirmation'
  const deadline = new Date(new Date(request.ownerConfirmedAt).getTime() + DECLINE_WINDOW_HOURS * 60 * 60 * 1000)
  const minsLeft = differenceInMinutes(deadline, new Date())
  if (minsLeft <= 0) return 'Window closed'
  
  const totalHours = Math.floor(minsLeft / 60)
  const days = Math.floor(totalHours / 24)
  const hours = totalHours % 24
  const mins = minsLeft % 60
  
  if (days > 0) return `${days}d ${hours}h left to decline`
  if (hours >= 1) return `${hours}h ${mins}m left to decline`
  return `${mins}m left to decline`
}
