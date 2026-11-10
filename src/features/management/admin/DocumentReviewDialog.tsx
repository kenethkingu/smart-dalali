import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { DangerButton } from '@/components/shared/Bits'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth } from '@/lib/auth'
import { getFileUrl } from '@/lib/objectUrls'
import { rejectDocument } from '@/services/management/documentService'
import { FormField } from '../shared/FormField'
import { INPUT_CLASS } from '../shared/formStyles'
import { errorText } from '../shared/errors'
import type { PropertyDocument } from '@/types/management'

export type ReviewMode = 'preview' | 'reject'

interface DocumentReviewDialogProps {
  readonly document: PropertyDocument | null
  readonly mode: ReviewMode
  readonly onClose: () => void
}

function Preview({ doc }: Readonly<{ doc: PropertyDocument }>) {
  const { t } = useTranslation()
  const url = getFileUrl(doc.id)
  if (!url) return <p className="rounded-xl border border-pl-line bg-pl-bg p-4 text-sm text-pl-muted">{t('management.admin.no_preview')}</p>
  if (doc.mimeType === 'application/pdf') {
    return <iframe src={url} title={doc.fileName} className="h-72 w-full rounded-xl border border-pl-line bg-pl-bg" />
  }
  return <img src={url} alt={doc.fileName} className="max-h-72 w-full rounded-xl border border-pl-line object-contain" />
}

function RejectForm({ doc, onDone }: Readonly<{ doc: PropertyDocument; onDone: () => void }>) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | undefined>()

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!user) return
    const result = rejectDocument(user, doc.id, reason)
    if (result.ok) onDone()
    else setError(errorText(t, result))
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <FormField id="reject-reason" label={t('management.admin.reject_reason')} hint={t('management.admin.reject_hint')} error={error}>
        {props => (
          <textarea
            {...props}
            rows={3}
            maxLength={300}
            className={INPUT_CLASS}
            value={reason}
            onChange={e => setReason(e.target.value)}
            onBlur={() => setError(reason.trim().length < 10 ? t('management.errors.reason_short') : undefined)}
          />
        )}
      </FormField>
      <DangerButton type="submit" className="min-h-11">
        {t('management.admin.reject_confirm')}
      </DangerButton>
    </form>
  )
}

export function DocumentReviewDialog({ document: doc, mode, onClose }: DocumentReviewDialogProps) {
  const { t } = useTranslation()
  return (
    <Dialog open={doc !== null} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border border-pl-line bg-pl-surface text-pl-text">
        {doc && (
          <>
            <DialogHeader>
              <DialogTitle>{t(`management.documents.type.${doc.type}`)}</DialogTitle>
              <DialogDescription>{doc.fileName}</DialogDescription>
            </DialogHeader>
            <Preview doc={doc} />
            {mode === 'reject' && <RejectForm doc={doc} onDone={onClose} />}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
