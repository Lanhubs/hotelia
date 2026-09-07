import { cn } from '../../lib/cn'
import { useUiStore } from '../../stores/uiStore'

export function GalleryGrid({
  images,
  columns = 3,
  className,
}: {
  images: string[]
  columns?: 2 | 3 | 4
  className?: string
}) {
  const openLightbox = useUiStore((s) => s.openLightbox)

  const colClass = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  }[columns]

  return (
    <div className={cn('grid gap-3', colClass, className)}>
      {images.map((src, i) => (
        <button
          key={`${src}-${i}`}
          type="button"
          onClick={() => openLightbox(images, i)}
          className="group relative aspect-[4/3] overflow-hidden bg-paper-soft"
          aria-label={`Open image ${i + 1}`}
        >
          <img
            src={src}
            alt={`KEO gallery image ${i + 1}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        </button>
      ))}
    </div>
  )
}