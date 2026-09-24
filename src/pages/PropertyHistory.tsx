import { useParams, Link } from 'react-router-dom'
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

// ── Event display config ───────────────────────────────────────────────────────

interface EventDisplay {
  icon: React.ElementType
  label: string
  color: string          // Tailwind text color class
  bgColor: string        // Tailwind bg color class for the dot
  borderColor: string    // Tailwind border color class
}

const EVENT_DISPLAY: Record<TransactionEventType, EventDisplay> = {
  visit_requested: {
    icon: Clock,
    label: 'Site Visit Requested',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-300',
  },
  visit_confirmed: {
    icon: CheckCircle2,
    label: 'Visit Confirmed by Owner',
    color: 'text-pl-accent-dark',
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-300',
  },
  visit_declined: {
    icon: XCircle,
    label: 'Visit Request Declined',
    color: 'text-pl-muted',
    bgColor: 'bg-zinc-100',
    borderColor: 'border-zinc-300',
  },
  payment_confirmed: {
    icon: CreditCard,
    label: 'Payment Confirmed',
    color: 'text-pl-accent-dark',
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-300',
  },
  document_uploaded: {
    icon: FileText,
    label: 'Document Uploaded',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
  },
  contract_signed: {
    icon: PenLine,
    label: 'Contract Signed',
    color: 'text-violet-700',
    bgColor: 'bg-violet-100',
    borderColor: 'border-violet-300',
  },
  inspection_completed: {
    icon: ClipboardCheck,
    label: 'Inspection Completed',
    color: 'text-sky-700',
    bgColor: 'bg-sky-100',
    borderColor: 'border-sky-300',
  },
  lease_started: {
    icon: Home,
    label: 'Lease Started',
    color: 'text-pl-ink',
    bgColor: 'bg-pl-ink',
    borderColor: 'border-pl-ink',
  },
  maintenance_reported: {
    icon: Wrench,
    label: 'Maintenance Issue Reported',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-300',
  },
  maintenance_resolved: {
    icon: CheckCheck,
    label: 'Maintenance Resolved',
    color: 'text-pl-accent-dark',
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-300',
  },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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


// ── Page ──────────────────────────────────────────────────────────────────────

export function PropertyHistory() {
  const { id } = useParams()
  const property = properties.find(p => p.id === id)
  const { getPropertyEvents } = useEvents()

  if (!property || property.status !== 'approved') {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-pl-ink mb-2">Property not found</h1>
        <p className="text-pl-muted mb-6">This property doesn't exist or isn't public yet.</p>
        <Link to="/properties" className="text-pl-accent hover:underline font-semibold">
          Browse Properties →
        </Link>
      </div>
    )
  }

  const events = getPropertyEvents(property.id)

  return (
    <div className="grain-texture bg-pl-surface min-h-screen pb-24">
      {/* Breadcrumb */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            to={`/properties/${property.id}`}
            className="inline-flex items-center text-sm font-medium text-pl-muted hover:text-pl-ink transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Property
          </Link>
          <span className="text-pl-line">/</span>
          <span className="text-sm font-medium text-pl-ink truncate">Property History</span>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 max-w-3xl">

        {/* Property header card */}
        <div className="bg-white rounded-2xl border border-pl-line shadow-sm p-6 mb-8 flex gap-4 items-center">
          <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-zinc-200">
            <PropertyImage
              property={property}
              className="w-full h-full object-cover"
              alt={`${property.title} — ${property.location}`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="font-heading font-bold text-pl-ink text-xl truncate">{property.title}</h1>
              <PropertyStatusBadge status={property.status} />
            </div>
            <p className="text-sm text-pl-muted">{property.location}</p>
            <p className="text-xs text-pl-muted mt-1">
              {events.length} recorded event{events.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Page heading */}
        <div className="mb-6">
          <h2 className="text-2xl font-heading font-bold text-pl-ink mb-1">Transaction History</h2>
          <p className="text-sm text-pl-muted">
            A chronological record of every verified action on this property.
            Financial details are not shown publicly.
          </p>
        </div>

        {/* Timeline */}
        {events.length === 0 ? (
          <div className="bg-white rounded-2xl border border-pl-line p-12 text-center">
            <Clock className="w-10 h-10 text-pl-muted mx-auto mb-4" />
            <h3 className="font-bold text-pl-ink mb-2">No recorded history yet</h3>
            <p className="text-sm text-pl-muted">
              Events will appear here as activity occurs on this property.
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical spine */}
            <div
              aria-hidden="true"
              className="absolute left-6 top-0 bottom-0 w-px bg-pl-line"
            />

            <div className="space-y-0">
              {events.map((evt, i) => {
                const display = EVENT_DISPLAY[evt.type]
                const Icon = display.icon
                const isLast = i === events.length - 1

                // Check if we need a date separator before this event
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
                      {/* Icon dot */}
                      <div
                        className={`
                          relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0
                          ${display.bgColor} ${display.borderColor}
                        `}
                        aria-hidden="true"
                      >
                        <Icon className={`w-5 h-5 ${display.color}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 bg-white rounded-2xl border border-pl-line shadow-sm p-4 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className={`text-sm font-bold ${display.color}`}>
                              {display.label}
                            </p>
                            <p className="text-sm text-pl-ink mt-0.5 leading-relaxed">
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

        {/* Footer trust note */}
        <div className="mt-10 pt-6 border-t border-pl-line">
          <p className="text-xs text-pl-muted text-center">
            This timeline is maintained by Proland and reflects verified activity on the property.
            Events cannot be edited or deleted once recorded.
          </p>
        </div>
      </div>
    </div>
  )
}
