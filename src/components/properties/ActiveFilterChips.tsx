import { useFilterState } from '@/lib/useFilterState'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatPrice } from '../shared/Bits'

export function ActiveFilterChips() {
  const { filters, removeFilter, clearAll, activeCount } = useFilterState()

  if (activeCount === 0) return null

  const chips: { key: string; label: string; onRemove: () => void }[] = []

  if (filters.purpose) {
    chips.push({ key: 'purpose', label: filters.purpose === 'rent' ? 'For Rent' : 'For Sale', onRemove: () => removeFilter('purpose') })
  }
  filters.type.forEach(t => {
    chips.push({ key: `type-${t}`, label: t, onRemove: () => removeFilter('type', t) })
  })
  if (filters.minPrice || filters.maxPrice) {
    let label = ''
    if (filters.minPrice && filters.maxPrice) label = `${formatPrice(filters.minPrice)} - ${formatPrice(filters.maxPrice)}`
    else if (filters.minPrice) label = `Min: ${formatPrice(filters.minPrice)}`
    else if (filters.maxPrice) label = `Max: ${formatPrice(filters.maxPrice)}`
    
    chips.push({ key: 'price', label, onRemove: () => { removeFilter('minPrice'); removeFilter('maxPrice') } })
  }
  if (filters.bedrooms) {
    chips.push({ key: 'bedrooms', label: `${filters.bedrooms}+ Beds`, onRemove: () => removeFilter('bedrooms') })
  }
  filters.amenities.forEach(a => {
    chips.push({ key: `amenity-${a}`, label: a, onRemove: () => removeFilter('amenities', a) })
  })

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <AnimatePresence>
        {chips.map(chip => (
          <motion.button
            key={chip.key}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={chip.onRemove}
            className="flex items-center gap-1.5 bg-pl-ink text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-black transition-colors"
          >
            <span className="capitalize">{chip.label}</span>
            <X className="w-3.5 h-3.5 opacity-70" />
          </motion.button>
        ))}
      </AnimatePresence>
      
      {activeCount > 0 && (
        <button 
          onClick={clearAll}
          className="text-sm font-bold text-pl-muted hover:text-pl-ink ml-2 underline underline-offset-2 transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  )
}
