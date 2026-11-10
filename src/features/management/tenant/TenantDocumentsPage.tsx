import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/lib/auth'
import { useViewableDocuments } from '@/hooks/management/useDocuments'
import { useTenantLeases } from '@/hooks/management/useLeases'
import { DocumentList } from '../shared/DocumentList'
import { DocumentUploadForm, type UploadTarget } from '../shared/DocumentUploadForm'
import { PageHeader } from '../shared/PageHeader'
import { propertyLabel } from '../shared/PropertyLabel'

export default function TenantDocumentsPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const leases = useTenantLeases(user?.id)
  const viewable = useViewableDocuments(user)
  const documents = useMemo(() => viewable.filter(doc => doc.tenantId === user?.id), [viewable, user?.id])
  const targets = useMemo<UploadTarget[]>(
    () => leases.map(lease => ({ key: lease.id, propertyId: lease.propertyId, leaseId: lease.id, label: propertyLabel(lease.propertyId, lease.unitNumber) })),
    [leases],
  )

  return (
    <div className="max-w-3xl text-pl-text">
      <PageHeader title={t('management.documents.title')} description={t('management.documents.tenant_subtitle')} />
      <DocumentUploadForm key={targets.map(item => item.key).join()} targets={targets} />
      <DocumentList documents={documents} />
    </div>
  )
}
