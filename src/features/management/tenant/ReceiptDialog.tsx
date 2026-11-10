import { Printer } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { GhostButton } from '@/components/shared/Bits'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Logo } from '@/components/shared/Logo'
import { formatDate } from '@/lib/dateFormat'
import { formatTZS } from '@/lib/money'
import { propertyLabel } from '../shared/PropertyLabel'
import type { Lease, RentPayment } from '@/types/management'

interface ReceiptDialogProps {
  readonly payment: RentPayment | null
  readonly lease: Lease | undefined
  readonly onClose: () => void
}

export function ReceiptDialog({ payment, lease, onClose }: ReceiptDialogProps) {
  const { t } = useTranslation()
  const rows =
    payment && lease && payment.paidDate
      ? [
          { label: t('management.receipt.reference'), value: payment.reference ?? '-' },
          { label: t('management.receipt.tenant'), value: lease.tenantName },
          { label: t('management.receipt.property'), value: propertyLabel(lease.propertyId, lease.unitNumber) },
          { label: t('management.receipt.due_date'), value: formatDate(payment.dueDate) },
          { label: t('management.receipt.paid_date'), value: formatDate(payment.paidDate) },
          { label: t('management.receipt.method'), value: payment.method ?? '-' },
          { label: t('management.receipt.amount'), value: formatTZS(payment.amount) },
        ]
      : []

  return (
    <Dialog open={rows.length > 0} onOpenChange={open => !open && onClose()}>
      <DialogContent className="border border-pl-line bg-pl-surface text-pl-text">
        <div className="print-receipt space-y-4">
          <Logo size={28} />
          <DialogHeader>
            <DialogTitle>{t('management.receipt.title')}</DialogTitle>
            <DialogDescription>{t('management.receipt.note')}</DialogDescription>
          </DialogHeader>
          <dl className="space-y-2 text-sm">
            {rows.map(row => (
              <div key={row.label} className="flex justify-between gap-3 border-b border-pl-line pb-2">
                <dt className="text-pl-muted">{row.label}</dt>
                <dd className="text-right font-semibold">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <GhostButton onClick={() => window.print()} className="print-hidden min-h-11 border border-pl-line">
          <Printer className="h-4 w-4" aria-hidden="true" /> {t('management.receipt.print')}
        </GhostButton>
      </DialogContent>
    </Dialog>
  )
}
