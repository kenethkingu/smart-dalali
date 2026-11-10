import { formatISO, subDays, subHours } from 'date-fns'

export const hoursAgo = (hours: number): string => formatISO(subHours(new Date(), hours))
export const daysAgo = (days: number): string => formatISO(subDays(new Date(), days))
