import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function useScrollToHash() {
  const { hash, pathname } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      
      const scroll = () => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          return true
        }
        return false
      }

      // Try immediately
      if (!scroll()) {
        // If not found (e.g. initial page load where target hasn't mounted yet), try again after a short delay
        setTimeout(scroll, 100)
      }
      return
    }
    
    // No hash, or target not found (yet) — scroll to top on normal navigation
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [hash, pathname])
}
