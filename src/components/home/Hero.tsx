import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { Search, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { PrimaryButton, PropertyStatusBadge, formatPrice } from '../shared/Bits'
import { RotatingWord } from '../shared/RotatingWord'
import { useTypewriterPlaceholder } from '@/hooks/useTypewriterPlaceholder'
import { PropertyImage } from '../shared/PropertyImage'

import { publicProperties } from '@/data/mockData'
import type { Property } from '@/types'

function MiniPropertyCard({ 
  property, 
  className,
  entranceDelay,
  floatDelay 
}: { 
  property: Property
  className?: string
  entranceDelay: number
  floatDelay: number
}) {
  const { t } = useTranslation()
  return (
    <motion.div
      className={`absolute bg-pl-surface dark:bg-pl-surface rounded-xl overflow-hidden shadow-2xl p-2 w-56 sm:w-64 z-10 border border-pl-line ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: entranceDelay, ease: "easeOut" }}
    >
      <motion.div 
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: floatDelay }}
      >
        <Link to={`/properties/${property.id}`} className="block group">
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3 bg-pl-bg">
            <div className="w-full h-full group-hover:scale-[1.03] transition-transform duration-500 ease-out">
              <PropertyImage property={property} className="w-full h-full object-cover" alt={property.title} />
            </div>
            <div className="absolute top-2 left-2 scale-90 origin-top-left">
              <PropertyStatusBadge status={property.status} />
            </div>
            {property.sponsored && (
              <div className="absolute top-2 right-2 bg-pl-accent text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm tracking-wider uppercase">
                {t('status.verified')}
              </div>
            )}
          </div>
          <div className="px-1 pb-1">
            <div className="font-heading font-bold text-pl-text tracking-tight mb-0.5">
              TSh {formatPrice(property.price)}
              {property.priceUnit === 'month' && <span className="text-[10px] font-normal text-pl-muted ml-1">{t('common.per_month')}</span>}
            </div>
            <div className="text-xs font-semibold text-pl-text/90 truncate">{property.title}</div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  )
}

export function Hero() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  const [location, setLocation] = useState('')

  const isSwahili = (i18n.resolvedLanguage ?? i18n.language) === 'sw'

  const fullHeadlines = isSwahili
    ? [
        t('hero.headline.house'),
        t('hero.headline.plot'),
        t('hero.headline.office'),
      ]
    : [
        t('hero.headline.house'),
        t('hero.headline.plot'),
        t('hero.headline.office'),
      ]

  const searchExamples = isSwahili
    ? [
        "Jaribu 'Nyumba vyumba 3 Masaki'...",
        "Jaribu 'Kiwanja Kigamboni'...",
        "Jaribu 'Apartment Mikocheni'...",
        "Jaribu 'Sinza Mori'...",
        "Jaribu 'Ofisi Oysterbay'...",
      ]
    : [
        "Try '3-bedroom house Masaki'...",
        "Try 'Plot in Kigamboni'...",
        "Try 'Apartment in Mikocheni'...",
        "Try 'Sinza Mori'...",
        "Try 'Office space Oysterbay'...",
      ]

  const placeholderText = useTypewriterPlaceholder({
    phrases: searchExamples,
    isDisabled: location.length > 0
  })

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    navigate(`/properties?${params.toString()}`)
  }

  const featuredCards = publicProperties.filter(p => p.sponsored).slice(0, 3)

  return (
    <section className="grain-texture relative w-full min-h-[90vh] flex items-center overflow-hidden bg-pl-ink text-white">
      {/* Subtle architectural grid lines */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(var(--pl-white) 1px, transparent 1px), linear-gradient(90deg, var(--pl-white) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Content */}
          <div className="max-w-xl">
            <h1
              className="text-display font-heading font-bold text-white mb-6 tracking-[-0.02em] leading-[1.05]"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.75rem)' }}
            >
              <RotatingWord words={fullHeadlines} className="text-white block min-h-[1.2em]" />
              <span className="block text-pl-accent mt-2 font-semibold" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}>
                {t('hero.subheadline')}
              </span>
            </h1>

            <p className="text-white/80 text-base sm:text-lg mb-8 max-w-xl leading-relaxed">
              {t('hero.body')}
            </p>

            {/* Search bar */}
            <div className="w-full bg-pl-bg dark:bg-pl-surface p-1.5 rounded-lg flex flex-col sm:flex-row items-stretch gap-1.5 mb-8 border border-pl-line shadow-xl">
              <div className="flex flex-1 items-center gap-2 px-4 py-3">
                <MapPin className="text-pl-muted w-4 h-4 shrink-0" />
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder={placeholderText}
                  className="w-full bg-transparent outline-none text-pl-ink dark:text-pl-white placeholder:text-pl-muted text-sm font-medium"
                />
              </div>
              <PrimaryButton
                onClick={handleSearch}
                className="rounded-md px-6 py-3 text-sm shrink-0"
              >
                <Search className="w-4 h-4" /> {t('hero.search_button')}
              </PrimaryButton>
            </div>

            {/* Quick-filter pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-white/50 uppercase tracking-widest mr-1">
                {t('common.filter')}
              </span>
              <button
                onClick={() => navigate('/properties?purpose=rent')}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition-colors border-white/20 text-white/80 hover:bg-white/10"
              >
                {t('hero.filter.rent')}
              </button>
              <button
                onClick={() => navigate('/properties?purpose=buy')}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition-colors border-white/20 text-white/80 hover:bg-white/10"
              >
                {t('hero.filter.buy')}
              </button>
              <div className="w-px h-4 bg-white/20 mx-1" />
              <button
                onClick={() => navigate('/properties?type=house')}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition-colors border-white/20 text-white/80 hover:bg-white/10"
              >
                {t('hero.filter.houses')}
              </button>
              <button
                onClick={() => navigate('/properties?type=plot')}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition-colors border-white/20 text-white/80 hover:bg-white/10"
              >
                {t('hero.filter.plots')}
              </button>
              <button
                onClick={() => navigate('/properties?type=office')}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition-colors border-white/20 text-white/80 hover:bg-white/10"
              >
                {t('hero.filter.offices')}
              </button>
            </div>
          </div>

          {/* Right Column: Line Art & Floating Cards */}
          <div className="hidden lg:block relative h-[500px] w-full">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <motion.svg 
                viewBox="0 0 200 140" 
                className="w-full h-full max-w-[400px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.path 
                  d="M100 10 L180 100 L20 100 Z" 
                  fill="none" 
                  stroke="var(--pl-white)" 
                  strokeWidth="2" 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                <motion.rect 
                  x="78" y="78" width="44" height="22" 
                  fill="var(--pl-ink)"
                />
              </motion.svg>
            </div>

            {featuredCards.length >= 2 && (
              <>
                {featuredCards[2] && (
                  <MiniPropertyCard 
                    property={featuredCards[2]} 
                    className="top-8 right-24 rotate-3 z-0 scale-90 opacity-90"
                    entranceDelay={1.8}
                    floatDelay={1}
                  />
                )}
                <MiniPropertyCard 
                  property={featuredCards[0]} 
                  className="top-28 -right-4 -rotate-2"
                  entranceDelay={1.5}
                  floatDelay={0}
                />
                <MiniPropertyCard 
                  property={featuredCards[1]} 
                  className="bottom-16 left-12 rotate-1"
                  entranceDelay={1.65}
                  floatDelay={2}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
