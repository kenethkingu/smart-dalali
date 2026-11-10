import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useTranslation } from 'react-i18next'
import { PrimaryButton } from '@/components/shared/Bits'
import { PaymentMethodPicker } from '@/components/shared/PaymentMethodPicker'
import { fireSuccessConfetti } from '@/lib/confetti'

interface ConfirmPaymentDialogProps {
  onConfirm: () => void
  triggerClassName?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

export function ConfirmPaymentDialog({ onConfirm, triggerClassName, open, onOpenChange, children }: ConfirmPaymentDialogProps) {
  const { t } = useTranslation()

  const handleConfirmPayment = () => {
    onConfirm()
    fireSuccessConfetti()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children ?? <PrimaryButton className={triggerClassName}>{t('buyer_dashboard.action_confirm')}</PrimaryButton>}
      </DialogTrigger>
      <DialogContent className="bg-pl-surface border border-pl-line text-pl-text">
        <DialogHeader>
          <DialogTitle className="text-pl-text">{t('buyer_dashboard.confirm_payment_title')}</DialogTitle>
          <DialogDescription className="text-pl-muted">{t('buyer_dashboard.confirm_payment_desc')}</DialogDescription>
        </DialogHeader>
        <PaymentMethodPicker onConfirm={handleConfirmPayment} confirmLabel={t('buyer_dashboard.action_confirm')} />
      </DialogContent>
    </Dialog>
  )
}
