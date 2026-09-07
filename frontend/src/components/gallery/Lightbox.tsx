import { useEffect, useRef } from 'react'
import { FaXmark, FaChevronLeft, FaChevronRight } from 'react-icons/fa6'
import { useUiStore } from '../../stores/uiStore'

export function Lightbox() {
  const { lightbox, closeLightbox, stepLightbox } = useUiStore()
  const { open, images, index } = lightbox
  const touchStartX = useRef(0)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') stepLightbox(1)
      if (e.key === 'ArrowLeft') stepLightbox(-1)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, closeLightbox, stepLightbox])

  if (!open || images.length === 0) return null

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 48) stepLightbox(dx < 0 ? 1 : -1)
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/95 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={closeLightbox}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button
        type="button"
        onClick={closeLightbox}
        aria-label="Close"
        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center border border-paper/25 text-paper transition-colors hover:border-paper"
      >
        <FaXmark className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          stepLightbox(-1)
        }}
        aria-label="Previous image"
        className="absolute left-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center border border-paper/25 text-paper hover:border-paper sm:flex"
      >
        <FaChevronLeft className="h-4 w-4" />
      </button>

      <img src={images[index]} alt={`Gallery image ${index + 1} of ${images.length}`} className="max-h-[82vh] max-w-full object-contain" onClick={(e) => e.stopPropagation()} />

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          stepLightbox(1)
        }}
        aria-label="Next image"
        className="absolute right-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center border border-paper/25 text-paper hover:border-paper sm:flex"
      >
        <FaChevronRight className="h-4 w-4" />
      </button>

      <p className="absolute bottom-6 font-numeric text-sm tracking-[0.2em] text-paper/60">
        {index + 1} / {images.length}
      </p>
    </div>
  )
}