import { Building2, MapPin, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PropertyImage } from '@/components/shared/PropertyImage'
import { buildings } from '@/data/mockData'
import { findProperty } from '@/services/management/shared'
import { MetaBadge } from '../shared/MetaBadge'
import { LEASE_STATUS_META } from '../shared/statusMeta'
import { getLeaseStatus } from '@/services/management/leaseService'
import type { Lease } from '@/types/management'

export function HomeCard({ lease }: Readonly<{ lease: Lease }>) {
  const { t } = useTranslation()
  const property = findProperty(lease.propertyId)
  const building = buildings.find(item => item.id === lease.buildingId)
  if (!property) return null
  return (
    <section className="mb-6 flex flex-col overflow-hidden rounded-2xl border border-pl-line bg-pl-surface sm:flex-row" aria-label={t('management.tenant.current_home')}>
      <div className="h-44 shrink-0 bg-pl-bg sm:h-auto sm:w-56">
        <PropertyImage property={property} className="h-full w-full object-cover" />
      </div>
      <div className="flex-1 p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h2 className="font-heading text-xl font-bold text-pl-text">{property.title}</h2>
          <MetaBadge meta={LEASE_STATUS_META[getLeaseStatus(lease)]} />
        </div>
        <ul className="space-y-1.5 text-sm text-pl-muted">
          <li className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" /> {property.location}
          </li>
          {building && (
            <li className="flex items-center gap-2">
              <Building2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              {t('management.tenant.unit_in_building', { unit: lease.unitNumber ?? '-', building: building.name })}
            </li>
          )}
          <li className="flex items-center gap-2">
            <User className="h-4 w-4 shrink-0" aria-hidden="true" /> {t('management.tenant.owner_name', { name: lease.ownerName })}
          </li>
        </ul>
      </div>
    </section>
  )
}
