import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Search, MapPin } from 'lucide-react'
import { PrimaryButton } from '../shared/Bits'
import { RotatingWord } from '../shared/RotatingWord'
import { useTypewriterPlaceholder } from '@/hooks/useTypewriterPlaceholder'

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

  return (
    <section className="grain relative w-full min-h-[90vh] flex items-center overflow-hidden bg-pl-ink">

      {/* Subtle architectural grid lines — background texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(var(--pl-white) 1px, transparent 1px), linear-gradient(90deg, var(--pl-white) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-24 lg:py-32">
        <div className="max-w-5xl">

          {/* Headline — viewport-scaled, left-aligned, deliberately oversized */}
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
          <div className="w-full max-w-2xl bg-white p-1.5 rounded-lg flex flex-col sm:flex-row items-stretch gap-1.5 mb-8">
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
            <button
              onClick={() => navigate('/properties?purpose=rent')}
              className="px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition-colors border-white/20 text-white/70 hover:bg-white/10"
            >
              Rent
            </button>
            <button
              onClick={() => navigate('/properties?purpose=buy')}
              className="px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition-colors border-white/20 text-white/70 hover:bg-white/10"
            >
              Buy
            </button>
            <div className="w-px h-4 bg-white/20 mx-1" />
            {['house', 'plot', 'office'].map(t => (
              <button
                key={t}
                onClick={() => navigate(`/properties?type=${t}`)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition-colors border-white/20 text-white/70 hover:bg-white/10 capitalize"
              >
                {t === 'house' ? 'Houses' : t === 'plot' ? 'Plots' : 'Offices'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade to white for seamless transition */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  )
}
