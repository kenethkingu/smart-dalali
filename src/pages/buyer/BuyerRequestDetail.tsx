import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { properties } from '@/data/mockData'
import { canDecline, formatCountdown } from '@/lib/dates'
import { DangerButton, formatPrice } from '@/components/shared/Bits'
import { CountdownBadge } from '@/components/shared/CountdownBadge'
import { PropertyImage } from '@/components/shared/PropertyImage'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { ConfirmPaymentDialog } from '@/components/buyer/ConfirmPaymentDialog'
import { useRequests } from '@/lib/requests'
import { useEvents } from '@/lib/events'
import { useAuth } from '@/lib/auth'

export function BuyerRequestDetail() {
  const { id } = useParams()
  const { t } = useTranslation()
  const { requests, updateRequest } = useRequests()
  const { addEvent } = useEvents()
  const { user } = useAuth()
  const request = requests.find(r => r.id === id)
  const property = request ? properties.find(p => p.id === request.propertyId) : null

  const handleDecline = () => {
    if (!request) return
    updateRequest(id!, { status: 'declined', declinedAt: new Date().toISOString() })
    addEvent({
      propertyId: request.propertyId,
      type: 'visit_declined',
      actorId: user?.id ?? request.buyerId,
      summary: `${user?.name ?? 'Buyer'} declined the site visit request.`,
      requestId: request.id,
    })
  }

  const handlePay = () => {
    if (!request) return
    updateRequest(id!, { status: 'payment_confirmed', paymentConfirmedAt: new Date().toISOString() })
    addEvent({
      propertyId: request.propertyId,
      type: 'payment_confirmed',
      actorId: user?.id ?? request.buyerId,
      summary: `${user?.name ?? 'Buyer'} confirmed payment for the site visit.`,
      requestId: request.id,
    })
  }

  if (!request || !property) {
    return (
      <div className="max-w-2xl py-16 text-center text-pl-text">
        <AlertCircle className="w-10 h-10 text-pl-muted mx-auto mb-4" />
        <h2 className="text-xl font-bold text-pl-text mb-2">{t('properties.zero_results_title')}</h2>
        <Link to="/buyer/dashboard" className="text-pl-accent underline text-sm">{t('common.back')} {t('nav.dashboard')}</Link>
      </div>
    )
  }

  const canStillDecline = canDecline(request)

  const timeline = [
    {
      label: t('history.visit_requested'),
      date: request.requestedAt,
      done: true,
      icon: Clock,
    },
    {
      label: t('history.verified_date'),
      date: request.ownerConfirmedAt,
      done: !!request.ownerConfirmedAt,
      icon: CheckCircle,
    },
    {
      label: request.status === 'payment_confirmed' ? t('buyer_dashboard.stat_confirmed') : t('status.pending'),
      date: request.paymentConfirmedAt,
      done: request.status === 'payment_confirmed',
      icon: CheckCircle,
    },
    request.status === 'payment_confirmed' ? {
      label: t('history.visit_completed'),
      date: request.visitDate,
      done: false,
      icon: Clock,
    } : null,
    request.status === 'declined' ? {
      label: t('status.cancelled'),
      date: request.declinedAt,
      done: true,
      icon: XCircle,
    } : null,
  ].filter(Boolean) as { label: string; date?: string; done: boolean; icon: any }[]

  return (
    <div className="max-w-2xl text-pl-text">
      {/* Back */}
      <Link to="/buyer/dashboard" className="inline-flex items-center gap-1 text-sm font-medium text-pl-muted hover:text-pl-text mb-6">
        <ArrowLeft className="w-4 h-4 text-pl-accent" /> {t('common.back')} {t('nav.dashboard')}
      </Link>

      <h1 className="text-2xl font-heading font-bold text-pl-text mb-6">{t('buyer_dashboard.request_detail')}</h1>

      {/* Property summary card */}
      <div className="bg-pl-surface rounded-2xl border border-pl-line p-6 mb-6 flex gap-4 text-pl-text">
        <div className="w-20 h-20 rounded-xl bg-pl-bg border border-pl-line overflow-hidden shrink-0">
          <PropertyImage property={property} className="w-full h-full object-cover" alt={`Photo of ${property.title}`} />
        </div>
        <div>
          <h2 className="font-bold text-pl-text mb-1">
            <Link to={`/properties/${property.id}`} className="hover:text-pl-accent transition-colors">
              {property.title}
            </Link>
          </h2>
          <p className="text-sm text-pl-muted mb-1">{property.location}</p>
          <p className="text-sm font-semibold text-pl-text">
            TSh {formatPrice(property.price)}{property.priceUnit === 'month' ? '/mo' : ''}
          </p>
        </div>
      </div>

      {/* Status + countdown */}
      <div className="bg-pl-surface rounded-2xl border border-pl-line p-6 mb-6 text-pl-text">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-pl-text">{t('common.status')}</h3>
          <CountdownBadge request={request} />
        </div>

        {request.status === 'pending' && canStillDecline && (
          <p className="text-sm text-pl-muted mb-4">
            {formatCountdown(request) === 'Awaiting owner confirmation' 
              ? t('status.pending') 
              : `${t('buyer_dashboard.countdown_label')}: ${formatCountdown(request)}`}
          </p>
        )}
        {request.status === 'payment_confirmed' && (
          <p className="text-sm text-emerald-500 mb-4 font-medium">
            ✓ {t('buyer_dashboard.stat_confirmed')} ({new Date(request.paymentConfirmedAt!).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}).
          </p>
        )}
        {request.status === 'declined' && (
          <p className="text-sm text-pl-muted mb-4">
            {t('status.cancelled')} ({new Date(request.declinedAt!).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}).
          </p>
        )}

        {request.status === 'pending' && (
          <div className="flex flex-wrap gap-3">
            {canStillDecline && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DangerButton>
                    {t('buyer_dashboard.action_cancel')}
                  </DangerButton>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-pl-surface border border-pl-line text-pl-text">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-pl-text">{t('buyer_dashboard.action_cancel')}?</AlertDialogTitle>
                    <AlertDialogDescription className="text-pl-muted">
                      {t('steps.step3.desc')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-pl-bg text-pl-text border border-pl-line">{t('common.back')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDecline} className="bg-pl-danger text-white">
                      {t('buyer_dashboard.action_cancel')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <ConfirmPaymentDialog onConfirm={handlePay} />
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="bg-pl-surface rounded-2xl border border-pl-line p-6 text-pl-text">
        <h3 className="font-bold text-pl-text mb-5">{t('history.title')}</h3>
        <div className="space-y-5">
          {timeline.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${step.done ? 'bg-pl-accent text-white' : 'bg-pl-bg text-pl-muted border border-pl-line'}`}>
                <step.icon className="w-4 h-4" />
              </div>
              <div className="pt-1">
                <div className={`text-sm font-semibold ${step.done ? 'text-pl-text' : 'text-pl-muted'}`}>{step.label}</div>
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
