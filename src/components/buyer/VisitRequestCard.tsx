import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, XCircle, Clock, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { canDecline } from '@/lib/dates'
import { CountdownBadge } from '@/components/shared/CountdownBadge'
import { DangerButton, formatPrice } from '@/components/shared/Bits'
import { ConfirmPaymentDialog } from './ConfirmPaymentDialog'
import { properties } from '@/data/mockData'
import type { SiteVisitRequest } from '@/types'

interface VisitRequestCardProps {
  request: SiteVisitRequest
  onDecline?: (id: string) => void
  onPay?: (id: string) => void
}

export function VisitRequestCard({ request, onDecline, onPay }: VisitRequestCardProps) {
  const { t } = useTranslation()
  const property = properties.find(p => p.id === request.propertyId)
  const canStillDecline = canDecline(request)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="bg-pl-surface border border-pl-line rounded-2xl p-6 shadow-sm text-pl-text"
    >
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1">
          {property && (
            <div className="font-heading font-bold text-pl-text tracking-tight mb-1 text-lg">
              TSh {formatPrice(property.price)}
              {property.priceUnit === 'month' && <span className="text-sm font-normal text-pl-muted ml-1">/ mo</span>}
            </div>
          )}
          
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-heading font-semibold text-pl-text/90 text-base">
              {property?.title ?? 'Unknown Property'}
            </h3>
            {request.status === 'payment_confirmed' && (
              <CheckCircle className="w-4 h-4 text-pl-accent shrink-0" />
            )}
            {request.status === 'declined' && (
              <XCircle className="w-4 h-4 text-pl-muted shrink-0" />
            )}
          </div>
          
          <div className="flex items-center text-sm text-pl-muted mb-2">
            <MapPin className="w-3.5 h-3.5 mr-1 shrink-0 text-pl-accent" />
            {property?.location}
          </div>

          <p className="text-xs text-pl-muted mt-3 pt-3 border-t border-pl-line">
            {t('history.visit_requested')} {new Date(request.requestedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>

        <div className="flex flex-col gap-2 items-start sm:items-end shrink-0">
          {request.status === 'pending' && <CountdownBadge request={request} />}
          {request.status === 'payment_confirmed' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
              <CheckCircle className="w-3 h-3" /> {t('buyer_dashboard.stat_confirmed')}
            </span>
          )}
          {request.status === 'declined' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-pl-bg text-pl-muted border border-pl-line">
              {t('status.cancelled')}
            </span>
          )}

          <div className="flex gap-2 mt-1">
            {request.status === 'pending' && (
              <>
                {canStillDecline && (
                  <DangerButton
                    className="text-sm h-11 px-4"
                    onClick={() => onDecline?.(request.id)}
                  >
                    {t('buyer_dashboard.action_cancel')}
                  </DangerButton>
                )}
                {property && (
                  <ConfirmPaymentDialog
                    onConfirm={() => onPay?.(request.id)}
                    triggerClassName="text-sm h-11 px-4"
                  />
                )}
              </>
            )}
            <Link
              to={`/buyer/requests/${request.id}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-pl-accent hover:underline"
            >
              {t('common.view')} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {request.status === 'pending' && !canStillDecline && (
        <div className="mt-4 pt-4 border-t border-pl-line flex items-center gap-2 text-xs text-pl-muted">
          <Clock className="w-3.5 h-3.5" />
          {t('steps.step3.desc')}
        </div>
      )}
    </motion.div>
  )
}
