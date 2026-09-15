import { useFilterState } from '@/lib/useFilterState'
import { PropertyCard } from './PropertyCard'
import { properties } from '@/data/mockData'
import { PrimaryButton } from '../shared/Bits'
import { SearchX } from 'lucide-react'
import { motion } from 'framer-motion'

export function ZeroResultsState() {
  const { filters, removeFilter, clearAll } = useFilterState()

  // Find the blocker (simple heuristic: pick the first restrictive filter)
  let blockerKey: keyof typeof filters | null = null
  let blockerLabel = ''
  let blockerValue: any = null

  if (filters.maxPrice) { blockerKey = 'maxPrice'; blockerLabel = 'Max Price' }
  else if (filters.minPrice) { blockerKey = 'minPrice'; blockerLabel = 'Min Price' }
  else if (filters.bedrooms) { blockerKey = 'bedrooms'; blockerLabel = `${filters.bedrooms}+ Bedrooms` }
  else if (filters.amenities.length > 0) { blockerKey = 'amenities'; blockerLabel = filters.amenities[0]; blockerValue = filters.amenities[0] }
  else if (filters.type.length > 0) { blockerKey = 'type'; blockerLabel = filters.type[0]; blockerValue = filters.type[0] }
  else if (filters.purpose) { blockerKey = 'purpose'; blockerLabel = filters.purpose }

  const popular = properties.filter(p => p.sponsored).slice(0, 4)

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="w-full flex flex-col items-center text-center py-12"
    >
      <div className="w-16 h-16 rounded-full bg-pl-line/50 flex items-center justify-center mb-6 text-pl-muted">
        <SearchX className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-pl-ink mb-2">No exact matches found</h2>
      
      {blockerKey ? (
        <p className="text-pl-muted mb-8 max-w-md">
          We couldn't find properties matching all your criteria. 
          <button 
            onClick={() => removeFilter(blockerKey!, blockerValue)}
            className="text-pl-accent hover:text-pl-accent-dark font-bold underline ml-1"
          >
            Remove '{blockerLabel}'
          </button> to see more results, or clear all filters.
        </p>
      ) : (
        <p className="text-pl-muted mb-8 max-w-md">Try adjusting your filters to find what you're looking for.</p>
      )}

      <PrimaryButton onClick={clearAll} className="mb-16">
        Clear all filters
      </PrimaryButton>

      <div className="w-full text-left">
        <h3 className="text-xl font-bold text-pl-ink mb-6">Popular Properties</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {popular.map(p => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
