import { Link } from 'react-router-dom'
import { Section, SectionHeading } from '../shared/Section'
import { useGallery } from '../../hooks/useHotel'
import { Skeleton } from '../shared/Skeleton'

export function GalleryPreview() {
  const { data, isLoading } = useGallery()

  const images = data?.Rooms?.slice(0, 4) ?? []
  const extra = data?.Events?.[0]

  return (
    <Section className="py-0!">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <SectionHeading eyebrow="Gallery" title="A glimpse of the KEO experience" />
        <Link to="/gallery" className="text-sm font-semibold text-ink underline decoration-bronze underline-offset-4 hover:text-bronze-deep">
          View gallery
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] w-full" />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {images.slice(0, 3).map((src, i) => (
            <Link key={src + i} to="/gallery" className="block aspect-[4/3] overflow-hidden bg-paper-soft sm:aspect-auto">
              <img src={src} alt="KEO rooms gallery" loading="lazy" className="h-full w-full object-cover" />
            </Link>
          ))}
          {extra ? (
            <Link to="/gallery" className="block aspect-[4/3] overflow-hidden bg-paper-soft sm:col-span-2 sm:aspect-auto">
              <img src={extra} alt="KEO events gallery" loading="lazy" className="h-full w-full object-cover" />
            </Link>
          ) : null}
        </div>
      )}
    </Section>
  )
}