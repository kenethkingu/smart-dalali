import { ExternalLink, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { formatDate } from '@/lib/dateFormat'
import { getFileUrl } from '@/lib/objectUrls'
import { usePagedList } from '@/hooks/management/usePagedList'
import { EmptyState } from './EmptyState'
import { MetaBadge } from './MetaBadge'
import { Pagination } from './Pagination'
import { DOCUMENT_STATUS_META } from './statusMeta'
import { propertyLabel } from './PropertyLabel'
import type { PropertyDocument } from '@/types/management'

function DocumentLink({ doc }: Readonly<{ doc: PropertyDocument }>) {
  const { t } = useTranslation()
  const url = getFileUrl(doc.id)
  const className = 'inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-pl-accent hover:underline'
  if (url) {
    return (
      <a href={url} target="_blank" rel="noreferrer" className={className}>
        {t('management.documents.open')} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
      </a>
    )
  }
  if (doc.type === 'tenancy_agreement' && doc.leaseId) {
    return (
      <Link to={`/tenant/agreement/${doc.leaseId}`} className={className}>
        {t('management.documents.open')}
      </Link>
    )
  }
  return <span className="text-xs text-pl-muted">{t('management.documents.preview_unavailable')}</span>
}

export function DocumentList({ documents }: Readonly<{ documents: readonly PropertyDocument[] }>) {
  const { t } = useTranslation()
  const { page, setPage } = usePagedList(documents)
  const verified = documents.filter(doc => doc.status === 'verified').length

  if (documents.length === 0) {
    return <EmptyState icon={FileText} title={t('management.documents.empty_title')} description={t('management.documents.empty_description')} />
  }
  return (
    <section aria-labelledby="documents-heading">
      <h2 id="documents-heading" className="mb-1 font-heading text-lg font-bold text-pl-text">
        {t('management.documents.list_title')}
      </h2>
      <p className="mb-4 text-sm text-pl-muted">{t('management.documents.progress', { verified, total: documents.length })}</p>
      <ul className="space-y-3">
        {page.items.map(doc => (
          <li key={doc.id} className="rounded-2xl border border-pl-line bg-pl-surface p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-semibold text-pl-text">{t(`management.documents.type.${doc.type}`)}</p>
                <p className="truncate text-sm text-pl-muted">{doc.fileName}</p>
              </div>
              <MetaBadge meta={DOCUMENT_STATUS_META[doc.status]} />
            </div>
            <p className="mt-1 text-xs text-pl-muted">
              {propertyLabel(doc.propertyId)} · {t('management.documents.uploaded_by', { name: doc.uploaderName, date: formatDate(doc.uploadedAt) })}
            </p>
            {doc.status === 'rejected' && doc.rejectReason && (
              <p className="mt-2 text-sm text-pl-text">{t('management.documents.rejected_reason', { reason: doc.rejectReason })}</p>
            )}
            <DocumentLink doc={doc} />
          </li>
        ))}
      </ul>
      <Pagination page={page.page} pageCount={page.pageCount} onChange={setPage} />
    </section>
  )
}
