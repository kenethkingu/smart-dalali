import { differenceInHours, differenceInMinutes } from 'date-fns'
import type { SiteVisitRequest } from '@/types'

const DECLINE_WINDOW_HOURS = 72 // 3 days

export function canDecline(request: SiteVisitRequest): boolean {
  if (request.status !== 'pending') return false
  return differenceInHours(new Date(), new Date(request.requestedAt)) < DECLINE_WINDOW_HOURS
}

export function hoursLeftToDecline(request: SiteVisitRequest): number {
  const elapsed = differenceInHours(new Date(), new Date(request.requestedAt))
  return Math.max(0, DECLINE_WINDOW_HOURS - elapsed)
}

export function formatCountdown(request: SiteVisitRequest): string {
  const deadline = new Date(new Date(request.requestedAt).getTime() + DECLINE_WINDOW_HOURS * 60 * 60 * 1000)
  const minsLeft = differenceInMinutes(deadline, new Date())
  if (minsLeft <= 0) return 'Window closed'
  const hours = Math.floor(minsLeft / 60)
  const mins = minsLeft % 60
  if (hours >= 1) return `${hours}h ${mins}m left to decline`
  return `${mins}m left to decline`
}
