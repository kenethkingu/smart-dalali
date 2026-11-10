import { differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns'
import i18n from '@/lib/i18n'

function tag(): string {
  return i18n.language?.startsWith('sw') ? 'sw-TZ' : 'en-GB'
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(tag(), { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso))
}

export function formatMonth(iso: string): string {
  return new Intl.DateTimeFormat(tag(), { month: 'long', year: 'numeric' }).format(new Date(iso))
}

export function formatRelative(iso: string): string {
  const target = new Date(iso)
  const now = new Date()
  const rtf = new Intl.RelativeTimeFormat(tag(), { numeric: 'auto' })
  const minutes = differenceInMinutes(target, now)
  if (Math.abs(minutes) < 60) return rtf.format(minutes, 'minute')
  const hours = differenceInHours(target, now)
  if (Math.abs(hours) < 24) return rtf.format(hours, 'hour')
  return rtf.format(differenceInDays(target, now), 'day')
}
