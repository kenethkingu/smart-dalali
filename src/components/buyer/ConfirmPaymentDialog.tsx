import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { PrimaryButton, formatPrice } from '@/components/shared/Bits'
import type { Property } from '@/types'
import confetti from 'canvas-confetti'

interface ConfirmPaymentDialogProps {
  property: Property
  onConfirm: () => void
  triggerClassName?: string
}

export function ConfirmPaymentDialog({ property, onConfirm, triggerClassName }: ConfirmPaymentDialogProps) {
  const handleConfirmPayment = () => {
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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <PrimaryButton className={triggerClassName}>Confirm Payment</PrimaryButton>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm payment for {property.title}?</AlertDialogTitle>
          <AlertDialogDescription>
            TSh {formatPrice(property.price)}{property.priceUnit === 'month' ? '/mo' : ''} —
            you're confirming you've inspected the property and want to proceed.
            This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmPayment}>
            Yes, Confirm Payment
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
