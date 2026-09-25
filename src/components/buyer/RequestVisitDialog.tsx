import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { PrimaryButton } from '@/components/shared/Bits'
import type { Property } from '@/types'
import { useEvents } from '@/lib/events'
import { useAuth } from '@/lib/auth'
import { useTranslation } from 'react-i18next'

interface RequestVisitDialogProps {
  property: Property
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RequestVisitDialog({ property, open, onOpenChange }: RequestVisitDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addEvent } = useEvents()
  const { user } = useAuth()
  const { t } = useTranslation()

  const handleRequest = async () => {
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 600))
    setIsSubmitting(false)
    onOpenChange(false)

    // Append event to the shared timeline
    addEvent({
      propertyId: property.id,
      type: 'visit_requested',
      actorId: user?.id ?? 'buyer1',
      summary: `${user?.name ?? 'A buyer'} requested a site visit for ${property.title}.`,
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('visit_dialog.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('visit_dialog.desc', { title: property.title })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>{t('common.cancel')}</AlertDialogCancel>
          <PrimaryButton onClick={handleRequest} isLoading={isSubmitting}>
            {t('visit_dialog.send')}
          </PrimaryButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

