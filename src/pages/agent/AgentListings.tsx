import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { properties } from '@/data/mockData'
import { PropertyImage } from '@/components/shared/PropertyImage'
import { PropertyStatusBadge, formatPrice } from '@/components/shared/Bits'
import { MapPin, Eye } from 'lucide-react'

export function AgentListings() {
  const { t } = useTranslation()
  return (
    <div className="max-w-6xl space-y-8 text-pl-text">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-pl-text mb-1">{t('agent_dashboard.stat_listings')}</h1>
        <p className="text-pl-muted">{t('agent_dashboard.subtitle')}</p>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(property => (
          <div key={property.id} className="bg-pl-surface rounded-2xl border border-pl-line overflow-hidden shadow-sm flex flex-col hover:border-pl-accent/50 transition-colors text-pl-text">
            <div className="aspect-[16/10] bg-pl-bg relative overflow-hidden">
              <PropertyImage property={property} className="w-full h-full object-cover" alt={property.title} />
              <div className="absolute top-3 left-3">
                <PropertyStatusBadge status={property.status} />
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-heading font-bold text-lg text-pl-text mb-1 line-clamp-1">{property.title}</h3>
                <div className="text-xs text-pl-muted flex items-center gap-1 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-pl-accent shrink-0" />
                  <span className="truncate">{property.location}</span>
                </div>
                <div className="text-lg font-bold text-pl-text">
                  TSh {formatPrice(property.price)}
                  <span className="text-xs font-normal text-pl-muted ml-1">
                    {property.priceUnit === 'month' ? '/ mo' : ''}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-pl-line flex items-center justify-between">
                <span className="text-xs font-semibold text-pl-muted capitalize">
                  {t(`hero.filter.${property.type === 'house' ? 'houses' : property.type === 'plot' ? 'plots' : 'offices'}`)} • {t(`hero.filter.${property.purpose === 'rent' ? 'rent' : 'buy'}`)}
                </span>
                <Link
                  to={`/properties/${property.id}`}
                  className="px-3 py-1.5 bg-pl-bg text-pl-text border border-pl-line hover:bg-pl-line rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> {t('common.view')}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
