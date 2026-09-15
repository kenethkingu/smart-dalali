import type { ThumbTone } from '@/types'
import { cn } from '@/lib/utils'

interface GradientThumbProps {
  tone: ThumbTone
  className?: string
  alt?: string
}

export function GradientThumb({ tone, className, alt }: GradientThumbProps) {
  // Map tones to rich, architectural color gradients
  const tones: Record<ThumbTone, string> = {
    a: 'bg-gradient-to-br from-[#1B3F49] to-[#2B6E7A]', // Deep Teal
    b: 'bg-gradient-to-br from-[#2D2A32] to-[#453F4C]', // Rich Charcoal/Plum
    c: 'bg-gradient-to-br from-[#183059] to-[#276FBF]', // Navy to Indigo
    d: 'bg-gradient-to-br from-[#4A3B32] to-[#7A6152]', // Warm Terracotta/Rust
    e: 'bg-gradient-to-br from-[#0F4C3A] to-[#16A97C]', // Emerald to Proland Accent
  }

  return (
    <div 
      className={cn('w-full h-full', tones[tone], className)} 
      role={alt ? "img" : undefined}
      aria-label={alt}
    />
  )
}
