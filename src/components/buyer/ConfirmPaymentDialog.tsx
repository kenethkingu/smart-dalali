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
  const [method, setMethod] = useState<string | null>(null)
  const [step, setStep] = useState<1 | 2>(1)
  const [accountNumber, setAccountNumber] = useState('')
  
  const handleConfirmPayment = () => {
    if (!method) return
    onConfirm()
    setStep(1) // reset for future opens

    // Trigger confetti from the left and right edges
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
          <PrimaryButton className={triggerClassName}>Confirm Payment</PrimaryButton>
        </DialogTrigger>
      )}
      <DialogContent>
        {step === 1 ? (
          <>
            <DialogHeader>
              <DialogTitle>Select Payment Method</DialogTitle>
              <DialogDescription>
                Your payment is held securely until your visit is confirmed.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-3 py-4">
              {['M-Pesa', 'Tigo Pesa', 'Airtel Money', 'Bank / Card'].map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`p-4 border rounded-xl font-semibold text-sm transition-colors ${
                    method === m 
                      ? 'border-pl-ink bg-pl-ink text-white' 
                      : 'border-pl-line bg-white text-pl-ink hover:border-pl-muted'
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
                Continue with {method || '...'}
              </PrimaryButton>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Enter {method} Details</DialogTitle>
              <DialogDescription>
                Provide your {method === 'Bank / Card' ? 'card information' : 'mobile number'} to complete the payment.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              {method === 'Bank / Card' ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-pl-ink">Card Number</label>
                    <input 
                      type="text" 
                      placeholder="0000 0000 0000 0000" 
                      className="w-full h-12 px-4 rounded-xl border border-pl-line bg-pl-surface focus:outline-none focus:ring-2 focus:ring-pl-accent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-pl-ink">Expiry Date</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        className="w-full h-12 px-4 rounded-xl border border-pl-line bg-pl-surface focus:outline-none focus:ring-2 focus:ring-pl-accent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-pl-ink">CVV</label>
                      <input 
                        type="text" 
                        placeholder="123" 
                        className="w-full h-12 px-4 rounded-xl border border-pl-line bg-pl-surface focus:outline-none focus:ring-2 focus:ring-pl-accent"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-pl-ink">Mobile Number</label>
                  <input 
                    type="tel" 
                    placeholder="e.g. 07XXXXXXXX" 
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-pl-line bg-pl-surface focus:outline-none focus:ring-2 focus:ring-pl-accent"
                  />
                  <p className="text-xs text-pl-muted mt-2">
                    A prompt will be sent to your phone to enter your PIN.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="flex sm:justify-between w-full">
              <GhostButton onClick={() => setStep(1)} className="w-full sm:w-auto sm:mr-auto mb-2 sm:mb-0 border border-pl-line">Back</GhostButton>
              <PrimaryButton onClick={handleConfirmPayment} className="w-full sm:w-auto">Confirm Payment</PrimaryButton>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
