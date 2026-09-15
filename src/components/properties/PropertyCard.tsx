import { Link } from 'react-router-dom'
import { MapPin, ArrowRight } from 'lucide-react'
import { PropertyStatusBadge, formatPrice } from '../shared/Bits'
import type { Property } from '@/types'
import { cn } from '@/lib/utils'

interface PropertyCardProps {
  property: Property
  /** When true, renders a larger featured layout (2-col span in the editorial grid) */
  featured?: boolean
}

export function PropertyCard({ property, featured = false }: PropertyCardProps) {
  return (
    <Link
      to={`/properties/${property.id}`}
      className={cn(
        // Base: hairline border only at rest — shadow on hover via card-hover utility
        'card-hover group block bg-white overflow-hidden border border-pl-line rounded-lg',
        property.sponsored && 'border-t-2 border-t-pl-accent',
        featured && 'flex flex-col'
      )}
    >
      {/* Image */}
      <div className={cn('bg-zinc-100 relative overflow-hidden', featured ? 'aspect-[16/10]' : 'aspect-[4/3]')}>
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
        />
        <div className="absolute top-3 left-3">
          <PropertyStatusBadge status={property.status} />
        </div>
        {property.sponsored && (
          <div className="absolute top-3 right-3 bg-pl-ink text-white text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-wider uppercase">
            Featured
          </div>
        )}
        {/* Property type pill — bottom of image */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-pl-ink text-[11px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
          {property.type}
          {property.bedrooms ? ` · ${property.bedrooms} bed` : ''}
        </div>
      </div>

      {/* Info */}
      <div className={cn('p-4 flex flex-col', featured && 'flex-1')}>
        <div className="text-2xl font-bold font-heading text-pl-ink tracking-tight mb-0.5">
          TSh {formatPrice(property.price)}
          <span className="text-sm font-normal text-pl-muted ml-1">
            {property.priceUnit === 'month' ? '/ mo' : ''}
          </span>
        </div>

        <h3 className={cn('font-heading font-semibold text-pl-ink/90 leading-snug truncate mb-2', featured ? 'text-xl' : 'text-base')}>
          {property.title}
        </h3>

        <div className="flex items-center text-sm text-pl-muted mb-4 truncate">
          <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" />
          {property.location}
        </div>

        <div className={cn('flex items-center justify-between pt-3 border-t border-pl-line', featured && 'mt-auto')}>
          <div className="flex gap-1.5">
            {property.amenities.slice(0, 2).map(a => (
              <span key={a} className="text-[10px] font-semibold px-1.5 py-0.5 bg-pl-surface text-pl-muted rounded-sm">
                {a}
              </span>
            ))}
          </div>
          <div className="flex items-center text-pl-accent text-xs font-bold group-hover:translate-x-0.5 transition-transform">
            View <ArrowRight className="w-3 h-3 ml-0.5" />
          </div>
        </div>
      </div>
    </Link>
  )
}
