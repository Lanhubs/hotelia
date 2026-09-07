import { Link, useParams } from 'react-router-dom'
import { FaUserGroup, FaLayerGroup, FaUtensils, FaMicrophone, FaPhone, FaEnvelope } from 'react-icons/fa6'
import { Seo } from '../components/seo/Seo'
import { Skeleton } from '../components/shared/Skeleton'
import { ErrorState } from '../components/shared/ErrorState'
import { ButtonLink } from '../components/shared/Button'
import { GalleryGrid } from '../components/gallery/GalleryGrid'
import { useEvent } from '../hooks/useEvents'
import { useHotel } from '../hooks/useHotel'
import { formatNumber } from '../lib/money'

const facilityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Dedicated events team': FaUserGroup,
  'Sound & lighting': FaMicrophone,
  'Flexible setup': FaLayerGroup,
  Catering: FaUtensils,
}

export function EventDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const { data: event, isLoading, isError } = useEvent(slug)
  const { data: hotel } = useHotel()
  const contact = hotel?.contact

  if (isLoading) {
    return (
      <div className="container-x py-20">
        <Skeleton className="aspect-[16/9] w-full" />
        <Skeleton className="mt-8 h-10 w-2/3" />
      </div>
    )
  }

  if (isError || !event) {
    return (
      <div className="container-x py-20">
        <ErrorState title="Event space not found" message="We couldn’t find that event space. Browse all our events instead." actionLabel="All events" actionTo="/events" />
      </div>
    )
  }

  return (
    <>
      <Seo title={event.name} description={event.description} path={`/events/${event.slug}`} />
      <section className="container-x py-10 md:py-14">
        <nav className="text-xs text-ink-mute">
          <Link to="/events" className="hover:text-bronze-deep">Events</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{event.name}</span>
        </nav>

        <div className="mt-8">
          <GalleryGrid images={event.gallery} columns={2} />
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[3fr_2fr]">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bronze-deep">{event.category}</p>
            <h1 className="mt-2 text-4xl font-light leading-tight">{event.name}</h1>
            <p className="mt-5 text-base leading-relaxed text-ink-mute">{event.description}</p>

            <h2 className="mt-10 text-2xl">Layouts</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {event.layouts.map((layout) => (
                <li key={layout} className="border border-hairline px-4 py-2 text-sm text-ink-mute">
                  {layout}
                </li>
              ))}
            </ul>

            <h2 className="mt-10 text-2xl">Facilities</h2>
            <ul className="mt-4 space-y-3">
              {event.facilities.map((facility) => {
                const Icon = facilityIcons[facility] ?? FaUserGroup
                return (
                  <li key={facility} className="flex items-center gap-3 text-sm text-ink-mute">
                    <Icon className="h-4 w-4 text-bronze-deep" />
                    {facility}
                  </li>
                )
              })}
            </ul>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-hairline bg-paper-soft/40 p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-mute">Capacity</p>
              <p className="mt-2 font-numeric text-3xl font-semibold text-ink">
                {event.capacity ? `Up to ${formatNumber(event.capacity)} guests` : 'Enquire'}
              </p>
              <p className="mt-2 text-sm text-ink-mute">
                Final capacity depends on your chosen layout and setup.
              </p>

              <div className="mt-6 border-t border-hairline pt-6 text-sm text-ink-mute">
                <p className="flex items-center gap-3">
                  <FaPhone className="h-3.5 w-3.5 text-bronze-deep" /> {contact?.phoneDisplay ?? '+234 813 014 8920'}
                </p>
                <p className="mt-2 flex items-center gap-3">
                  <FaEnvelope className="h-3.5 w-3.5 text-bronze-deep" /> {contact?.email ?? 'booking@keoexperience.com'}
                </p>
              </div>

              <ButtonLink to="/contact" size="lg" className="mt-6 w-full">
                Enquire about this space
              </ButtonLink>
              <ButtonLink to="/availability" variant="outline" className="mt-3 w-full">
                Book a stay
              </ButtonLink>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}