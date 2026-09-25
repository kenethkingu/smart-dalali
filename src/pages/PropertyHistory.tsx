import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  PenLine,
  ClipboardCheck,
  Home,
  Wrench,
  CheckCheck,
  CreditCard,
} from 'lucide-react'
import { properties } from '@/data/mockData'
import { useEvents } from '@/lib/events'
import { PropertyImage } from '@/components/shared/PropertyImage'
import { PropertyStatusBadge } from '@/components/shared/Bits'
import type { TransactionEventType } from '@/types'

interface EventDisplay {
  icon: React.ElementType
  labelKey: string
  color: string
  bgColor: string
  borderColor: string
}

const EVENT_DISPLAY: Record<TransactionEventType, EventDisplay> = {
  visit_requested: {
    icon: Clock,
    labelKey: 'history.visit_requested',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
  },
  visit_confirmed: {
    icon: CheckCircle2,
    labelKey: 'history.visit_completed',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
  },
  visit_declined: {
    icon: XCircle,
    labelKey: 'common.cancel',
    color: 'text-pl-muted',
    bgColor: 'bg-pl-surface',
    borderColor: 'border-pl-line',
  },
  payment_confirmed: {
    icon: CreditCard,
    labelKey: 'buyer_dashboard.stat_confirmed',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
  },
  document_uploaded: {
    icon: FileText,
    labelKey: 'history.title_checked',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
  },
  contract_signed: {
    icon: PenLine,
    labelKey: 'history.verified_date',
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30',
  },
  inspection_completed: {
    icon: ClipboardCheck,
    labelKey: 'history.visit_completed',
    color: 'text-sky-500',
    bgColor: 'bg-sky-500/10',
    borderColor: 'border-sky-500/30',
  },
  lease_started: {
    icon: Home,
    labelKey: 'history.listed_date',
    color: 'text-pl-text',
    bgColor: 'bg-pl-surface',
    borderColor: 'border-pl-line',
  },
  maintenance_reported: {
    icon: Wrench,
    labelKey: 'common.status',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
  },
  maintenance_resolved: {
    icon: CheckCheck,
    labelKey: 'status.completed',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
  },
}

function formatEventDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatEventTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

export function PropertyHistory() {
  const { id } = useParams()
  const { t } = useTranslation()
  const property = properties.find(p => p.id === id)
  const { getPropertyEvents } = useEvents()

  if (!property || property.status !== 'approved') {
    return (
      <div className="container mx-auto px-4 py-24 text-center text-pl-text">
        <h1 className="text-2xl font-bold text-pl-text mb-2">{t('properties.zero_results_title')}</h1>
        <p className="text-pl-muted mb-6">{t('properties.zero_results_desc')}</p>
        <Link to="/properties" className="text-pl-accent hover:underline font-semibold">
          {t('common.browse_properties')} →
        </Link>
      </div>
    )
  }

  const events = getPropertyEvents(property.id)

  return (
    <div className="grain-texture bg-pl-bg text-pl-text min-h-screen pb-24">
      {/* Breadcrumb */}
      <div className="bg-pl-surface border-b border-pl-line sticky top-16 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            to={`/properties/${property.id}`}
            className="inline-flex items-center text-sm font-medium text-pl-muted hover:text-pl-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1 text-pl-accent" /> {t('common.back')}
          </Link>
          <span className="text-pl-line">/</span>
          <span className="text-sm font-medium text-pl-text truncate">{t('history.title')}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 max-w-3xl">

        {/* Property header card */}
        <div className="bg-pl-surface rounded-2xl border border-pl-line shadow-sm p-6 mb-8 flex gap-4 items-center text-pl-text">
          <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-pl-bg border border-pl-line">
            <PropertyImage
              property={property}
              className="w-full h-full object-cover"
              alt={`${property.title} — ${property.location}`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="font-heading font-bold text-pl-text text-xl truncate">{property.title}</h1>
              <PropertyStatusBadge status={property.status} />
            </div>
            <p className="text-sm text-pl-muted">{property.location}</p>
            <p className="text-xs text-pl-muted mt-1">
              {events.length} {t('common.details')}
            </p>
          </div>
        </div>

        {/* Page heading */}
        <div className="mb-6">
          <h2 className="text-2xl font-heading font-bold text-pl-text mb-1">{t('history.title')}</h2>
          <p className="text-sm text-pl-muted">
            {t('history.title_checked')}
          </p>
        </div>

        {/* Timeline */}
        {events.length === 0 ? (
          <div className="bg-pl-surface rounded-2xl border border-pl-line p-12 text-center text-pl-text">
            <Clock className="w-10 h-10 text-pl-muted mx-auto mb-4" />
            <h3 className="font-bold text-pl-text mb-2">{t('properties.zero_results_title')}</h3>
            <p className="text-sm text-pl-muted">
              {t('properties.zero_results_desc')}
            </p>
          </div>
        ) : (
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute left-6 top-0 bottom-0 w-px bg-pl-line"
            />

            <div className="space-y-0">
              {events.map((evt, i) => {
                const display = EVENT_DISPLAY[evt.type]
                const Icon = display.icon
                const isLast = i === events.length - 1

                const prevEvt = events[i - 1]
                const showDateSep = !prevEvt || (
                  new Date(evt.timestamp).toDateString() !== new Date(prevEvt.timestamp).toDateString()
                )

                return (
                  <div key={evt.id}>
                    {showDateSep && (
                      <div className="relative pl-16 mb-4 mt-6 first:mt-0">
                        <span className="text-xs font-bold text-pl-muted uppercase tracking-wider">
                          {formatEventDate(evt.timestamp)}
                        </span>
                      </div>
                    )}

                    <div className={`relative flex gap-4 ${isLast ? '' : 'pb-6'}`}>
                      <div
                        className={`
                          relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0
                          ${display.bgColor} ${display.borderColor}
                        `}
                        aria-hidden="true"
                      >
                        <Icon className={`w-5 h-5 ${display.color}`} />
                      </div>

                      <div className="flex-1 bg-pl-surface rounded-2xl border border-pl-line shadow-sm p-4 min-w-0 text-pl-text">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className={`text-sm font-bold ${display.color}`}>
                              {t(display.labelKey, display.labelKey)}
                            </p>
                            <p className="text-sm text-pl-text mt-0.5 leading-relaxed">
                              {evt.summary}
                            </p>
                          </div>
                          <time
                            dateTime={evt.timestamp}
                            className="text-xs text-pl-muted whitespace-nowrap shrink-0 mt-0.5"
                          >
                            {formatEventTime(evt.timestamp)}
                          </time>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
