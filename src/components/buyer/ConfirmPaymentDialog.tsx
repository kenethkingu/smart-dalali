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
import { PrimaryButton } from '@/components/shared/Bits'
import type { Property } from '@/types'
import confetti from 'canvas-confetti'

interface ConfirmPaymentDialogProps {
  property: Property
  onConfirm: () => void
  triggerClassName?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

export function ConfirmPaymentDialog({ onConfirm, triggerClassName, open, onOpenChange, children }: ConfirmPaymentDialogProps) {
  const [method, setMethod] = useState<string | null>(null)
  
  const handleConfirmPayment = () => {
    if (!method) return
    onConfirm()

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
            onClick={handleConfirmPayment}
            className="w-full sm:w-auto"
          >
            Continue with {method || '...'}
          </PrimaryButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
