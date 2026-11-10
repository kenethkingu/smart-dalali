import { ArrowLeft, Clock } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PropertyImage } from '@/components/shared/PropertyImage'
import { usePagedList } from '@/hooks/management/usePagedList'
import { usePropertyAccess } from '@/hooks/management/usePropertyAccess'
import { useInspections } from '@/hooks/management/useInspections'
import { usePropertyEvents } from '@/hooks/management/usePropertyEvents'
import { findProperty } from '@/services/management/shared'
import { AccessDenied } from '../shared/AccessDenied'
import { EmptyState } from '../shared/EmptyState'
import { NotFoundState } from '../shared/NotFoundState'
import { Pagination } from '../shared/Pagination'
import { Timeline } from '../shared/Timeline'
import { InspectionDialog } from './InspectionDialog'
import { InspectionList } from './InspectionList'

export default function PropertyHistoryPage() {
  const { id } = useParams()
  const { t } = useTranslation()
  const property = findProperty(id ?? '')
  const access = usePropertyAccess(property)
  const events = usePropertyEvents(property?.id)
  const inspections = useInspections(property?.id)
  const { page, setPage } = usePagedList(events, property?.id)

  if (!property) {
    return (
      <div className="container mx-auto max-w-xl px-4 py-16">
        <NotFoundState backTo="/properties" />
      </div>
    )
  }

  if (!access.canViewHistory) return <AccessDenied />

  return (
    <div className="min-h-screen bg-pl-bg pb-24 text-pl-text">
      <div className="sticky top-16 z-40 border-b border-pl-line bg-pl-surface">
        <div className="container mx-auto flex h-14 items-center gap-3 px-4">
          <Link
            to={property.status === 'approved' ? `/properties/${property.id}` : '/owner/properties'}
            className="inline-flex min-h-11 items-center text-sm font-medium text-pl-muted hover:text-pl-text"
          >
            <ArrowLeft className="mr-1 h-4 w-4 text-pl-accent" aria-hidden="true" /> {t('common.back')}
          </Link>
        </div>
      </div>

      <div className="container mx-auto mt-8 max-w-3xl px-4">
        <div className="mb-8 flex items-center gap-4 rounded-2xl border border-pl-line bg-pl-surface p-6">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-pl-line bg-pl-bg">
            <PropertyImage property={property} className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-heading text-xl font-bold">{property.title}</h1>
            <p className="text-sm text-pl-muted">{property.location}</p>
            <p className="mt-1 text-xs text-pl-muted">{t('management.history.count', { count: events.length })}</p>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-2xl font-bold">{t('management.history.title')}</h2>
            <p className="text-sm text-pl-muted">{t('management.history.subtitle')}</p>
          </div>
          {access.canRecordInspection && <InspectionDialog propertyId={property.id} />}
        </div>

        {events.length === 0 ? (
          <EmptyState icon={Clock} title={t('management.history.empty_title')} description={t('management.history.empty_description')} />
        ) : (
          <>
            <Timeline events={page.items} />
            <Pagination page={page.page} pageCount={page.pageCount} onChange={setPage} />
          </>
        )}

        <InspectionList inspections={inspections} />
      </div>
    </div>
  )
}
