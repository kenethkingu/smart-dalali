import { Link } from 'react-router-dom'
import { MapPin, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PropertyStatusBadge, formatPrice, AmenityIcon } from '../shared/Bits'
import { CardContainer, CardBody, CardItem } from '../ui/3d-card'
import type { Property } from '@/types'
import { cn } from '@/lib/utils'
import { PropertyImage } from '../shared/PropertyImage'

interface PropertyCardProps {
  property: Property
  /** When true, renders a larger featured layout (2-col span in the editorial grid) */
  featured?: boolean
}

export function PropertyCard({ property, featured = false }: PropertyCardProps) {
  const { t } = useTranslation()

  return (
    <CardContainer containerClassName="w-full h-full p-0" isStatic={featured}>
      <CardBody className="w-full h-full">
        <Link
          to={`/properties/${property.id}`}
          className={cn(
            'card-hover group block bg-pl-surface text-pl-text overflow-hidden border border-pl-line rounded-lg w-full h-full',
            property.sponsored && 'border-t-2 border-t-pl-accent',
            featured && 'flex flex-col'
          )}
        >
          {/* Image */}
          <CardItem translateZ={20} className={cn('bg-pl-bg relative overflow-hidden w-full', featured ? 'aspect-[16/10]' : 'aspect-[4/3]')}>
            <div className="w-full h-full motion-safe:group-hover:scale-[1.03] transition-transform duration-500 ease-out">
              <PropertyImage property={property} className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-3 left-3 flex flex-col items-start gap-1">
              <PropertyStatusBadge status={property.status} />
              {property.titleVerified && (
                <div className="bg-pl-accent text-pl-white text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-wider uppercase flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-pl-white block" /> {t('status.title_verified')}
                </div>
              )}
            </div>
            {property.sponsored && (
              <div className="absolute top-3 right-3 bg-pl-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-wider uppercase">
                {t('status.verified')}
              </div>
            )}
            {/* Property type pill — bottom of image */}
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
              <div className="bg-pl-surface/90 backdrop-blur-sm text-pl-text text-[11px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider border border-pl-line">
                {t(`hero.filter.${property.type === 'house' ? 'houses' : property.type === 'plot' ? 'plots' : 'offices'}`)}
                {property.type === 'house' && property.bedrooms ? ` · ${property.bedrooms} bed` : ''}
                {property.areaSqm ? ` · ${property.areaSqm} sqm` : ''}
              </div>
              {property.titleType && (
                <div className="bg-pl-surface/90 backdrop-blur-sm text-pl-text text-[11px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider border border-pl-line">
                  {t('properties.amenities_list.Title Deed')}: {property.titleType}
                </div>
              )}
            </div>
          </CardItem>

          {/* Info */}
          <CardItem translateZ={30} className={cn('p-4 flex flex-col w-full', featured && 'flex-1')}>
            <div className="text-2xl font-bold font-heading text-pl-text tracking-tight mb-0.5">
              TSh {formatPrice(property.price)}
              <span className="text-sm font-normal text-pl-muted ml-1">
                {property.priceUnit === 'month' ? '/ mo' : ''}
              </span>
            </div>

            <h3 className={cn('font-heading font-semibold text-pl-text/90 leading-snug truncate mb-2', featured ? 'text-xl' : 'text-base')}>
              {property.title}
            </h3>

            <div className="flex items-center text-sm text-pl-muted mb-4 truncate">
              <MapPin className="w-3.5 h-3.5 mr-1 shrink-0 text-pl-accent" />
              {property.location}
            </div>

            <div className={cn('flex items-center justify-between pt-3 border-t border-pl-line', featured && 'mt-auto')}>
              <div className="flex gap-1.5 flex-wrap">
                {property.amenities.slice(0, 2).map(a => (
                  <span key={a} className="flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 bg-pl-bg text-pl-muted rounded-sm border border-pl-line">
                    <AmenityIcon amenity={a} className="w-3 h-3" />
                    {t(`properties.amenities_list.${a}`, a)}
                  </span>
                ))}
              </div>
              <div className="flex items-center text-pl-accent text-xs font-bold group-hover:translate-x-0.5 transition-transform">
                {t('common.view')} <ArrowRight className="w-3 h-3 ml-0.5" />
              </div>
            </div>
          </CardItem>
        </Link>
      </CardBody>
    </CardContainer>
  )
}
