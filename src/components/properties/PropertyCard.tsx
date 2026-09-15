import { Link } from 'react-router-dom'
import { MapPin, ArrowRight } from 'lucide-react'
import { PropertyStatusBadge, formatPrice } from '../shared/Bits'
import type { Property } from '@/types'
import { cn } from '@/lib/utils'

export function PropertyCard({ property }: { property: Property }) {
  // We'll simulate the 3D tilt with a simple hover scale for now
  return (
    <Link 
      to={`/properties/${property.id}`}
      className={cn(
        "group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-pl-line",
        property.sponsored && "ring-1 ring-pl-accent relative before:absolute before:inset-0 before:rounded-2xl before:border before:border-pl-accent/50 before:animate-[pulse_4s_ease-in-out_infinite]"
      )}
    >
      <div className="aspect-[4/3] bg-zinc-200 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80" 
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
        />
        <div className="absolute top-3 left-3">
          <PropertyStatusBadge status={property.status} />
        </div>
        {property.sponsored && (
          <div className="absolute top-3 right-3 bg-pl-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            Featured
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="text-xl font-bold text-pl-ink mb-1 truncate">
          TSh {formatPrice(property.price)}
          <span className="text-sm font-normal text-pl-muted ml-1">
            {property.priceUnit === 'month' ? '/ mo' : ''}
          </span>
        </div>
        
        <h3 className="font-heading font-semibold text-pl-ink/90 text-lg leading-tight truncate mb-2">
          {property.title}
        </h3>
        
        <div className="flex items-center text-sm font-medium text-pl-muted mb-4 truncate">
          <MapPin className="w-4 h-4 mr-1 shrink-0" />
          {property.location}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-pl-line">
          <div className="text-sm font-medium text-pl-ink">{property.type === 'house' ? 'House' : property.type === 'plot' ? 'Plot' : 'Office'}</div>
          <div className="flex items-center text-pl-accent text-sm font-bold group-hover:translate-x-1 transition-transform">
            View Details <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </div>
    </Link>
  )
}
