import { useState } from 'react'
import { Seo } from '../components/seo/Seo'
import { PageHeader } from '../components/shared/PageHeader'
import { GalleryGrid } from '../components/gallery/GalleryGrid'
import { Skeleton } from '../components/shared/Skeleton'
import { ErrorState } from '../components/shared/ErrorState'
import { useGallery } from '../hooks/useHotel'
import { cn } from '../lib/cn'

export function GalleryPage() {
  const { data, isLoading, isError } = useGallery()
  const [active, setActive] = useState<string>('All')

  const categories = data ? ['All', ...Object.keys(data)] : ['All']
  const images = data ? (active === 'All' ? Object.values(data).flat() : data[active] ?? []) : []

  return (
    <>
      <Seo
        title="Gallery"
        description="A glimpse of KEO Experience Hotel & Events — rooms, interiors, dining, events and outdoor spaces in Ilorin."
        path="/gallery"
      />
      <PageHeader
        eyebrow="Gallery"
        title="The KEO experience, in pictures"
        description="Rooms, interiors, dining, events and the quiet outdoor spaces that make a stay at KEO feel like a retreat."
      />

      <section className="container-x py-12">
        <div className="flex flex-wrap gap-2 border-b border-hairline pb-6">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              className={cn(
                'border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors',
                active === category ? 'border-ink bg-ink text-paper' : 'border-hairline text-ink-mute hover:border-ink',
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-10">
          {isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/3] w-full" />
              ))}
            </div>
          ) : isError ? (
            <ErrorState message="We couldn’t load the gallery right now. Please try again later." actionLabel="Back to home" actionTo="/" />
          ) : (
            <GalleryGrid images={images} columns={3} />
          )}
        </div>
      </section>
    </>
  )
}