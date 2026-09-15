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

interface RequestVisitDialogProps {
  property: Property
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RequestVisitDialog({ property, open, onOpenChange }: RequestVisitDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRequest = async () => {
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 600))
    setIsSubmitting(false)
    onOpenChange(false)
    // Optional: could add a toast here
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
