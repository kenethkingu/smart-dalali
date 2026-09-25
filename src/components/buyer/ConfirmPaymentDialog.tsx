import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PrimaryButton, GhostButton } from '@/components/shared/Bits'
import confetti from 'canvas-confetti'

interface ConfirmPaymentDialogProps {
  onConfirm: () => void
  triggerClassName?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

export function ConfirmPaymentDialog({ onConfirm, triggerClassName, open, onOpenChange, children }: ConfirmPaymentDialogProps) {
  const { t } = useTranslation()
  const [method, setMethod] = useState<string | null>(null)
  const [step, setStep] = useState<1 | 2>(1)
  const [accountNumber, setAccountNumber] = useState('')
  
  const handleConfirmPayment = () => {
    if (!method) return
    onConfirm()
    setStep(1)

    const duration = 2000
    const end = Date.now() + duration
    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#16A97C', '#0B0B0C', '#E5E5E4']
      })
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#16A97C', '#0B0B0C', '#E5E5E4']
      })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children ? (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <PrimaryButton className={triggerClassName}>{t('buyer_dashboard.action_confirm')}</PrimaryButton>
        </DialogTrigger>
      )}
      <DialogContent className="bg-pl-surface border border-pl-line text-pl-text">
        {step === 1 ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-pl-text">{t('buyer_dashboard.confirm_payment_title')}</DialogTitle>
              <DialogDescription className="text-pl-muted">
                {t('buyer_dashboard.confirm_payment_desc')}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-3 py-4">
              {['M-Pesa', 'Tigo Pesa', 'Airtel Money', 'Bank / Card'].map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`p-4 border rounded-xl font-semibold text-sm transition-colors ${
                    method === m 
                      ? 'border-pl-accent bg-pl-accent text-white' 
                      : 'border-pl-line bg-pl-bg text-pl-text hover:border-pl-accent'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <DialogFooter>
              <PrimaryButton 
                disabled={!method} 
                onClick={() => setStep(2)}
                className="w-full sm:w-auto"
              >
                {t('common.confirm')} ({method || '...'})
              </PrimaryButton>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-pl-text">{method} Details</DialogTitle>
              <DialogDescription className="text-pl-muted">
                Provide your details to complete the site visit reservation.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 space-y-4 text-pl-text">
              {method === 'Bank / Card' ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-pl-text">Card Number</label>
                    <input 
                      type="text" 
                      placeholder="0000 0000 0000 0000" 
                      className="w-full h-12 px-4 rounded-xl border border-pl-line bg-pl-bg text-pl-text placeholder:text-pl-muted focus:outline-none focus:border-pl-accent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-pl-text">Expiry Date</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        className="w-full h-12 px-4 rounded-xl border border-pl-line bg-pl-bg text-pl-text placeholder:text-pl-muted focus:outline-none focus:border-pl-accent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-pl-text">CVV</label>
                      <input 
                        type="text" 
                        placeholder="123" 
                        className="w-full h-12 px-4 rounded-xl border border-pl-line bg-pl-bg text-pl-text placeholder:text-pl-muted focus:outline-none focus:border-pl-accent"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-pl-text">{t('contact.phone_number')}</label>
                  <input 
                    type="tel" 
                    placeholder="e.g. +255 7XX XXX XXX" 
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-pl-line bg-pl-bg text-pl-text placeholder:text-pl-muted focus:outline-none focus:border-pl-accent"
                  />
                  <p className="text-xs text-pl-muted mt-2">
                    A prompt will be sent to your phone to confirm.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="flex sm:justify-between w-full">
              <GhostButton onClick={() => setStep(1)} className="w-full sm:w-auto sm:mr-auto mb-2 sm:mb-0 border border-pl-line text-pl-text">{t('common.back')}</GhostButton>
              <PrimaryButton onClick={handleConfirmPayment} className="w-full sm:w-auto">{t('buyer_dashboard.action_confirm')}</PrimaryButton>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
