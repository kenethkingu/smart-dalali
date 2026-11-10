import { motion, useReducedMotion } from 'framer-motion'

export function SuccessCheck() {
  const reduced = useReducedMotion()
  return (
    <svg viewBox="0 0 52 52" className="mx-auto h-16 w-16 text-pl-accent" fill="none" aria-hidden="true">
      <circle cx="26" cy="26" r="24" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <motion.path
        d="M14 27 l8 8 l16 -17"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: reduced ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduced ? 0 : 0.5, ease: 'easeOut' }}
      />
    </svg>
  )
}
