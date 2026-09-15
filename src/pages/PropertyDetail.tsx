import { useParams, Link } from 'react-router-dom'
import { MapPin, Shield, ArrowLeft } from 'lucide-react'
import { PrimaryButton, GhostButton, PropertyStatusBadge, formatPrice } from '../components/shared/Bits'
import { PropertyImage } from '../components/shared/PropertyImage'
import { properties } from '../data/mockData'

export function PropertyDetail() {
  const { id } = useParams()
  const property = properties.find(p => p.id === id) || properties[0]

  return (
    <div className="grain-texture bg-pl-surface min-h-screen pb-20">
      {/* Top Nav / Breadcrumbs */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <Link to="/properties" className="inline-flex items-center text-sm font-medium text-pl-muted hover:text-pl-ink transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Search
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-6">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT PANEL: Gallery (~60%) */}
          <div className="w-full lg:w-3/5 space-y-4">
            <div className="aspect-[4/3] bg-zinc-200 rounded-2xl overflow-hidden relative">
              <PropertyImage property={property} className="w-full h-full object-cover" alt={`Main photo of ${property.title}`} />
              <div className="absolute top-4 left-4">
                <PropertyStatusBadge status={property.status} />
              </div>
            </div>
            
            {property.galleryUrls && property.galleryUrls.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {property.galleryUrls.map((url, i) => (
                  <div key={i} className="aspect-[4/3] bg-zinc-200 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                    <PropertyImage property={{ ...property, imageUrl: url }} className="w-full h-full object-cover" alt={`Gallery photo ${i + 1} of ${property.title}`} />
                  </div>
                ))}
              </div>
            )}

            {/* Description & Details (Below Gallery on Mobile, Part of Left Scroll on Desktop) */}
            <div className="bg-white p-8 rounded-2xl shadow-sm mt-8">
              <h2 className="text-2xl font-bold mb-4">About this property</h2>
              <p className="text-pl-muted leading-relaxed whitespace-pre-line">
                {property.description}
              </p>

              <h3 className="text-lg font-bold mt-8 mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
                {property.amenities.map(amenity => (
                  <div key={amenity} className="flex items-center gap-2 text-sm font-medium text-pl-ink">
                    <div className="w-8 h-8 rounded-full bg-pl-surface flex items-center justify-center shrink-0">
                      <Shield className="w-4 h-4 text-pl-muted" />
                    </div>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Details & Actions (~40%, Sticky) */}
          <div className="w-full lg:w-2/5 sticky top-36">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-pl-line">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-pl-ink leading-tight mb-2">
                  {property.title}
                </h1>
                <div className="flex items-center text-pl-muted font-medium mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  {property.location}
                </div>
                <div className="text-4xl font-bold tracking-tight text-pl-ink">
                  TSh {formatPrice(property.price)}
                  <span className="text-lg font-normal text-pl-muted ml-1">
                    {property.priceUnit === 'month' ? '/ mo' : ''}
                  </span>
                </div>
              </div>

              <div className="w-full h-px bg-pl-line my-6" />

              {/* Agent Card */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-zinc-200 overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt={property.agent.name} />
                </div>
                <div>
                  <div className="font-bold text-pl-ink">{property.agent.name}</div>
                  <div className="text-sm text-pl-muted">Property Owner • ⭐ {property.agent.rating}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <PrimaryButton className="w-full h-14 text-lg">
                  Request Site Visit
                </PrimaryButton>
                <div className="flex gap-3">
                  <GhostButton className="flex-1 h-12">
                    Pay / Confirm
                  </GhostButton>
                  <GhostButton 
                    className="w-12 h-12 p-0 flex items-center justify-center border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                    onClick={() => {
                      const msg = encodeURIComponent(`Hi, I'm interested in ${property.title} on Proland — is it still available?`)
                      window.open(`https://wa.me/${property.agent.phone}?text=${msg}`, '_blank')
                    }}
                  >
                    {/* SVG WhatsApp Icon */}
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.662-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                    </svg>
                  </GhostButton>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
