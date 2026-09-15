import { useState } from 'react'
import { GradientThumb } from './GradientThumb'
import type { Property } from '@/types'

interface PropertyImageProps {
  property: Property
  className?: string
  alt?: string
}

export function PropertyImage({ property, className, alt }: PropertyImageProps) {
  const [failed, setFailed] = useState(false)

  // Use explicit alt or fall back to a title-based default
  const imgAlt = alt || `${property.title} — ${property.location}`

  if (!property.imageUrl || failed) {
    return <GradientThumb tone={property.tone} className={className} alt={imgAlt} />
  }

  return (
    <img
      src={property.imageUrl}
      alt={imgAlt}
      className={className}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  )
}
