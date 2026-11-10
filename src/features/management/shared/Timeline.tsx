import {
  CheckCheck,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  CreditCard,
  FileText,
  Home,
  Key,
  PenLine,
  RefreshCw,
  ShieldCheck,
  Wallet,
  Wrench,
  XCircle,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { formatMonth, formatRelative } from '@/lib/dateFormat'
import type { TransactionEvent, TransactionEventType } from '@/types/management'

const EVENT_ICONS: Record<TransactionEventType, LucideIcon> = {
  visit_requested: Clock,
  visit_confirmed: CheckCircle2,
  visit_declined: XCircle,
  payment_confirmed: CreditCard,
  document_uploaded: FileText,
  document_verified: ShieldCheck,
  contract_signed: PenLine,
  inspection_completed: ClipboardCheck,
  lease_started: Home,
  lease_ended: Key,
  renewal_offered: RefreshCw,
  renewal_accepted: RefreshCw,
  renewal_declined: RefreshCw,
  rent_paid: Wallet,
  maintenance_reported: Wrench,
  maintenance_updated: Wrench,
  maintenance_resolved: CheckCheck,
}

interface TimelineProps {
  readonly events: readonly TransactionEvent[]
}

function groupByMonth(events: readonly TransactionEvent[]): { month: string; items: TransactionEvent[] }[] {
  const groups: { month: string; items: TransactionEvent[] }[] = []
  for (const event of events) {
    const month = formatMonth(event.timestamp)
    const last = groups[groups.length - 1]
    if (last?.month === month) last.items.push(event)
    else groups.push({ month, items: [event] })
  }
  return groups
}

export function Timeline({ events }: TimelineProps) {
  const { t } = useTranslation()
  return (
    <div className="space-y-8">
      {groupByMonth(events).map(group => (
        <section key={group.month} aria-label={group.month}>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-pl-muted">{group.month}</h3>
          <ol className="relative space-y-4 border-l border-pl-line pl-6">
            {group.items.map(event => {
              const Icon = EVENT_ICONS[event.type]
              return (
                <li key={event.id} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[2.2rem] flex h-8 w-8 items-center justify-center rounded-full border border-pl-line bg-pl-surface"
                  >
                    <Icon className="h-4 w-4 text-pl-accent" />
                  </span>
                  <div className="rounded-2xl border border-pl-line bg-pl-surface p-4">
                    <p className="text-sm leading-relaxed text-pl-text">{t(event.summaryKey, { ...event.summaryParams })}</p>
                    <p className="mt-1 text-xs text-pl-muted">
                      <time dateTime={event.timestamp}>{formatRelative(event.timestamp)}</time>
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        </section>
      ))}
    </div>
  )
}
