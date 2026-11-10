import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { GhostButton, PrimaryButton } from '@/components/shared/Bits'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth } from '@/lib/auth'
import { endLease, offerRenewal } from '@/services/management/leaseService'
import { FormField } from '../shared/FormField'
import { INPUT_CLASS } from '../shared/formStyles'
import { errorText } from '../shared/errors'
import type { Lease, Result } from '@/types/management'

type Mode = 'end' | 'renew'

function toIso(dateInput: string): string {
  return dateInput ? new Date(`${dateInput}T00:00:00`).toISOString() : ''
}

function LeaseForm({ lease, mode, onDone }: Readonly<{ lease: Lease; mode: Mode; onDone: () => void }>) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [date, setDate] = useState('')
  const [rent, setRent] = useState(String(lease.monthlyRent))
  const [errors, setErrors] = useState<{ date?: string; rent?: string }>({})

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!user) return
    const iso = toIso(date)
    const result: Result<Lease> =
      mode === 'end' ? endLease(user, lease.id, iso) : offerRenewal(user, lease.id, { endDate: iso, monthlyRent: Number(rent) })
    if (result.ok) {
      onDone()
      return
    }
    const message = errorText(t, result)
    setErrors(result.error === 'invalid_amount' ? { rent: message } : { date: message })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <FormField id={`${mode}-date`} label={t(mode === 'end' ? 'management.owner.end_date' : 'management.owner.new_end_date')} error={errors.date}>
        {props => <input {...props} type="date" className={INPUT_CLASS} value={date} onChange={e => setDate(e.target.value)} />}
      </FormField>
      {mode === 'renew' && (
        <FormField id="renew-rent" label={t('management.owner.new_rent')} error={errors.rent}>
          {props => <input {...props} type="number" inputMode="numeric" min={1} className={INPUT_CLASS} value={rent} onChange={e => setRent(e.target.value)} />}
        </FormField>
      )}
      <PrimaryButton type="submit" className="min-h-11">
        {t(mode === 'end' ? 'management.owner.end_confirm' : 'management.owner.renew_confirm')}
      </PrimaryButton>
    </form>
  )
}

export function LeaseActionDialogs({ lease }: Readonly<{ lease: Lease }>) {
  const { t } = useTranslation()
  const [mode, setMode] = useState<Mode | null>(null)
  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row">
        <PrimaryButton onClick={() => setMode('renew')} className="min-h-11 sm:w-auto">
          {t('management.owner.offer_renewal')}
        </PrimaryButton>
        <GhostButton onClick={() => setMode('end')} className="min-h-11">
          {t('management.owner.end_lease')}
        </GhostButton>
      </div>
      <Dialog open={mode !== null} onOpenChange={open => !open && setMode(null)}>
        <DialogContent className="border border-pl-line bg-pl-surface text-pl-text">
          <DialogHeader>
            <DialogTitle>{t(mode === 'end' ? 'management.owner.end_lease' : 'management.owner.offer_renewal')}</DialogTitle>
            <DialogDescription>{t(mode === 'end' ? 'management.owner.end_description' : 'management.owner.renew_description')}</DialogDescription>
          </DialogHeader>
          {mode && <LeaseForm lease={lease} mode={mode} onDone={() => setMode(null)} />}
        </DialogContent>
      </Dialog>
    </>
  )
}
