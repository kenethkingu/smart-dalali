import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react'
import { siteVisitRequests, properties } from '@/data/mockData'
import { canDecline, formatCountdown } from '@/lib/dates'
import { PrimaryButton, DangerButton, formatPrice } from '@/components/shared/Bits'
import { CountdownBadge } from '@/components/shared/CountdownBadge'

export function BuyerRequestDetail() {
  const { id } = useParams()
  const [requests, setRequests] = useState(siteVisitRequests)
  const request = requests.find(r => r.id === id)
  const property = request ? properties.find(p => p.id === request.propertyId) : null

  const handleDecline = () => {
    if (!request) return
    setRequests(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'declined' as const, declinedAt: new Date().toISOString() } : r)
    )
  }

  const handlePay = () => {
    if (!request) return
    setRequests(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'payment_confirmed' as const, paymentConfirmedAt: new Date().toISOString() } : r)
    )
  }

  if (!request || !property) {
    return (
      <div className="max-w-2xl py-16 text-center">
        <AlertCircle className="w-10 h-10 text-pl-muted mx-auto mb-4" />
        <h2 className="text-xl font-bold text-pl-ink mb-2">Request not found</h2>
        <Link to="/buyer/dashboard" className="text-pl-accent underline text-sm">Back to Dashboard</Link>
      </div>
    )
  }

  const canStillDecline = canDecline(request)

  const timeline = [
    {
      label: 'Request Submitted',
      date: request.requestedAt,
      done: true,
      icon: Clock,
    },
    {
      label: request.status === 'payment_confirmed' ? 'Payment Confirmed' : 'Awaiting Payment',
      date: request.paymentConfirmedAt,
      done: request.status === 'payment_confirmed',
      icon: CheckCircle,
    },
    request.status === 'declined' ? {
      label: 'Declined',
      date: request.declinedAt,
      done: true,
      icon: XCircle,
    } : null,
  ].filter(Boolean) as { label: string; date?: string; done: boolean; icon: any }[]

  return (
    <div className="max-w-2xl">
      {/* Back */}
      <Link to="/buyer/dashboard" className="inline-flex items-center gap-1 text-sm font-medium text-pl-muted hover:text-pl-ink mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <h1 className="text-2xl font-heading font-bold text-pl-ink mb-6">Request Detail</h1>

      {/* Property summary card */}
      <div className="bg-white rounded-2xl border border-pl-line p-6 mb-6 flex gap-4">
        <div className="w-20 h-20 rounded-xl bg-zinc-200 overflow-hidden shrink-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80"
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="font-bold text-pl-ink mb-1">
            <Link to={`/properties/${property.id}`} className="hover:text-pl-accent transition-colors">
              {property.title}
            </Link>
          </h2>
          <p className="text-sm text-pl-muted mb-1">{property.location}</p>
          <p className="text-sm font-semibold text-pl-ink">
            TSh {formatPrice(property.price)}{property.priceUnit === 'month' ? '/mo' : ''}
          </p>
        </div>
      </div>

      {/* Status + countdown */}
      <div className="bg-white rounded-2xl border border-pl-line p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-pl-ink">Request Status</h3>
          <CountdownBadge request={request} />
        </div>

        {request.status === 'pending' && canStillDecline && (
          <p className="text-sm text-pl-muted mb-4">
            You have {formatCountdown(request)} to decline this request at no cost.
            After that, cancellation is no longer available — Proland's policy, not a legal requirement.
          </p>
        )}
        {request.status === 'pending' && !canStillDecline && (
          <p className="text-sm text-pl-muted mb-4">
            The 3-day cancellation window has passed. You can still proceed with confirming payment.
          </p>
        )}
        {request.status === 'payment_confirmed' && (
          <p className="text-sm text-emerald-700 mb-4 font-medium">
            ✓ Payment confirmed on {new Date(request.paymentConfirmedAt!).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.
          </p>
        )}
        {request.status === 'declined' && (
          <p className="text-sm text-pl-muted mb-4">
            You declined this request on {new Date(request.declinedAt!).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.
          </p>
        )}

        {request.status === 'pending' && (
          <div className="flex flex-wrap gap-3">
            {canStillDecline && (
              <DangerButton onClick={handleDecline}>
                Decline Request
              </DangerButton>
            )}
            <PrimaryButton onClick={handlePay}>
              Confirm Payment
            </PrimaryButton>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl border border-pl-line p-6">
        <h3 className="font-bold text-pl-ink mb-5">Timeline</h3>
        <div className="space-y-5">
          {timeline.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${step.done ? 'bg-pl-ink text-white' : 'bg-pl-surface text-pl-muted border border-pl-line'}`}>
                <step.icon className="w-4 h-4" />
              </div>
              <div className="pt-1">
                <div className={`text-sm font-semibold ${step.done ? 'text-pl-ink' : 'text-pl-muted'}`}>{step.label}</div>
                {step.date && (
                  <div className="text-xs text-pl-muted mt-0.5">
                    {new Date(step.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
