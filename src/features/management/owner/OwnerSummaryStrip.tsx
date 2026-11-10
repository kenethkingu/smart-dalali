import { AlertCircle, CalendarClock, Hammer, Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/lib/auth'
import { formatTZS } from '@/lib/money'
import { useOwnerSummary } from '@/hooks/management/useOwnerSummary'

export function OwnerSummaryStrip() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const summary = useOwnerSummary(user?.id)
  const items = [
    { icon: Wallet, label: t('management.owner.collected'), value: formatTZS(summary.collectedThisMonth) },
    { icon: AlertCircle, label: t('management.owner.outstanding'), value: formatTZS(summary.outstanding) },
    { icon: Hammer, label: t('management.owner.open_tickets'), value: String(summary.openTickets) },
    { icon: CalendarClock, label: t('management.owner.ending_soon'), value: String(summary.endingSoon) },
  ]
  return (
    <section aria-label={t('management.owner.summary_title')} className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map(item => (
        <div key={item.label} className="rounded-2xl border border-pl-line bg-pl-surface p-5 text-pl-text">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-pl-muted">
            <item.icon className="h-3.5 w-3.5 text-pl-accent" aria-hidden="true" /> {item.label}
          </div>
          <div className="text-xl font-bold text-pl-text">{item.value}</div>
        </div>
      ))}
    </section>
  )
}
