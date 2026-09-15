import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { Search, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { PrimaryButton, PropertyStatusBadge, formatPrice } from '../shared/Bits'
import { RotatingWord } from '../shared/RotatingWord'
import { useTypewriterPlaceholder } from '@/hooks/useTypewriterPlaceholder'
import { PropertyImage } from '../shared/PropertyImage'
import { properties } from '@/data/mockData'
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
  return (
    <motion.div
      className={`absolute bg-white rounded-xl overflow-hidden shadow-2xl p-2 w-56 sm:w-64 z-10 ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: entranceDelay, ease: "easeOut" }}
    >
      <motion.div 
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: floatDelay }}
      >
        <Link to={`/properties/${property.id}`} className="block group">
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3 bg-zinc-100">
            <div className="w-full h-full group-hover:scale-[1.03] transition-transform duration-500 ease-out">
              <PropertyImage property={property} className="w-full h-full object-cover" alt={property.title} />
            </div>
            <div className="absolute top-2 left-2 scale-90 origin-top-left">
              <PropertyStatusBadge status={property.status} />
            </div>
            {property.sponsored && (
              <div className="absolute top-2 right-2 bg-pl-ink text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm tracking-wider uppercase">
                Featured
              </div>
            )}
          </div>
          <div className="px-1 pb-1">
            <div className="font-heading font-bold text-pl-ink tracking-tight mb-0.5">
              TSh {formatPrice(property.price)}
              {property.priceUnit === 'month' && <span className="text-[10px] font-normal text-pl-muted ml-1">/ mo</span>}
            </div>
            <div className="text-xs font-semibold text-pl-ink/90 truncate">{property.title}</div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  )
}

export function Hero() {
  const navigate = useNavigate()
  const [location, setLocation] = useState('')

  const placeholderText = useTypewriterPlaceholder({
    phrases: ["Try 'Masaki'…", "Try '3-bedroom house'…"],
    typingSpeed: 60,
    deletingSpeed: 30,
    pauseDuration: 1500,
  })

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    navigate(`/properties?${params.toString()}`)
  }

  // Get 2 featured/sponsored properties for the floating cards
  const featuredCards = properties.filter(p => p.sponsored).slice(0, 2)

  return (
    <section className="grain-texture relative w-full min-h-[90vh] flex items-center overflow-hidden bg-pl-ink">
      {/* Subtle architectural grid lines — background texture */}
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
              style={{ fontSize: 'clamp(2.75rem, 7vw, 5.5rem)' }}
            >
              Find the <RotatingWord words={['House', 'Plot', 'Office']} className="text-white" />
              <br />
              You Want.
              <span className="block text-pl-accent mt-1" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.75rem)' }}>
                Book a visit. Pay securely.
              </span>
            </h1>

            <p className="text-white/60 text-lg mb-10 max-w-xl leading-relaxed">
              Every listing on Proland is reviewed by our team before going public.
              No ghost properties, no payment before you've seen the place.
            </p>

            {/* Search bar */}
            <div className="w-full bg-white p-1.5 rounded-lg flex flex-col sm:flex-row items-stretch gap-1.5 mb-8">
              <div className="flex flex-1 items-center gap-2 px-4 py-3">
                <MapPin className="text-pl-muted w-4 h-4 shrink-0" />
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder={placeholderText}
                  className="w-full bg-transparent outline-none text-pl-ink placeholder:text-pl-muted text-sm font-medium"
                />
              </div>
              <PrimaryButton
                onClick={handleSearch}
                className="rounded-md px-6 py-3 text-sm shrink-0"
              >
                <Search className="w-4 h-4" /> Search
              </PrimaryButton>
            </div>

            {/* Quick-filter pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-white/40 uppercase tracking-widest mr-1">Filter</span>
              <button onClick={() => navigate('/properties?purpose=rent')} className="px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition-colors border-white/20 text-white/70 hover:bg-white/10">
                Rent
              </button>
              <button onClick={() => navigate('/properties?purpose=buy')} className="px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition-colors border-white/20 text-white/70 hover:bg-white/10">
                Buy
              </button>
              <div className="w-px h-4 bg-white/20 mx-1" />
              {['house', 'plot', 'office'].map(t => (
                <button key={t} onClick={() => navigate(`/properties?type=${t}`)} className="px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition-colors border-white/20 text-white/70 hover:bg-white/10 capitalize">
                  {t === 'house' ? 'Houses' : t === 'plot' ? 'Plots' : 'Offices'}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Line Art & Floating Cards */}
          <div className="hidden lg:block relative h-[500px] w-full">
            {/* Atmospheric SVG Line Art (Echoes Logo Geometry) */}
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
                  stroke="#FFFFFF" 
                  strokeWidth="2" 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                <motion.rect 
                  x="78" y="78" width="44" height="22" 
                  fill="#0B0B0C" // acts as the cutout for the "door" like the logo
                />
                <motion.rect 
                  x="50" y="112" width="100" height="18" rx="9" 
                  fill="none" 
                  stroke="#FFFFFF" 
                  strokeWidth="2" 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                />
              </motion.svg>
            </div>

            {/* Floating Mini Property Cards */}
            {featuredCards.length >= 2 && (
              <>
                <MiniPropertyCard 
                  property={featuredCards[0]} 
                  className="top-12 right-12 -rotate-2"
                  entranceDelay={1.5}
                  floatDelay={0}
                />
                <MiniPropertyCard 
                  property={featuredCards[1]} 
                  className="bottom-12 left-8 rotate-1"
                  entranceDelay={1.65}
                  floatDelay={2}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Clean black-to-white cut instead of a smeared gradient */}
    </section>
  )
}
