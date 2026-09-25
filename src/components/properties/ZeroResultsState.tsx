import { useFilterState } from '@/lib/useFilterState'
import { PropertyCard } from './PropertyCard'
import { publicProperties } from '@/data/mockData'
import { PrimaryButton } from '../shared/Bits'
import { SearchX } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export function ZeroResultsState() {
  const { filters, removeFilter, clearAll } = useFilterState()
  const { t } = useTranslation()

  let blockerKey: keyof typeof filters | null = null
  let blockerLabel = ''
  let blockerValue: any = null

  if (filters.maxPrice) { blockerKey = 'maxPrice'; blockerLabel = t('zero_results.label_max_price') }
  else if (filters.minPrice) { blockerKey = 'minPrice'; blockerLabel = t('zero_results.label_min_price') }
  else if (filters.bedrooms) { blockerKey = 'bedrooms'; blockerLabel = `${filters.bedrooms}+ ${t('properties.bedrooms')}` }
  else if (filters.amenities.length > 0) { blockerKey = 'amenities'; blockerLabel = filters.amenities[0]; blockerValue = filters.amenities[0] }
  else if (filters.type.length > 0) { blockerKey = 'type'; blockerLabel = filters.type[0]; blockerValue = filters.type[0] }
  else if (filters.purpose) { blockerKey = 'purpose'; blockerLabel = filters.purpose }

  const popular = publicProperties.filter(p => p.sponsored).slice(0, 3)

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="w-full flex flex-col items-center text-center py-12 text-pl-text"
    >
      <div className="w-16 h-16 rounded-full bg-pl-line/50 flex items-center justify-center mb-6 text-pl-muted">
        <SearchX className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-pl-text mb-2">{t('properties.zero_results_title')}</h2>
      
      {blockerKey ? (
        <p className="text-pl-muted mb-8 max-w-md">
          {t('properties.zero_results_desc')} 
          <button 
            onClick={() => removeFilter(blockerKey!, blockerValue)}
            className="text-pl-accent hover:text-pl-accent-dark font-bold underline ml-1"
          >
            ({t('zero_results.remove_filter', { label: blockerLabel })})
          </button>
        </p>
      ) : (
        <p className="text-pl-muted mb-8 max-w-md">{t('properties.zero_results_desc')}</p>
      )}

      <PrimaryButton onClick={clearAll} className="mb-16">
        {t('properties.reset_filters')}
      </PrimaryButton>

      <div className="w-full text-left">
        <h3 className="text-xl font-bold text-pl-text mb-6">{t('home.featured_title')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {popular.map(p => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
