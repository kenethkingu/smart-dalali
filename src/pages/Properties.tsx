import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { properties } from '../data/mockData'
import { PropertyCard } from '../components/properties/PropertyCard'
import { FiltersSidebar } from '../components/properties/FiltersSidebar'
import { FiltersSheet } from '../components/properties/FiltersSheet'
import { ActiveFilterChips } from '../components/properties/ActiveFilterChips'
import { ZeroResultsState } from '../components/properties/ZeroResultsState'
import { useFilterState } from '@/lib/useFilterState'

// A simple animating number component for the results count
function AnimatedCount({ value }: { value: number }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className="inline-block"
      >
        {value}
      </motion.span>
    </AnimatePresence>
  )
}

export function Properties() {
  const { filters } = useFilterState()

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      if (filters.purpose && p.purpose !== filters.purpose) return false
      if (filters.type.length > 0 && !filters.type.includes(p.type)) return false
      if (filters.minPrice !== null && p.price < filters.minPrice) return false
      if (filters.maxPrice !== null && p.price > filters.maxPrice) return false
      if (filters.bedrooms && filters.bedrooms !== 'any' && (p.bedrooms || 0) < parseInt(filters.bedrooms)) return false
      if (filters.amenities.length > 0 && !filters.amenities.every(a => p.amenities.includes(a))) return false
      return true
    })
  }, [filters])

  return (
    <div className="bg-pl-surface min-h-screen">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          <FiltersSidebar />

          <main className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="text-3xl font-heading font-bold text-pl-ink flex gap-2">
                <AnimatedCount value={filteredProperties.length} /> properties
              </h1>
              <FiltersSheet />
            </div>

            <ActiveFilterChips />

            {filteredProperties.length === 0 ? (
              <ZeroResultsState />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredProperties.map((property) => (
                    <motion.div
                      key={property.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <PropertyCard property={property} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  )
}
