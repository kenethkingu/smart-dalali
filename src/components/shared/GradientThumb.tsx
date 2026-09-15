import type { ThumbTone } from '@/types'
import { cn } from '@/lib/utils'

interface GradientThumbProps {
  tone: ThumbTone
  className?: string
}

export function GradientThumb({ tone, className }: GradientThumbProps) {
  // Map tones to subtle, on-brand monochrome gradients
  const tones: Record<ThumbTone, string> = {
    a: 'bg-gradient-to-br from-zinc-200 to-zinc-300',
    b: 'bg-gradient-to-br from-stone-200 to-stone-300',
    c: 'bg-gradient-to-br from-slate-200 to-slate-300',
    d: 'bg-gradient-to-br from-gray-200 to-gray-300',
    e: 'bg-gradient-to-br from-neutral-200 to-neutral-300',
  }

  return (
    <div className={cn('w-full h-full', tones[tone], className)} />
  )
}
