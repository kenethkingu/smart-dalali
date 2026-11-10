import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { usePropertyEvents } from '@/hooks/management/usePropertyEvents'
import { Timeline } from '../shared/Timeline'

const LATEST_COUNT = 5

export function LatestActivity({ propertyId }: Readonly<{ propertyId: string }>) {
  const { t } = useTranslation()
  const events = usePropertyEvents(propertyId)
  return (
    <section aria-labelledby="latest-activity-heading">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 id="latest-activity-heading" className="font-heading text-lg font-bold text-pl-text">
          {t('management.history.latest')}
        </h2>
        <Link to={`/properties/${propertyId}/history`} className="inline-flex min-h-11 items-center text-sm font-semibold text-pl-accent hover:underline">
          {t('management.common.view_all')}
        </Link>
      </div>
      <Timeline events={events.slice(0, LATEST_COUNT)} />
    </section>
  )
}
