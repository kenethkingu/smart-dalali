import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PaymentMethodPicker } from '@/components/shared/PaymentMethodPicker'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useAuth } from '@/lib/auth'
import { fireSuccessConfetti } from '@/lib/confetti'
import { formatDate } from '@/lib/dateFormat'
import { formatTZS } from '@/lib/money'
import { payRent } from '@/services/management/rentService'
import { errorText } from '../shared/errors'
import { SuccessCheck } from '../shared/SuccessCheck'
import type { RentPayment } from '@/types/management'

interface PayRentSheetProps {
  readonly payment: RentPayment | null
  readonly onClose: () => void
  readonly onViewReceipt: (payment: RentPayment) => void
}

export function PayRentSheet({ payment, onClose, onViewReceipt }: PayRentSheetProps) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [paid, setPaid] = useState<RentPayment | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleOpenChange = (open: boolean) => {
    if (open) return
    setPaid(null)
    setError(null)
    onClose()
  }

  const handleConfirm = (method: string) => {
    if (!user || !payment) return
    const result = payRent(user, payment.id, method)
    if (!result.ok) {
      setError(errorText(t, result))
      return
    }
    setError(null)
    setPaid(result.value)
    fireSuccessConfetti()
  }

  return (
    <Sheet open={payment !== null} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full overflow-y-auto border-pl-line bg-pl-surface text-pl-text sm:max-w-md">
        {paid ? (
          <div className="pt-8 text-center">
            <SuccessCheck />
            <SheetHeader className="mt-4 text-center sm:text-center">
              <SheetTitle className="text-pl-text">{t('management.rent.success_title')}</SheetTitle>
              <SheetDescription className="text-pl-muted">
                {t('management.rent.success_description', { amount: formatTZS(paid.amount), reference: paid.reference })}
              </SheetDescription>
            </SheetHeader>
            <button
              type="button"
              onClick={() => {
                onViewReceipt(paid)
                handleOpenChange(false)
              }}
              className="mt-6 min-h-11 font-semibold text-pl-accent hover:underline"
            >
              {t('management.rent.view_receipt')}
            </button>
          </div>
        ) : (
          <>
            <SheetHeader>
              <SheetTitle className="text-pl-text">{t('management.rent.pay_title')}</SheetTitle>
              <SheetDescription className="text-pl-muted">
                {payment ? t('management.rent.pay_description', { amount: formatTZS(payment.amount), date: formatDate(payment.dueDate) }) : ''}
              </SheetDescription>
            </SheetHeader>
            {error && (
              <p role="alert" className="mt-4 text-sm font-semibold text-pl-danger">
                {error}
              </p>
            )}
            <PaymentMethodPicker onConfirm={handleConfirm} confirmLabel={t('management.rent.pay_button')} />
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
