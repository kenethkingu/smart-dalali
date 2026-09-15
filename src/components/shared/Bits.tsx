import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { ShieldCheck, Clock } from 'lucide-react'
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

export function PrimaryButton({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <MagneticButton className={className}>
      <button
        type="button"
        className={cn(
          'inline-flex w-full items-center justify-center gap-2 bg-pl-accent hover:bg-pl-accent-dark text-white font-semibold text-sm rounded-xl px-5 py-2.5 transition-colors disabled:opacity-40 disabled:pointer-events-none',
        )}
        {...props}
      >
        {children}
      </button>
    </MagneticButton>
  )
}

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
