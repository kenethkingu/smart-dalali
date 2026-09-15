import { useState, useEffect } from 'react'
import { Slider } from '@/components/ui/slider'

interface PriceRangeFilterProps {
  minPrice: number | null
  maxPrice: number | null
  onChange: (min: number | null, max: number | null) => void
}

export function PriceRangeFilter({ minPrice, maxPrice, onChange }: PriceRangeFilterProps) {
  const DEFAULT_MAX = 5_000_000
  const DEFAULT_MIN = 0
  
  const [localRange, setLocalRange] = useState<[number, number]>([
    minPrice ?? DEFAULT_MIN, 
    maxPrice ?? DEFAULT_MAX
  ])

  // Sync internal state if props change from outside (like URL load or clear all)
  useEffect(() => {
    setLocalRange([minPrice ?? DEFAULT_MIN, maxPrice ?? DEFAULT_MAX])
  }, [minPrice, maxPrice])

  const handleSliderChange = (val: number[]) => {
    setLocalRange([val[0], val[1]])
  }

  const handleSliderCommit = (val: number[]) => {
    const min = val[0] === DEFAULT_MIN ? null : val[0]
    const max = val[1] === DEFAULT_MAX ? null : val[1]
    onChange(min, max)
  }

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value.replace(/\D/g, ''))
    setLocalRange([val, localRange[1]])
  }

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value.replace(/\D/g, ''))
    setLocalRange([localRange[0], val])
  }

  const handleInputBlur = () => {
    // Ensure min isn't greater than max
    let newMin = localRange[0]
    let newMax = localRange[1]
    
    if (newMin > newMax) {
      newMin = newMax
    }
    
    setLocalRange([newMin, newMax])
    
    const outMin = newMin === DEFAULT_MIN ? null : newMin
    const outMax = newMax === DEFAULT_MAX || newMax === 0 ? null : newMax
    onChange(outMin, outMax)
  }

  return (
    <div className="space-y-6">
      <div className="px-2">
        <Slider
          min={DEFAULT_MIN}
          max={DEFAULT_MAX}
          step={50_000}
          value={[localRange[0], localRange[1]]}
          onValueChange={handleSliderChange}
          onValueCommit={handleSliderCommit}
          className="mt-4"
        />
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="text-xs font-semibold text-pl-muted block mb-1">Min Price (TSh)</label>
          <input 
            type="text" 
            value={localRange[0] === 0 ? '' : localRange[0].toLocaleString()}
            onChange={handleMinInputChange}
            onBlur={handleInputBlur}
            placeholder="0"
            className="w-full bg-white border border-pl-line rounded-lg px-3 py-2 text-sm outline-none focus:border-pl-accent"
          />
        </div>
        <div className="text-pl-muted font-bold mt-5">-</div>
        <div className="flex-1">
          <label className="text-xs font-semibold text-pl-muted block mb-1">Max Price (TSh)</label>
          <input 
            type="text" 
            value={localRange[1] === DEFAULT_MAX ? '' : localRange[1].toLocaleString()}
            onChange={handleMaxInputChange}
            onBlur={handleInputBlur}
            placeholder="5,000,000+"
            className="w-full bg-white border border-pl-line rounded-lg px-3 py-2 text-sm outline-none focus:border-pl-accent"
          />
        </div>
      </div>
      <p className="text-xs text-pl-muted">
        {/* Future v2 enhancement: Price distribution histogram here */}
      </p>
    </div>
  )
}
