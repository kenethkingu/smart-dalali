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

interface RequestVisitDialogProps {
  property: Property
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RequestVisitDialog({ property, open, onOpenChange }: RequestVisitDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addEvent } = useEvents()
  const { user } = useAuth()

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
          <AlertDialogTitle>Request a Site Visit</AlertDialogTitle>
          <AlertDialogDescription>
            You are requesting a site visit for <strong>{property.title}</strong>. 
            The owner will be notified and will contact you to arrange a time.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <PrimaryButton onClick={handleRequest} isLoading={isSubmitting}>
            Send Request
          </PrimaryButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

