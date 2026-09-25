import { Checkbox } from '@/components/ui/checkbox'
import { useTranslation } from 'react-i18next'
import { PriceRangeFilter } from './PriceRangeFilter'
import { Pill } from '../shared/Bits'
import { useFilterState } from '@/lib/useFilterState'
import { publicProperties } from '@/data/mockData'
import type { PropertyType } from '@/types'

export function FiltersSidebar() {
  const { filters, setFilter } = useFilterState()
  const { t } = useTranslation()

  const getCount = (key: string, val: any) => {
    return publicProperties.filter(p => {
      if (key === 'purpose' && p.purpose !== val) return false
      if (key === 'type' && p.type !== val) return false
      if (key === 'bedrooms' && val !== 'any' && (p.bedrooms || 0) < parseInt(val)) return false
      if (key === 'amenities' && !p.amenities.includes(val)) return false
      if (key === 'titleType' && p.titleType !== val) return false
      return true
    }).length
  }

  const handleTypeToggle = (tType: PropertyType) => {
    if (filters.type.includes(tType)) {
      setFilter('type', filters.type.filter(v => v !== tType))
    } else {
      setFilter('type', [...filters.type, tType])
    }
  }

  const handleAmenityToggle = (a: string) => {
    if (filters.amenities.includes(a)) {
      setFilter('amenities', filters.amenities.filter(v => v !== a))
    } else {
      setFilter('amenities', [...filters.amenities, a])
    }
  }

  const allAmenities = [
    'Electricity', 'Water Supply', 'Fenced Compound', 'Parking Space',
    '24/7 Security', 'Garden', 'Balcony', 'Title Deed', 'Paved Access Road',
    'Backup Generator', 'Furnished', 'Air Conditioning', 'High-speed Internet'
  ]

  return (
    <aside className="w-72 shrink-0 hidden lg:block sticky top-24 self-start h-[calc(100vh-6rem)] overflow-y-auto pr-4 scrollbar-hide text-pl-text">
      <div className="space-y-8 pb-10">
        
        {/* Purpose */}
        <div>
          <h3 className="font-bold text-pl-text mb-3">{t('properties.purpose')}</h3>
          <div className="flex bg-pl-surface p-1 rounded-xl border border-pl-line">
            <button 
              type="button"
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${filters.purpose === 'rent' ? 'bg-pl-bg shadow-sm text-pl-text border border-pl-line' : 'text-pl-muted hover:text-pl-text'}`}
              onClick={() => setFilter('purpose', 'rent')}
            >
              {t('hero.filter.rent')}
            </button>
            <button 
              type="button"
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${filters.purpose === 'buy' ? 'bg-pl-bg shadow-sm text-pl-text border border-pl-line' : 'text-pl-muted hover:text-pl-text'}`}
              onClick={() => setFilter('purpose', 'buy')}
            >
              {t('hero.filter.buy')}
            </button>
          </div>
        </div>

        {/* Property Type */}
        <div>
          <h3 className="font-bold text-pl-text mb-3">{t('properties.property_type')}</h3>
          <div className="flex flex-wrap gap-2">
            {(['house', 'plot', 'office'] as PropertyType[]).map(tType => (
              <Pill 
                key={tType} 
                active={filters.type.includes(tType)}
                onClick={() => handleTypeToggle(tType)}
                className="capitalize"
              >
                {t(`hero.filter.${tType === 'house' ? 'houses' : tType === 'plot' ? 'plots' : 'offices'}`)} <span className="opacity-60 text-[10px] ml-1">({getCount('type', tType)})</span>
              </Pill>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="font-bold text-pl-text mb-3">{t('properties.price_range')}</h3>
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
          <h3 className="font-bold text-pl-text mb-3">{t('properties.bedrooms')}</h3>
          <div className="flex flex-wrap gap-2">
            {['any', '1', '2', '3', '4'].map(b => (
              <Pill 
                key={b} 
                active={filters.bedrooms === b || (b === 'any' && !filters.bedrooms)}
                onClick={() => setFilter('bedrooms', b === 'any' ? null : b)}
              >
                {b === 'any' ? t('common.all') : `${b}+`}
                {b !== 'any' && <span className="opacity-60 text-[10px] ml-1">({getCount('bedrooms', b)})</span>}
              </Pill>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h3 className="font-bold text-pl-text mb-3">{t('properties.amenities')}</h3>
          <div className="space-y-3">
            {allAmenities.map(a => (
              <label key={a} className="flex items-center gap-3 cursor-pointer group">
                <Checkbox 
                  checked={filters.amenities.includes(a)}
                  onCheckedChange={() => handleAmenityToggle(a)}
                  className="data-[state=checked]:bg-pl-accent data-[state=checked]:border-pl-accent"
                />
                <span className="text-sm font-medium text-pl-text group-hover:text-pl-accent transition-colors">
                  {t(`properties.amenities_list.${a}`, a)} <span className="text-pl-muted font-normal text-xs ml-1">({getCount('amenities', a)})</span>
                </span>
              </label>
            ))}
          </div>
        </div>

      </div>
    </aside>
  )
}
