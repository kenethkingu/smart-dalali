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
  pauseDuration = 4000,
  nextPhraseDelay = 500,
  isDisabled = false,
}: TypewriterOptions & { nextPhraseDelay?: number }) {
  
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
    let timeout: ReturnType<typeof setTimeout>

    if (!isDeleting && text === currentPhrase) {
      // Pause at the end of typing before deleting
      timeout = setTimeout(() => setIsDeleting(true), pauseDuration)
    } else if (isDeleting && text === '') {
      // Move to the next phrase after deleting is done, with a small pause
      timeout = setTimeout(() => {
        setIsDeleting(false)
        setPhraseIndex((i) => (i + 1) % phrases.length)
      }, nextPhraseDelay)
    } else {
      // Typing or deleting characters
      timeout = setTimeout(() => {
        setText(currentPhrase.substring(0, text.length + (isDeleting ? -1 : 1)))
      }, isDeleting ? deletingSpeed : typingSpeed)
    }

    return () => clearTimeout(timeout)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, isDeleting, phraseIndex, phrases.join('|'), typingSpeed, deletingSpeed, pauseDuration, nextPhraseDelay, isDisabled, shouldReduce])

  return `${text}${showCursor ? '|' : ''}`
}
