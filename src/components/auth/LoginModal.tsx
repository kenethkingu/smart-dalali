import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { LoginForm } from './LoginForm'

interface LoginModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  contextProperty?: string
}

export function LoginModal({ isOpen, onOpenChange, onSuccess, contextProperty }: LoginModalProps) {
  const handleSuccess = () => {
    onOpenChange(false)
    onSuccess?.()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-pl-surface border-none shadow-2xl">
        <div className="max-h-[90vh] overflow-y-auto custom-scrollbar p-6">
          <LoginForm onSuccess={handleSuccess} contextProperty={contextProperty} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
