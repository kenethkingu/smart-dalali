import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { ShieldCheck, Clock, Wifi, ArrowUpDown, Zap, Route, Fence, Home, Droplets, Dumbbell, Wind, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PropertyStatus } from '@/types'
import { MagneticButton } from '../ui/magnetic-button'

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 bg-emerald-50 text-pl-accent-dark text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-200',
        className,
      )}
    >
      <ShieldCheck className="w-3 h-3" /> Verified
    </span>
  )
}

export function PropertyStatusBadge({ status }: { status: PropertyStatus }) {
  if (status === 'approved') return <VerifiedBadge />
  if (status === 'pending')
    return (
      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
        <Clock className="w-3 h-3" /> Pending Review
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1 bg-red-50 text-pl-danger text-[11px] font-bold px-2 py-0.5 rounded-full border border-red-200">
      Rejected
    </span>
  )
}

export function Pill({
  active,
  children,
  onClick,
  className,
}: {
  active?: boolean
  children: ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition-colors',
        active ? 'bg-pl-ink text-white border-pl-ink' : 'bg-white text-pl-muted border-pl-line hover:border-pl-ink/40',
        className,
      )}
    >
      {children}
    </button>
  )
}

export interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
}

export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ className, children, isLoading, disabled, ...props }, ref) => {
    return (
      <MagneticButton className={className}>
        <button
          ref={ref}
          type="button"
          disabled={isLoading || disabled}
          className={cn(
            'inline-flex w-full items-center justify-center gap-2 bg-pl-accent hover:bg-pl-accent-dark text-white font-semibold text-sm rounded-xl px-5 py-2.5 transition-colors disabled:opacity-40 disabled:pointer-events-none',
          )}
          {...props}
        >
          {isLoading ? (
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            children
          )}
        </button>
      </MagneticButton>
    )
  }
)
PrimaryButton.displayName = 'PrimaryButton'

export function GhostButton({ children, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center gap-2 bg-transparent border border-pl-ink text-pl-ink font-semibold text-sm rounded-xl px-5 py-2.5 hover:bg-pl-ink hover:text-white transition-colors',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function DangerButton({ children, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center gap-2 bg-transparent border border-pl-danger text-pl-danger font-semibold text-sm rounded-xl px-5 py-2.5 hover:bg-pl-danger hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function formatPrice(n: number) {
  return new Intl.NumberFormat('en-US').format(n)
}

export function AmenityIcon({ amenity, className }: { amenity: string; className?: string }) {
  const name = amenity.toLowerCase()
  if (name.includes('wifi') || name.includes('internet')) return <Wifi className={className} />
  if (name.includes('elevator') || name.includes('lift')) return <ArrowUpDown className={className} />
  if (name.includes('security') || name.includes('guard')) return <ShieldCheck className={className} />
  if (name.includes('generator') || name.includes('power')) return <Zap className={className} />
  if (name.includes('road') || name.includes('distance')) return <Route className={className} />
  if (name.includes('fence') || name.includes('wall')) return <Fence className={className} />
  if (name.includes('servant') || name.includes('bq') || name.includes('quarters')) return <Home className={className} />
  if (name.includes('borehole') || name.includes('water')) return <Droplets className={className} />
  if (name.includes('pool') || name.includes('swim')) return <Droplets className={className} />
  if (name.includes('gym') || name.includes('fitness')) return <Dumbbell className={className} />
  if (name.includes('air cond') || name.includes('ac')) return <Wind className={className} />
  
  return <CheckCircle2 className={className} />
}
