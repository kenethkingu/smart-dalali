import { useState, useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'

interface TypewriterOptions {
  phrases: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
  isDisabled?: boolean
}

/**
 * Types out a sequence of phrases continuously.
 * Used for the search bar placeholder hint.
 */
export function useTypewriterPlaceholder({
  phrases,
  typingSpeed = 50,
  deletingSpeed = 25,
  pauseDuration = 1800,
  isDisabled = false,
}: TypewriterOptions) {
  const [text, setText] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showCursor, setShowCursor] = useState(true)
  const shouldReduce = useReducedMotion()

  // Blinking cursor effect
  useEffect(() => {
    if (isDisabled || shouldReduce) return
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)
    return () => clearInterval(cursorInterval)
  }, [isDisabled, shouldReduce])

  useEffect(() => {
    if (isDisabled || phrases.length === 0 || shouldReduce) {
      // Respect reduced motion or disabled state by just showing the first phrase statically
      setText(phrases[0] || '')
      setShowCursor(false)
      return
    }

    const currentPhrase = phrases[phraseIndex]

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing forward
        setText(currentPhrase.substring(0, text.length + 1))
        
        // Reached end of current phrase
        if (text.length === currentPhrase.length) {
          // Pause before deleting
          setTimeout(() => setIsDeleting(true), pauseDuration)
        }
      } else {
        // Deleting backward
        // Optimization: only delete back to the common prefix if we wanted to be fancy,
        // but fully deleting is fine for a placeholder.
        setText(currentPhrase.substring(0, text.length - 1))
        
        if (text.length === 0) {
          setIsDeleting(false)
          setPhraseIndex(i => (i + 1) % phrases.length)
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed)

    return () => clearTimeout(timeout)
  }, [text, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseDuration, isDisabled, shouldReduce])

  return `${text}${showCursor ? '|' : ''}`
}
