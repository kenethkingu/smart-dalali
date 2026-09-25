import { useState, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, ArrowLeft, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PrimaryButton, GhostButton, PropertyStatusBadge, formatPrice, AmenityIcon } from '../components/shared/Bits'
import { PropertyImage } from '../components/shared/PropertyImage'
import { PropertyLightbox, type LightboxImage } from '../components/shared/PropertyLightbox'
import { GradientThumb } from '../components/shared/GradientThumb'
import { properties, buildings } from '../data/mockData'
import { useAuth } from '@/lib/auth'
import { LoginModal } from '@/components/auth/LoginModal'
import { ConfirmPaymentDialog } from '@/components/buyer/ConfirmPaymentDialog'
import { RequestVisitDialog } from '@/components/buyer/RequestVisitDialog'

export function PropertyDetail() {
  const { id } = useParams()
  const { t } = useTranslation()
  const property = properties.find(p => p.id === id) || properties[0]
  const building = property.buildingId ? buildings.find(b => b.id === property.buildingId) : undefined
  const { user } = useAuth()
  
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<'visit' | 'pay' | null>(null)
  
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [isPayModalOpen, setIsPayModalOpen] = useState(false)

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const lightboxReturnRef = useRef<HTMLElement | null>(null)
  const mainImageBtnRef = useRef<HTMLButtonElement>(null)

  const lightboxImages: LightboxImage[] = [
    {
      src: property.imageUrl ?? '',
      alt: `${property.title} — ${property.location}`,
      fallback: <GradientThumb tone={property.tone} className="w-full h-full" alt={`${property.title} — ${property.location}`} />,
    },
    ...(property.galleryUrls ?? []).map((url, i) => ({
      src: url,
      alt: `${property.title} — ${property.location}, photo ${i + 2}`,
      fallback: <GradientThumb tone={property.tone} className="w-full h-full" alt={`${property.title} — ${property.location}, photo ${i + 2}`} />,
    })),
  ]

  const openLightbox = useCallback((index: number, triggerEl?: HTMLElement | null) => {
    setLightboxIndex(index)
    if (triggerEl) lightboxReturnRef.current = triggerEl
    setLightboxOpen(true)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
  }, [])

  const isOwnListing = user?.id === property.ownerId

  const handleRequestVisitClick = () => {
    if (!user) {
      setPendingAction('visit')
      setLoginModalOpen(true)
      return
    }
    setIsRequestModalOpen(true)
  }

  const handlePayConfirmClick = () => {
    if (!user) {
      setPendingAction('pay')
      setLoginModalOpen(true)
      return
    }
    setIsPayModalOpen(true)
  }

  const handleLoginSuccess = () => {
    setLoginModalOpen(false)
    if (pendingAction === 'visit') {
      setIsRequestModalOpen(true)
    } else if (pendingAction === 'pay') {
      setIsPayModalOpen(true)
    }
    setPendingAction(null)
  }

  return (
    <div className="grain-texture bg-pl-bg text-pl-text min-h-screen pb-20">
      {/* Top Nav / Breadcrumbs */}
      <div className="bg-pl-surface border-b border-pl-line sticky top-16 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <Link to="/properties" className="inline-flex items-center text-sm font-medium text-pl-muted hover:text-pl-text transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1 text-pl-accent" /> {t('property_detail.back_to_properties')}
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-6">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT PANEL: Gallery (~60%) */}
          <div className="w-full lg:w-3/5 space-y-4">
            {/* Main image */}
            <button
              ref={mainImageBtnRef}
              type="button"
              className="w-full aspect-[4/3] bg-pl-surface border border-pl-line rounded-2xl overflow-hidden relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pl-accent focus-visible:ring-offset-2 cursor-zoom-in shadow-md"
              aria-label={`View all photos of ${property.title} in full screen`}
              onClick={() => openLightbox(0, mainImageBtnRef.current)}
            >
              <PropertyImage
                property={property}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                alt={`${property.title} — ${property.location}`}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-end justify-end p-4">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/70 text-white text-xs font-semibold px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  {t('property_detail.view_photos', { count: lightboxImages.length })}
                </span>
              </div>
              <div className="absolute top-4 left-4 flex flex-col items-start gap-2">
                <PropertyStatusBadge status={property.status} />
                {property.titleVerified && (
                  <div className="bg-pl-accent text-pl-white text-xs font-bold px-3 py-1 rounded-md tracking-wider uppercase flex items-center gap-1.5 shadow-md">
                    <span className="w-2.5 h-2.5 rounded-full bg-pl-white block" /> {t('status.title_verified')}
                  </div>
                )}
              </div>
              {lightboxImages.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-semibold px-2.5 py-1 rounded-md backdrop-blur-sm pointer-events-none">
                  {t('property_detail.photo_count', { current: 1, total: lightboxImages.length })}
                </div>
              )}
            </button>
            
            {/* Thumbnail strip */}
            {property.galleryUrls && property.galleryUrls.length > 0 && (
              <div className="grid grid-cols-4 gap-4" role="list">
                {property.galleryUrls.map((url, i) => {
                  const lightboxIdx = i + 1
                  return (
                    <button
                      key={i}
                      type="button"
                      role="listitem"
                      className="aspect-[4/3] bg-pl-surface border border-pl-line rounded-xl overflow-hidden cursor-zoom-in group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pl-accent"
                      onClick={(e) => openLightbox(lightboxIdx, e.currentTarget)}
                    >
                      <PropertyImage
                        property={{ ...property, imageUrl: url }}
                        className="w-full h-full object-cover transition-all duration-200 group-hover:scale-105"
                        alt={`${property.title} — photo ${lightboxIdx + 1}`}
                      />
                    </button>
                  )
                })}
              </div>
            )}

            {/* Description & Details */}
            <div className="bg-pl-surface border border-pl-line p-8 rounded-2xl shadow-md mt-8 text-pl-text">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-pl-text">{t('property_detail.about_property')}</h2>
                <Link
                  to={`/properties/${property.id}/history`}
                  className="text-sm font-semibold text-pl-accent hover:underline flex items-center gap-1"
                >
                  {t('history.title')} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="flex flex-wrap gap-8 mb-6 pb-6 border-b border-pl-line">
                <div className="flex flex-col">
                  <span className="text-[11px] text-pl-muted uppercase tracking-wider font-bold mb-1">{t('properties.property_type')}</span>
                  <span className="font-semibold text-pl-text capitalize">{t(`hero.filter.${property.type === 'house' ? 'houses' : property.type === 'plot' ? 'plots' : 'offices'}`)}</span>
                </div>
                {property.bedrooms && (
                  <div className="flex flex-col">
                    <span className="text-[11px] text-pl-muted uppercase tracking-wider font-bold mb-1">{t('properties.bedrooms')}</span>
                    <span className="font-semibold text-pl-text">{property.bedrooms}</span>
                  </div>
                )}
                {property.areaSqm && (
                  <div className="flex flex-col">
                    <span className="text-[11px] text-pl-muted uppercase tracking-wider font-bold mb-1">{t('properties.location')}</span>
                    <span className="font-semibold text-pl-text">{property.areaSqm} sqm</span>
                  </div>
                )}
                {property.titleType && (
                  <div className="flex flex-col">
                    <span className="text-[11px] text-pl-muted uppercase tracking-wider font-bold mb-1">Title</span>
                    <span className="font-semibold text-pl-text">{property.titleType}</span>
                  </div>
                )}
              </div>

              <p className="text-pl-muted leading-relaxed whitespace-pre-line text-sm">
                {property.description}
              </p>

              <h3 className="text-lg font-bold mt-8 mb-4 text-pl-text">{t('property_detail.amenities_heading')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
                {property.amenities.map(amenity => (
                  <div key={amenity} className="flex items-center gap-2 text-sm font-medium text-pl-text">
                    <div className="w-8 h-8 rounded-full bg-pl-bg border border-pl-line flex items-center justify-center shrink-0">
                      <AmenityIcon amenity={amenity} className="w-4 h-4 text-pl-accent" />
                    </div>
                    {t(`properties.amenities_list.${amenity}`, amenity)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Details & Actions */}
          <div className="w-full lg:w-2/5 sticky top-36">
            <div className="bg-pl-surface p-6 md:p-8 rounded-2xl shadow-xl border border-pl-line text-pl-text">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-pl-text leading-tight mb-2">
                  {property.title}
                </h1>
                <div className="flex items-center text-pl-muted font-medium mb-2 text-sm">
                  <MapPin className="w-4 h-4 mr-1 shrink-0 text-pl-accent" />
                  {property.location}
                </div>
                {building && (
                  <div className="text-xs font-semibold text-pl-accent bg-pl-accent/10 px-2.5 py-1 rounded-md inline-flex items-center gap-1.5 mb-4 w-fit border border-pl-accent/20">
                    Unit {property.unitNumber ? `${property.unitNumber} in ` : ''}{building.name}
                  </div>
                )}
                <div className="text-3xl sm:text-4xl font-bold tracking-tight text-pl-text">
                  TSh {formatPrice(property.price)}
                  <span className="text-lg font-normal text-pl-muted ml-1">
                    {property.priceUnit === 'month' ? '/ mo' : ''}
                  </span>
                </div>
              </div>

              <div className="w-full h-px bg-pl-line my-6" />

              {/* Agent/Owner Card */}
              <div className="flex items-center gap-4 mb-8 p-3 bg-pl-bg rounded-xl border border-pl-line">
                <div className="w-12 h-12 rounded-full bg-pl-surface overflow-hidden shrink-0 border border-pl-line">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt={property.agent.name} />
                </div>
                <div>
                  <div className="font-bold text-pl-text">{property.agent.name}</div>
                  <div className="text-xs text-pl-muted">{t('property_detail.verified_owner')} • ⭐ {property.agent.rating}</div>
                </div>
              </div>

              {/* Actions */}
              {!isOwnListing ? (
                <div className="space-y-3">
                  <PrimaryButton className="w-full h-14 text-base sm:text-lg" onClick={handleRequestVisitClick}>
                    {t('property_detail.request_visit')}
                  </PrimaryButton>
                  <div className="flex gap-3">
                    <ConfirmPaymentDialog 
                      open={isPayModalOpen}
                      onOpenChange={setIsPayModalOpen}
                      onConfirm={() => setIsPayModalOpen(false)}
                    >
                      <GhostButton 
                        className="flex-1 h-12 text-sm font-semibold border-pl-line text-pl-text"
                        onClick={(e) => {
                          e.preventDefault()
                          handlePayConfirmClick()
                        }}
                      >
                        {t('property_detail.pay_confirm')}
                      </GhostButton>
                    </ConfirmPaymentDialog>
                    <GhostButton 
                      className="w-12 h-12 p-0 flex items-center justify-center border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
                      onClick={() => {
                        const msg = encodeURIComponent(`Habari, nina nia na ${property.title} kwenye Proland — je bado inapatikana?`)
                        window.open(`https://wa.me/${property.agent.phone}?text=${msg}`, '_blank')
                      }}
                      title={t('property_detail.whatsapp_chat')}
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.662-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                      </svg>
                    </GhostButton>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link to={`/owner/properties/${property.id}/edit`}>
                    <GhostButton className="w-full h-14 text-lg border-pl-line text-pl-text font-semibold">
                      {t('common.edit')} {t('nav.properties')}
                    </GhostButton>
                  </Link>
                  <Link to="/owner/requests">
                    <GhostButton className="w-full h-14 text-lg border-pl-line text-pl-text font-semibold">
                      {t('owner_dashboard.stat_requests')}
                    </GhostButton>
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      
      <RequestVisitDialog 
        property={property} 
        open={isRequestModalOpen}
        onOpenChange={setIsRequestModalOpen}
      />
      
      <LoginModal 
        isOpen={loginModalOpen} 
        onOpenChange={setLoginModalOpen} 
        onSuccess={handleLoginSuccess}
        contextProperty={property.title}
      />

      <PropertyLightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        returnFocusRef={lightboxReturnRef as React.RefObject<HTMLElement>}
      />
    </div>
  )
}
