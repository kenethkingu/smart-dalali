import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

interface RotatingWordProps {
  words: string[]
  /** Milliseconds each word is displayed before cycling. Default: 2800 */
  interval?: number
  className?: string
}

/**
 * A fixed-width inline span that cycles through words with a vertical
 * slide + fade transition. Width is locked to the longest word in the set
 * so the surrounding text never shifts on each swap.
 *
 * Accessibility:
 *  - The animated span is aria-hidden; an sr-only span lists all words once.
 *  - Respects prefers-reduced-motion: shows first word statically instead.
 *  - Pauses on hover (don't make the user re-read mid-sentence).
 */
export function RotatingWord({ words, interval = 2800, className = '' }: RotatingWordProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const shouldReduce = useReducedMotion()
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (shouldReduce || paused) return
    timerRef.current = setInterval(() => {
      setIndex(i => (i + 1) % words.length)
    }, interval)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [words.length, interval, paused, shouldReduce])

  // Reserve width of the longest word to prevent layout shifts
  const longestWord = words.reduce((a, b) => (b.length > a.length ? b : a), '')

  return (
    <>
      {/* Screen-reader version — reads all options once, no animation */}
      <span className="sr-only">{words.join(', or ')}</span>

      {/*
        Visual version — aria-hidden so screen readers use the sr-only above.
        Position: relative + inline-block container holds the absolutely-
        positioned animated words. The invisible longestWord ghost reserves
        the exact width regardless of which word is currently showing.
      */}
      <span
        className={`relative inline-block ${className}`}
        aria-hidden="true"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Invisible spacer that locks the width */}
        <span className="invisible whitespace-pre-line" aria-hidden="true">{longestWord}</span>

        {/* Animated word, absolutely positioned over the spacer */}
        <span className="absolute inset-0 flex items-center">
          {shouldReduce ? (
            <span>{words[0]}</span>
          ) : (
            <AnimatePresence mode="wait">
              <motion.span
                key={words[index]}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -14, opacity: 0 }}
                transition={{ duration: 0.32, ease: 'easeOut' }}
                className="block whitespace-pre-line"
              >
                {words[index]}
              </motion.span>
            </AnimatePresence>
          )}
        </span>
      </span>
    </>
  )
}
