import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, XCircle, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { canDecline } from '@/lib/dates'
import { CountdownBadge } from '@/components/shared/CountdownBadge'
import { PrimaryButton, DangerButton, formatPrice } from '@/components/shared/Bits'
import { properties } from '@/data/mockData'
import type { SiteVisitRequest } from '@/types'

interface VisitRequestCardProps {
  request: SiteVisitRequest
  onDecline?: (id: string) => void
  onPay?: (id: string) => void
}

export function VisitRequestCard({ request, onDecline, onPay }: VisitRequestCardProps) {
  const property = properties.find(p => p.id === request.propertyId)
  const canStillDecline = canDecline(request)

  const statusColors: Record<SiteVisitRequest['status'], string> = {
    pending: 'border-l-amber-400',
    declined: 'border-l-zinc-300 opacity-70',
    payment_confirmed: 'border-l-pl-accent',
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`bg-white border border-pl-line border-l-4 ${statusColors[request.status]} rounded-2xl p-6 shadow-sm`}
    >
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-pl-ink">
              {property?.title ?? 'Unknown Property'}
            </h3>
            {request.status === 'payment_confirmed' && (
              <CheckCircle className="w-4 h-4 text-pl-accent shrink-0" />
            )}
            {request.status === 'declined' && (
              <XCircle className="w-4 h-4 text-pl-muted shrink-0" />
            )}
          </div>
          <p className="text-sm text-pl-muted mb-2">{property?.location}</p>
          {property && (
            <p className="text-sm font-semibold text-pl-ink">
              TSh {formatPrice(property.price)}
              {property.priceUnit === 'month' ? '/mo' : ''}
            </p>
          )}
          <p className="text-xs text-pl-muted mt-2">
            Requested {new Date(request.requestedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>

        <div className="flex flex-col gap-2 items-start sm:items-end shrink-0">
          {request.status === 'pending' && <CountdownBadge request={request} />}
          {request.status === 'payment_confirmed' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-pl-accent-dark border border-emerald-200">
              <CheckCircle className="w-3 h-3" /> Payment Confirmed
            </span>
          )}
          {request.status === 'declined' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-pl-muted border border-zinc-200">
              Declined
            </span>
          )}

          <div className="flex gap-2 mt-1">
            {request.status === 'pending' && (
              <>
                {canStillDecline && (
                  <DangerButton
                    className="text-xs px-3 py-1.5"
                    onClick={() => onDecline?.(request.id)}
                  >
                    Decline
                  </DangerButton>
                )}
                <PrimaryButton
                  className="text-xs px-3 py-1.5"
                  onClick={() => onPay?.(request.id)}
                >
                  Confirm Payment
                </PrimaryButton>
              </>
            )}
            <Link
              to={`/buyer/requests/${request.id}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-pl-accent hover:text-pl-accent-dark"
            >
              View <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {request.status === 'pending' && !canStillDecline && (
        <div className="mt-4 pt-4 border-t border-pl-line flex items-center gap-2 text-xs text-pl-muted">
          <Clock className="w-3.5 h-3.5" />
          Cancellation window has closed. You can still confirm payment to proceed.
        </div>
      )}
    </motion.div>
  )
}
