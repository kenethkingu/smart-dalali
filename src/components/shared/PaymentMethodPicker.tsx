import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GhostButton, PrimaryButton } from '@/components/shared/Bits'

const METHODS = ['M-Pesa', 'Tigo Pesa', 'Airtel Money', 'Bank / Card'] as const
const BANK_METHOD = 'Bank / Card'
const FIELD_CLASS =
  'w-full h-12 px-4 rounded-xl border border-pl-line bg-pl-bg text-pl-text placeholder:text-pl-muted focus:outline-none focus:border-pl-accent'

interface PaymentMethodPickerProps {
  readonly onConfirm: (method: string) => void
  readonly confirmLabel: string
  readonly isSubmitting?: boolean
}

function MethodGrid({ method, onSelect }: Readonly<{ method: string | null; onSelect: (method: string) => void }>) {
  return (
    <div className="grid grid-cols-2 gap-3 py-4">
      {METHODS.map(item => (
        <button
          type="button"
          key={item}
          aria-pressed={method === item}
          onClick={() => onSelect(item)}
          className={`min-h-12 p-4 border rounded-xl font-semibold text-sm transition-colors ${
            method === item ? 'border-pl-accent bg-pl-accent text-white' : 'border-pl-line bg-pl-bg text-pl-text hover:border-pl-accent'
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  )
}

function PaymentDetails({ method }: Readonly<{ method: string }>) {
  const { t } = useTranslation()
  if (method === BANK_METHOD) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="pay-card" className="text-sm font-semibold text-pl-text">{t('payment.card_number')}</label>
          <input id="pay-card" type="text" inputMode="numeric" placeholder="0000 0000 0000 0000" className={FIELD_CLASS} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="pay-expiry" className="text-sm font-semibold text-pl-text">{t('payment.expiry')}</label>
            <input id="pay-expiry" type="text" placeholder="MM/YY" className={FIELD_CLASS} />
          </div>
          <div className="space-y-2">
            <label htmlFor="pay-cvv" className="text-sm font-semibold text-pl-text">{t('payment.cvv')}</label>
            <input id="pay-cvv" type="text" inputMode="numeric" placeholder="123" className={FIELD_CLASS} />
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-2">
      <label htmlFor="pay-phone" className="text-sm font-semibold text-pl-text">{t('contact.phone_number')}</label>
      <input id="pay-phone" type="tel" placeholder="+255 7XX XXX XXX" className={FIELD_CLASS} />
      <p className="text-xs text-pl-muted">{t('payment.prompt_hint')}</p>
    </div>
  )
}

export function PaymentMethodPicker({ onConfirm, confirmLabel, isSubmitting }: PaymentMethodPickerProps) {
  const { t } = useTranslation()
  const [method, setMethod] = useState<string | null>(null)
  const [step, setStep] = useState<1 | 2>(1)

  if (step === 1 || !method) {
    return (
      <div>
        <MethodGrid method={method} onSelect={setMethod} />
        <PrimaryButton disabled={!method} onClick={() => setStep(2)} className="min-h-11 w-full">
          {t('common.confirm')}{method ? ` (${method})` : ''}
        </PrimaryButton>
      </div>
    )
  }

  return (
    <div>
      <h3 className="mb-3 text-sm font-bold text-pl-text">{t('payment.details_title', { method })}</h3>
      <PaymentDetails method={method} />
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-between">
        <GhostButton onClick={() => setStep(1)} className="min-h-11 border border-pl-line text-pl-text">
          {t('common.back')}
        </GhostButton>
        <PrimaryButton onClick={() => onConfirm(method)} isLoading={isSubmitting} className="min-h-11 sm:w-auto">
          {confirmLabel}
        </PrimaryButton>
      </div>
    </div>
  )
}
