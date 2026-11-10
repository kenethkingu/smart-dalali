import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, ShieldCheck, XCircle } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DangerButton, GhostButton, PrimaryButton } from '@/components/shared/Bits'
import { useAuth } from '@/lib/auth'
import { formatDate } from '@/lib/dateFormat'
import { useAllDocuments, usePendingDocuments } from '@/hooks/management/useDocuments'
import { usePagedList } from '@/hooks/management/usePagedList'
import { verifyDocument } from '@/services/management/documentService'
import { EmptyState } from '../shared/EmptyState'
import { PageHeader } from '../shared/PageHeader'
import { Pagination } from '../shared/Pagination'
import { propertyLabel } from '../shared/PropertyLabel'
import { errorText } from '../shared/errors'
import { DocumentReviewDialog, type ReviewMode } from './DocumentReviewDialog'
import type { PropertyDocument } from '@/types/management'

export default function VerificationPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const pending = usePendingDocuments()
  const all = useAllDocuments()
  const { page, setPage } = usePagedList(pending)
  const [reviewing, setReviewing] = useState<{ doc: PropertyDocument; mode: ReviewMode } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const verified = all.filter(doc => doc.status === 'verified').length

  const approve = (doc: PropertyDocument) => {
    if (!user) return
    const result = verifyDocument(user, doc.id)
    setError(result.ok ? null : errorText(t, result))
  }

  return (
    <div className="max-w-3xl text-pl-text">
      <PageHeader title={t('management.admin.verification_title')} description={t('management.admin.verification_subtitle')} />
      <p className="mb-6 text-sm text-pl-muted">{t('management.documents.progress', { verified, total: all.length })}</p>
      {error && (
        <p role="alert" className="mb-4 text-sm font-semibold text-pl-danger">
          {error}
        </p>
      )}
      {pending.length === 0 ? (
        <EmptyState icon={ShieldCheck} title={t('management.admin.queue_empty_title')} description={t('management.admin.queue_empty_description')} />
      ) : (
        <>
          <ul className="space-y-4">
            <AnimatePresence>
              {page.items.map(doc => (
                <motion.li
                  key={doc.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-2xl border border-pl-line bg-pl-surface p-5"
                >
                  <p className="font-bold text-pl-text">{t(`management.documents.type.${doc.type}`)}</p>
                  <p className="text-sm text-pl-muted">{doc.fileName}</p>
                  <p className="mb-4 mt-1 text-xs text-pl-muted">
                    {propertyLabel(doc.propertyId)} · {t('management.documents.uploaded_by', { name: doc.uploaderName, date: formatDate(doc.uploadedAt) })}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <GhostButton onClick={() => setReviewing({ doc, mode: 'preview' })} className="min-h-11 border border-pl-line">
                      {t('management.admin.preview')}
                    </GhostButton>
                    <DangerButton onClick={() => setReviewing({ doc, mode: 'reject' })} className="min-h-11">
                      <XCircle className="h-4 w-4" aria-hidden="true" /> {t('admin_dashboard.reject')}
                    </DangerButton>
                    <PrimaryButton onClick={() => approve(doc)} className="min-h-11 sm:w-auto">
                      <CheckCircle className="h-4 w-4" aria-hidden="true" /> {t('admin_dashboard.approve')}
                    </PrimaryButton>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          <Pagination page={page.page} pageCount={page.pageCount} onChange={setPage} />
        </>
      )}
      <DocumentReviewDialog document={reviewing?.doc ?? null} mode={reviewing?.mode ?? 'preview'} onClose={() => setReviewing(null)} />
    </div>
  )
}
