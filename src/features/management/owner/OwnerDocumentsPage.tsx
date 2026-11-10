import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { properties } from '@/data/mockData'
import { useAuth } from '@/lib/auth'
import { can } from '@/lib/rbac'
import { useViewableDocuments } from '@/hooks/management/useDocuments'
import { useManagedLeases } from '@/hooks/management/useLeases'
import { DocumentList } from '../shared/DocumentList'
import { DocumentUploadForm, type UploadTarget } from '../shared/DocumentUploadForm'
import { PageHeader } from '../shared/PageHeader'
import { propertyLabel } from '../shared/PropertyLabel'

export default function OwnerDocumentsPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const leases = useManagedLeases(user)
  const documents = useViewableDocuments(user)
  const targets = useMemo<UploadTarget[]>(() => {
    const propertyTargets = properties
      .filter(property => can(user, 'document.upload', { ownerId: property.ownerId, managerId: property.managerId }))
      .map(property => ({ key: property.id, propertyId: property.id, label: property.title }))
    const leaseTargets = leases.map(lease => ({
      key: lease.id,
      propertyId: lease.propertyId,
      leaseId: lease.id,
      label: t('management.documents.lease_target', { property: propertyLabel(lease.propertyId, lease.unitNumber), tenant: lease.tenantName }),
    }))
    return [...propertyTargets, ...leaseTargets]
  }, [user, leases, t])

  return (
    <div className="max-w-3xl text-pl-text">
      <PageHeader title={t('management.documents.title')} description={t('management.documents.owner_subtitle')} />
      <DocumentUploadForm key={targets.map(item => item.key).join()} targets={targets} />
      <DocumentList documents={documents} />
    </div>
  )
}
