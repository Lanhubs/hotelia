import { useState } from 'react'
import { FaChevronLeft, FaChevronRight, FaImages } from 'react-icons/fa6'
import { cn } from '../../lib/cn'
import { useUiStore } from '../../stores/uiStore'

export function RoomGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0)
  const openLightbox = useUiStore((s) => s.openLightbox)

  if (images.length === 0) return null

  const step = (dir: number) => {
    setActive((i) => (i + dir + images.length) % images.length)
  }

  return (
    <div>
      <div className="group relative aspect-[16/9] overflow-hidden bg-paper-soft">
        <button
          type="button"
          onClick={() => openLightbox(images, active)}
          className="absolute inset-0 h-full w-full"
          aria-label={`Open gallery for ${alt}`}
        >
          <img
            src={images[active]}
            alt={alt}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        </button>

        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-paper/40 bg-ink/40 text-paper backdrop-blur-sm transition-colors hover:bg-ink hover:text-paper"
            >
              <FaChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next image"
              className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-paper/40 bg-ink/40 text-paper backdrop-blur-sm transition-colors hover:bg-ink hover:text-paper"
            >
              <FaChevronRight className="h-4 w-4" />
            </button>

            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-ink/60 px-3 py-1.5 text-xs font-semibold text-paper backdrop-blur-sm">
              <FaImages className="h-3 w-3 text-bronze-soft" />
              {active + 1} / {images.length}
            </div>

            <button
              type="button"
              onClick={() => openLightbox(images, active)}
              className="absolute bottom-4 right-4 hidden bg-paper px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-paper-soft sm:block"
            >
              View all photos
            </button>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                'aspect-[4/3] overflow-hidden bg-paper-soft transition-opacity',
                i === active ? 'opacity-100 ring-1 ring-bronze ring-offset-1' : 'opacity-60 hover:opacity-90',
              )}
            >
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}