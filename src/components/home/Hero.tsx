import { Search, MapPin } from 'lucide-react'
import { PrimaryButton, Pill } from '../shared/Bits'

export function Hero() {
  return (
    <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden bg-pl-surface">
      {/* Background element */}
      <div className="absolute inset-0 bg-gradient-to-br from-pl-surface to-pl-line/30" />
      
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-pl-ink max-w-4xl tracking-tight mb-8">
          Find the Home or Plot You Want — Book a Visit, Pay Securely.
        </h1>
        
        {/* Search Bar (Zillow pattern) */}
        <div className="w-full max-w-3xl bg-white p-2 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center gap-2">
          <div className="flex-1 flex items-center gap-2 px-4 py-3 w-full border-b sm:border-b-0 sm:border-r border-pl-line">
            <MapPin className="text-pl-muted w-5 h-5 shrink-0" />
            <input 
              type="text" 
              placeholder="Enter location, neighborhood, or city" 
              className="w-full bg-transparent outline-none text-pl-ink placeholder:text-pl-muted font-medium"
            />
          </div>
          
          <PrimaryButton className="w-full sm:w-auto px-8 py-4 rounded-xl text-lg shrink-0">
            <Search className="w-5 h-5 mr-1" /> Search
          </PrimaryButton>
        </div>
        
        {/* Quick filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <span className="text-sm font-medium text-pl-muted mr-2">Quick Search:</span>
          <Pill active>Rent</Pill>
          <Pill>Buy</Pill>
          <div className="w-px h-4 bg-pl-line mx-1" />
          <Pill>Houses</Pill>
          <Pill>Plots</Pill>
          <Pill>Offices</Pill>
        </div>
      </div>
    </section>
  )
}
