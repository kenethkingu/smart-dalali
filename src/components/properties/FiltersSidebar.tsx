import { Checkbox } from '@/components/ui/checkbox'
import { PriceRangeFilter } from './PriceRangeFilter'
import { Pill } from '../shared/Bits'
import { useFilterState } from '@/lib/useFilterState'
import { properties } from '@/data/mockData'
import type { PropertyType } from '@/types'

export function FiltersSidebar() {
  const { filters, setFilter } = useFilterState()

  // Calculate live counts based on mockData
  // For each filter option, we pretend all other active filters are applied EXCEPT the one we're evaluating.
  const getCount = (key: string, val: any) => {
    return properties.filter(p => {
      // Very basic filtering logic for mock live counts
      if (key === 'purpose' && p.purpose !== val) return false
      if (key === 'type' && p.type !== val) return false
      if (key === 'bedrooms' && val !== 'any' && (p.bedrooms || 0) < parseInt(val)) return false
      if (key === 'amenities' && !p.amenities.includes(val)) return false
      return true
    }).length
  }

  const handleTypeToggle = (t: PropertyType) => {
    if (filters.type.includes(t)) {
      setFilter('type', filters.type.filter(v => v !== t))
    } else {
      setFilter('type', [...filters.type, t])
    }
  }

  const handleAmenityToggle = (a: string) => {
    if (filters.amenities.includes(a)) {
      setFilter('amenities', filters.amenities.filter(v => v !== a))
    } else {
      setFilter('amenities', [...filters.amenities, a])
    }
  }

  return (
    <aside className="w-72 shrink-0 hidden lg:block sticky top-24 self-start h-[calc(100vh-6rem)] overflow-y-auto pr-4 scrollbar-hide">
      <div className="space-y-8 pb-10">
        
        {/* Purpose */}
        <div>
          <h3 className="font-bold text-pl-ink mb-3">Purpose</h3>
          <div className="flex bg-pl-surface p-1 rounded-xl">
            <button 
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${filters.purpose === 'rent' ? 'bg-white shadow-sm text-pl-ink' : 'text-pl-muted hover:text-pl-ink'}`}
              onClick={() => setFilter('purpose', 'rent')}
            >
              Rent
            </button>
            <button 
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${filters.purpose === 'buy' ? 'bg-white shadow-sm text-pl-ink' : 'text-pl-muted hover:text-pl-ink'}`}
              onClick={() => setFilter('purpose', 'buy')}
            >
              Buy
            </button>
          </div>
        </div>

        {/* Property Type */}
        <div>
          <h3 className="font-bold text-pl-ink mb-3">Property Type</h3>
          <div className="flex flex-wrap gap-2">
            {(['house', 'plot', 'office'] as PropertyType[]).map(t => (
              <Pill 
                key={t} 
                active={filters.type.includes(t)}
                onClick={() => handleTypeToggle(t)}
                className="capitalize"
              >
                {t} <span className="opacity-60 text-[10px] ml-1">({getCount('type', t)})</span>
              </Pill>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="font-bold text-pl-ink mb-3">Price Range</h3>
          <PriceRangeFilter 
            minPrice={filters.minPrice} 
            maxPrice={filters.maxPrice} 
            onChange={(min, max) => {
              setFilter('minPrice', min)
              setFilter('maxPrice', max)
            }}
          />
        </div>

        {/* Bedrooms */}
        <div className={filters.type.includes('plot') && filters.type.length === 1 ? 'opacity-50 pointer-events-none' : ''}>
          <h3 className="font-bold text-pl-ink mb-3">Bedrooms</h3>
          <div className="flex flex-wrap gap-2">
            {['any', '1', '2', '3', '4'].map(b => (
              <Pill 
                key={b} 
                active={filters.bedrooms === b || (b === 'any' && !filters.bedrooms)}
                onClick={() => setFilter('bedrooms', b === 'any' ? null : b)}
              >
                {b === 'any' ? 'Any' : `${b}+`}
                {b !== 'any' && <span className="opacity-60 text-[10px] ml-1">({getCount('bedrooms', b)})</span>}
              </Pill>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h3 className="font-bold text-pl-ink mb-3">Amenities</h3>
          <div className="space-y-3">
            {['WiFi', 'Parking', '24/7 Security', 'Reliable Water', 'Elevator', 'Generator Backup'].map(a => (
              <label key={a} className="flex items-center gap-3 cursor-pointer group">
                <Checkbox 
                  checked={filters.amenities.includes(a)}
                  onCheckedChange={() => handleAmenityToggle(a)}
                  className="data-[state=checked]:bg-pl-accent data-[state=checked]:border-pl-accent"
                />
                <span className="text-sm font-medium text-pl-ink group-hover:text-pl-accent transition-colors">
                  {a} <span className="text-pl-muted font-normal text-xs ml-1">({getCount('amenities', a)})</span>
                </span>
              </label>
            ))}
            <button className="text-sm font-bold text-pl-accent hover:text-pl-accent-dark pt-1 transition-colors">
              Show more
            </button>
          </div>
        </div>

      </div>
    </aside>
  )
}
