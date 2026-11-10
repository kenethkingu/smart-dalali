import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GhostButton, PrimaryButton } from '@/components/shared/Bits'
import { useAuth } from '@/lib/auth'
import { formatDate } from '@/lib/dateFormat'
import { formatTZS } from '@/lib/money'
import { respondToRenewal } from '@/services/management/leaseService'
import { errorText } from '../shared/errors'
import type { Lease } from '@/types/management'

export function RenewalOfferCard({ lease }: Readonly<{ lease: Lease }>) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const offer = lease.renewalOffer
  if (offer?.status !== 'offered') return null

  const respond = (accept: boolean) => {
    if (!user) return
    const result = respondToRenewal(user, lease.id, accept)
    setError(result.ok ? null : errorText(t, result))
  }

  return (
    <section className="mb-6 rounded-2xl border border-pl-accent bg-pl-surface p-5" aria-labelledby="renewal-heading">
      <h2 id="renewal-heading" className="mb-1 font-heading text-lg font-bold text-pl-text">
        {t('management.renewal.title')}
      </h2>
      <p className="mb-4 text-sm text-pl-muted">
        {t('management.renewal.description', { date: formatDate(offer.endDate), rent: formatTZS(offer.monthlyRent) })}
      </p>
      {error && (
        <p role="alert" className="mb-3 text-sm font-semibold text-pl-danger">
          {error}
        </p>
      )}
      <div className="flex flex-col gap-2 sm:flex-row">
        <PrimaryButton onClick={() => respond(true)} className="min-h-11 sm:w-auto">
          {t('management.renewal.accept')}
        </PrimaryButton>
        <GhostButton onClick={() => respond(false)} className="min-h-11">
          {t('management.renewal.decline')}
        </GhostButton>
      </div>
    </section>
  )
}
