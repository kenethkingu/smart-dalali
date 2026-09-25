import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Checkbox } from '@/components/ui/checkbox'
import { PriceRangeFilter } from './PriceRangeFilter'
import { Pill, PrimaryButton } from '../shared/Bits'
import { useFilterState } from '@/lib/useFilterState'
import { publicProperties } from '@/data/mockData'
import type { PropertyType } from '@/types'
import { Filter } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function FiltersSheet() {
  const { filters, setFilter, activeCount } = useFilterState()
  const { t } = useTranslation()

  // For the sheet, we simulate "live counts" the exact same way as desktop
  const getCount = (key: string, val: any) => {
    return publicProperties.filter(p => {
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

  // Simulate total filtered results for the bottom button
  const currentTotal = publicProperties.filter(p => {
    if (filters.purpose && p.purpose !== filters.purpose) return false
    if (filters.type.length > 0 && !filters.type.includes(p.type)) return false
    if (filters.minPrice !== null && p.price < filters.minPrice) return false
    if (filters.maxPrice !== null && p.price > filters.maxPrice) return false
    if (filters.bedrooms && filters.bedrooms !== 'any' && (p.bedrooms || 0) < parseInt(filters.bedrooms)) return false
    if (filters.amenities.length > 0 && !filters.amenities.every(a => p.amenities.includes(a))) return false
    return true
  }).length

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="lg:hidden flex items-center gap-2 bg-pl-bg border border-pl-line rounded-full px-4 py-2 text-sm font-bold text-pl-ink shadow-sm">
          <Filter className="w-4 h-4" /> {t('properties.filter_title')} {activeCount > 0 && `(${activeCount})`}
        </button>
      </SheetTrigger>
      
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl flex flex-col p-0 border-0 outline-none">
        <SheetHeader className="p-6 border-b border-pl-line shrink-0">
          <SheetTitle className="text-2xl font-bold font-heading text-left">{t('properties.filter_title')}</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
          {/* Purpose */}
          <div>
            <h3 className="font-bold text-pl-ink mb-3">{t('properties.purpose')}</h3>
            <div className="flex bg-pl-surface p-1 rounded-xl">
              <button 
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${filters.purpose === 'rent' ? 'bg-pl-bg shadow-sm text-pl-ink border border-pl-line' : 'text-pl-muted'}`}
                onClick={() => setFilter('purpose', 'rent')}
              >
                {t('hero.filter.rent')}
              </button>
              <button 
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${filters.purpose === 'buy' ? 'bg-pl-bg shadow-sm text-pl-ink border border-pl-line' : 'text-pl-muted'}`}
                onClick={() => setFilter('purpose', 'buy')}
              >
                {t('hero.filter.buy')}
              </button>
            </div>
          </div>

          {/* Property Type */}
          <div>
            <h3 className="font-bold text-pl-ink mb-3">{t('properties.property_type')}</h3>
            <div className="flex flex-wrap gap-2">
              {(['house', 'plot', 'office'] as PropertyType[]).map(pt => (
                <Pill key={pt} active={filters.type.includes(pt)} onClick={() => handleTypeToggle(pt)} className="capitalize py-2">
                  {t(`hero.filter.${pt === 'house' ? 'houses' : pt === 'plot' ? 'plots' : 'offices'}`)}
                  <span className="opacity-60 text-[10px] ml-1">({getCount('type', pt)})</span>
                </Pill>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-bold text-pl-ink mb-3">{t('properties.price_range')}</h3>
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
            <h3 className="font-bold text-pl-ink mb-3">{t('properties.bedrooms')}</h3>
            <div className="flex flex-wrap gap-2">
              {['any', '1', '2', '3', '4'].map(b => (
                <Pill key={b} active={filters.bedrooms === b || (b === 'any' && !filters.bedrooms)} onClick={() => setFilter('bedrooms', b === 'any' ? null : b)} className="py-2">
                  {b === 'any' ? t('common.any') : `${b}+`}
                  {b !== 'any' && <span className="opacity-60 text-[10px] ml-1">({getCount('bedrooms', b)})</span>}
                </Pill>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="font-bold text-pl-ink mb-3">{t('properties.amenities')}</h3>
            <div className="space-y-4">
              {['WiFi', 'Parking', '24/7 Security', 'Reliable Water', 'Elevator', 'Generator Backup'].map(a => (
                <label key={a} className="flex items-center gap-3 cursor-pointer">
                  <Checkbox 
                    checked={filters.amenities.includes(a)}
                    onCheckedChange={() => handleAmenityToggle(a)}
                    className="w-5 h-5 data-[state=checked]:bg-pl-accent data-[state=checked]:border-pl-accent rounded-md"
                  />
                  <span className="text-base font-medium text-pl-ink">
                    {t(`properties.amenities_list.${a}`, a)} <span className="text-pl-muted font-normal text-sm ml-1">({getCount('amenities', a)})</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
          
        </div>
        
        {/* Footer Apply Button */}
        <div className="p-4 border-t border-pl-line shrink-0 bg-pl-bg shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.3)]">
          <SheetTrigger asChild>
            <PrimaryButton className="w-full h-14 text-lg">
              {t('filters.show_results', { count: currentTotal })}
            </PrimaryButton>
          </SheetTrigger>
        </div>
      </SheetContent>
    </Sheet>
  )
}
