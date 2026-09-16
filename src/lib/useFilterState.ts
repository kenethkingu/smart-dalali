import { useSearchParams } from 'react-router-dom'
import { useMemo } from 'react'
import type { PropertyType } from '@/types'

export interface FilterState {
  purpose: 'rent' | 'buy' | null
  type: PropertyType[]
  minPrice: number | null
  maxPrice: number | null
  bedrooms: string | null // 'any', '1', '2', '3', '4'
  amenities: string[]
  titleType: string[]
}

export function useFilterState() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo<FilterState>(() => {
    return {
      purpose: (searchParams.get('purpose') as FilterState['purpose']) || null,
      type: searchParams.get('type') ? (searchParams.get('type')!.split(',') as PropertyType[]) : [],
      minPrice: searchParams.has('minPrice') ? Number(searchParams.get('minPrice')) : null,
      maxPrice: searchParams.has('maxPrice') ? Number(searchParams.get('maxPrice')) : null,
      bedrooms: searchParams.get('bedrooms') || null,
      amenities: searchParams.get('amenities') ? searchParams.get('amenities')!.split(',') : [],
      titleType: searchParams.get('titleType') ? searchParams.get('titleType')!.split(',') : []
    }
  }, [searchParams])

  const setFilter = (key: keyof FilterState, value: string | number | null | string[]) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      
      if (value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
        next.delete(key)
      } else if (Array.isArray(value)) {
        next.set(key, value.join(','))
      } else {
        next.set(key, String(value))
      }
      
      return next
    }, { replace: true }) // use replace to avoid flooding history
  }

  const clearAll = () => {
    setSearchParams(new URLSearchParams(), { replace: true })
  }

  const removeFilter = (key: keyof FilterState, arrayValueToRemove?: string) => {
    if (arrayValueToRemove) {
      const current = filters[key] as string[]
      setFilter(key, current.filter(v => v !== arrayValueToRemove))
    } else {
      setFilter(key, null)
    }
  }

  return {
    filters,
    setFilter,
    removeFilter,
    clearAll,
    activeCount: Array.from((searchParams as any).keys()).length
  }
}
