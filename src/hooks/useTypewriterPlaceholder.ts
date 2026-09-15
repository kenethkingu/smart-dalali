import { useState, useEffect } from 'react'

interface TypewriterOptions {
  phrases: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
}

/**
 * Types out a sequence of phrases exactly once, then stays on the last phrase.
 * Used for the search bar placeholder hint.
 */
export function useTypewriterPlaceholder({
  phrases,
  typingSpeed = 60,
  deletingSpeed = 30,
  pauseDuration = 1500,
}: TypewriterOptions) {
  const [text, setText] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    if (isDone || phrases.length === 0) return

    const currentPhrase = phrases[phraseIndex]

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing forward
        setText(currentPhrase.substring(0, text.length + 1))
        
        // Reached end of current phrase
        if (text.length === currentPhrase.length) {
          if (phraseIndex === phrases.length - 1) {
            // Reached end of all phrases
            setIsDone(true)
            return
          }
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
          setPhraseIndex(i => i + 1)
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed)

    return () => clearTimeout(timeout)
  }, [text, isDeleting, phraseIndex, isDone, phrases, typingSpeed, deletingSpeed, pauseDuration])

  return text
}
