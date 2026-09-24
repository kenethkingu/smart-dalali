import { useEffect, useRef, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface LightboxImage {
  src: string
  alt: string
  /** Rendered when the src fails to load (gradient fallback element) */
  fallback?: React.ReactNode
}

interface PropertyLightboxProps {
  images: LightboxImage[]
  initialIndex?: number
  isOpen: boolean
  onClose: () => void
  /** Element to return focus to when lightbox closes */
  returnFocusRef?: React.RefObject<HTMLElement | null>
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Returns true when the OS has prefers-reduced-motion set */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input, select, textarea'

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function PropertyLightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  returnFocusRef,
}: PropertyLightboxProps) {
  const reducedMotion = usePrefersReducedMotion()

  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [zoom, setZoom] = useState(1)
  const [panX, setPanX] = useState(0)
  const [panY, setPanY] = useState(0)
  const [isPanning, setIsPanning] = useState(false)
  const [imgFailed, setImgFailed] = useState(false)
  const [isEntering, setIsEntering] = useState(false)

  const overlayRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const panStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null)
  const lastTapRef = useRef<number>(0)
  const imageRef = useRef<HTMLImageElement>(null)

  // Sync initialIndex when lightbox is opened on a different photo
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
      setZoom(1)
      setPanX(0)
      setPanY(0)
      setImgFailed(false)

      // Entrance animation trigger
      if (!reducedMotion) {
        setIsEntering(true)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setIsEntering(false))
        })
      }
    }
  }, [isOpen, initialIndex, reducedMotion])

  // Reset zoom + pan when navigating between photos
  const resetZoom = useCallback(() => {
    setZoom(1)
    setPanX(0)
    setPanY(0)
  }, [])

  const goNext = useCallback(() => {
    resetZoom()
    setImgFailed(false)
    setCurrentIndex(i => (i + 1) % images.length)
  }, [images.length, resetZoom])

  const goPrev = useCallback(() => {
    resetZoom()
    setImgFailed(false)
    setCurrentIndex(i => (i - 1 + images.length) % images.length)
  }, [images.length, resetZoom])

  // ── Focus trap ─────────────────────────────────────────────────────────────
  const trapFocus = useCallback((e: KeyboardEvent) => {
    if (!overlayRef.current) return
    const focusable = Array.from(overlayRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
  }, [])

  // ── Keyboard navigation ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return

    // Move focus into the lightbox
    requestAnimationFrame(() => closeButtonRef.current?.focus())

    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape': onClose(); break
        case 'ArrowRight': goNext(); break
        case 'ArrowLeft': goPrev(); break
        case '+': case '=': setZoom(z => Math.min(z + 0.5, 4)); break
        case '-': setZoom(z => Math.max(z - 0.5, 1)); break
        default: trapFocus(e)
      }
    }

    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, goNext, goPrev, onClose, trapFocus])

  // ── Return focus on close ──────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen && returnFocusRef?.current) {
      returnFocusRef.current.focus()
    }
  }, [isOpen, returnFocusRef])

  // ── Body scroll lock ───────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // ── Wheel zoom ─────────────────────────────────────────────────────────────
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation()
    const delta = e.deltaY < 0 ? 0.25 : -0.25
    setZoom(z => {
      const next = Math.max(1, Math.min(z + delta, 4))
      if (next === 1) { setPanX(0); setPanY(0) }
      return next
    })
  }, [])

  // ── Double-click/tap zoom ──────────────────────────────────────────────────
  const handleImageDoubleClick = useCallback(() => {
    setZoom(z => {
      const next = z > 1 ? 1 : 2
      if (next === 1) { setPanX(0); setPanY(0) }
      return next
    })
  }, [])

  const handleImageClick = useCallback((e: React.MouseEvent) => {
    const now = Date.now()
    if (now - lastTapRef.current < 300) {
      handleImageDoubleClick()
    }
    lastTapRef.current = now
    e.stopPropagation()
  }, [handleImageDoubleClick])

  // ── Mouse pan ─────────────────────────────────────────────────────────────
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom <= 1) return
    e.preventDefault()
    setIsPanning(true)
    panStartRef.current = { x: e.clientX, y: e.clientY, panX, panY }
  }, [zoom, panX, panY])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning || !panStartRef.current) return
    const dx = e.clientX - panStartRef.current.x
    const dy = e.clientY - panStartRef.current.y
    setPanX(panStartRef.current.panX + dx)
    setPanY(panStartRef.current.panY + dy)
  }, [isPanning])

  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
    panStartRef.current = null
  }, [])

  // ── Touch pan (mobile) ─────────────────────────────────────────────────────
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && zoom > 1) {
      const t = e.touches[0]
      panStartRef.current = { x: t.clientX, y: t.clientY, panX, panY }
    }
    // Double-tap
    if (e.touches.length === 1) {
      const now = Date.now()
      if (now - lastTapRef.current < 300) {
        handleImageDoubleClick()
      }
      lastTapRef.current = now
    }
  }, [zoom, panX, panY, handleImageDoubleClick])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && panStartRef.current && zoom > 1) {
      e.preventDefault()
      const t = e.touches[0]
      const dx = t.clientX - panStartRef.current.x
      const dy = t.clientY - panStartRef.current.y
      setPanX(panStartRef.current.panX + dx)
      setPanY(panStartRef.current.panY + dy)
    }
  }, [zoom])

  const handleTouchEnd = useCallback(() => {
    panStartRef.current = null
  }, [])

  // ── Overlay click closes (but not click on image) ─────────────────────────
  const handleOverlayClick = useCallback(() => {
    onClose()
  }, [onClose])

  if (!isOpen) return null

  const current = images[currentIndex]
  const showPrev = images.length > 1
  const showNext = images.length > 1

  const imageTransition = reducedMotion
    ? 'none'
    : 'transform 0.2s ease'

  return createPortal(
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Photo gallery lightbox"
      className={cn(
        'fixed inset-0 z-[9999] flex items-center justify-center',
        'bg-black/95',
        !reducedMotion && isEntering ? 'opacity-0' : 'opacity-100',
      )}
      style={{
        transition: reducedMotion ? 'none' : 'opacity 0.2s ease',
      }}
      onClick={handleOverlayClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* ── Close button ────────────────────────────────────────────────── */}
      <button
        ref={closeButtonRef}
        onClick={(e) => { e.stopPropagation(); onClose() }}
        aria-label="Close photo gallery"
        className={cn(
          'absolute top-4 right-4 z-10',
          'w-10 h-10 rounded-full',
          'flex items-center justify-center',
          'bg-white/10 hover:bg-white/20',
          'text-white border border-white/20',
          'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
        )}
      >
        <X className="w-5 h-5" aria-hidden="true" />
      </button>

      {/* ── Counter ─────────────────────────────────────────────────────── */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className={cn(
          'absolute top-4 left-1/2 -translate-x-1/2',
          'px-3 py-1.5 rounded-full',
          'bg-white/10 border border-white/15',
          'text-white text-sm font-semibold tracking-wide',
          'pointer-events-none select-none',
        )}
      >
        <span className="text-white/60">{currentIndex + 1}</span>
        <span className="mx-1.5 text-white/30">/</span>
        <span className="text-white">{images.length}</span>
      </div>

      {/* ── Zoom controls ───────────────────────────────────────────────── */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        <button
          onClick={(e) => { e.stopPropagation(); setZoom(z => { const next = Math.max(z - 0.5, 1); if (next <= 1) { setPanX(0); setPanY(0) } return next }) }}
          aria-label="Zoom out"
          disabled={zoom <= 1}
          className={cn(
            'w-9 h-9 rounded-full flex items-center justify-center',
            'bg-white/10 hover:bg-white/20 text-white border border-white/20',
            'transition-colors disabled:opacity-30 disabled:pointer-events-none',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
          )}
        >
          <ZoomOut className="w-4 h-4" aria-hidden="true" />
        </button>

        {zoom > 1 && (
          <span className="text-white/70 text-xs font-medium tabular-nums select-none min-w-[3rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); setZoom(z => Math.min(z + 0.5, 4)) }}
          aria-label="Zoom in"
          disabled={zoom >= 4}
          className={cn(
            'w-9 h-9 rounded-full flex items-center justify-center',
            'bg-white/10 hover:bg-white/20 text-white border border-white/20',
            'transition-colors disabled:opacity-30 disabled:pointer-events-none',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
          )}
        >
          <ZoomIn className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* ── Prev arrow ──────────────────────────────────────────────────── */}
      {showPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); goPrev() }}
          aria-label={`Previous photo (${currentIndex === 0 ? images.length : currentIndex} of ${images.length})`}
          className={cn(
            'absolute left-3 top-1/2 -translate-y-1/2 z-10',
            'w-11 h-11 rounded-full flex items-center justify-center',
            'bg-white/10 hover:bg-white/25 text-white border border-white/20',
            'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
          )}
        >
          <ChevronLeft className="w-6 h-6" aria-hidden="true" />
        </button>
      )}

      {/* ── Next arrow ──────────────────────────────────────────────────── */}
      {showNext && (
        <button
          onClick={(e) => { e.stopPropagation(); goNext() }}
          aria-label={`Next photo (${(currentIndex + 2 > images.length) ? 1 : currentIndex + 2} of ${images.length})`}
          className={cn(
            'absolute right-3 top-1/2 -translate-y-1/2 z-10',
            'w-11 h-11 rounded-full flex items-center justify-center',
            'bg-white/10 hover:bg-white/25 text-white border border-white/20',
            'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
          )}
        >
          <ChevronRight className="w-6 h-6" aria-hidden="true" />
        </button>
      )}

      {/* ── Image area ──────────────────────────────────────────────────── */}
      <div
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        onWheel={handleWheel}
        onClick={handleImageClick}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: zoom > 1 ? (isPanning ? 'grabbing' : 'grab') : 'zoom-in' }}
      >
        {!imgFailed ? (
          <img
            ref={imageRef}
            key={currentIndex} // remount on index change — resets load state
            src={current.src}
            alt={current.alt}
            onError={() => setImgFailed(true)}
            draggable={false}
            className="max-w-[90vw] max-h-[88vh] object-contain select-none"
            style={{
              transform: `scale(${zoom}) translate(${panX / zoom}px, ${panY / zoom}px)`,
              transition: isPanning ? 'none' : imageTransition,
              willChange: 'transform',
            }}
          />
        ) : (
          /* Fallback when image fails (gradient thumb or placeholder) */
          <div
            className="max-w-[90vw] w-full max-h-[88vh] aspect-[4/3] flex items-center justify-center rounded-xl overflow-hidden"
            style={{ transform: `scale(${zoom}) translate(${panX / zoom}px, ${panY / zoom}px)` }}
          >
            {current.fallback ?? (
              <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-white/40 text-sm">
                Image unavailable
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Thumbnail strip ─────────────────────────────────────────────── */}
      {images.length > 1 && (
        <div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto pb-1 px-2"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => { resetZoom(); setImgFailed(false); setCurrentIndex(i) }}
              aria-label={`Go to photo ${i + 1}: ${img.alt}`}
              aria-current={i === currentIndex ? 'true' : undefined}
              className={cn(
                'flex-none w-12 h-9 rounded-md overflow-hidden border-2 transition-all',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
                i === currentIndex
                  ? 'border-white opacity-100 scale-105'
                  : 'border-transparent opacity-50 hover:opacity-80',
              )}
            >
              <img
                src={img.src}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  )
}
