import { Link } from 'react-router-dom'
import { Seo } from '../components/seo/Seo'
import { PageHeader } from '../components/shared/PageHeader'
import { Skeleton } from '../components/shared/Skeleton'
import { ErrorState } from '../components/shared/ErrorState'
import { useEvents } from '../hooks/useEvents'
import { ButtonLink } from '../components/shared/Button'
import { formatNumber } from '../lib/money'

export function EventsPage() {
  const { data, isLoading, isError } = useEvents()

  return (
    <>
      <Seo
        title="Events"
        description="Weddings, private celebrations, corporate events and meetings at KEO Experience Hotel & Events, Ilorin."
        path="/events"
      />
      <PageHeader
        eyebrow="Events"
        title="Occasions, hosted well"
        description="KEO is both a hotel and an event destination. Whether it’s a wedding, a meeting or a family celebration, our venue and team look after the details."
      />

      <section className="container-x py-12">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] w-full" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState message="We couldn’t load our event spaces right now. Please try again later." actionLabel="Back to home" actionTo="/" />
        ) : (
          <div className="grid gap-10 md:grid-cols-2">
            {data?.map((event) => (
              <Link key={event.id} to={`/events/${event.slug}`} className="group block">
                <div className="aspect-[4/3] overflow-hidden bg-paper-soft">
                  <img
                    src={event.image}
                    alt={event.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bronze-deep">{event.category}</p>
                  {event.capacity ? (
                    <span className="text-xs text-ink-mute">Up to {formatNumber(event.capacity)} guests</span>
                  ) : (
                    <span className="text-xs text-ink-mute">Enquire for capacity</span>
                  )}
                </div>
                <h2 className="mt-1 text-2xl group-hover:text-bronze-deep">{event.name}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-ink-mute">{event.description}</p>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-16 border-t border-hairline pt-10 text-center">
          <h2 className="text-2xl">Planning something?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-mute">
            Tell us about your event and we’ll help you shape it — venue, catering and every detail in between.
          </p>
          <div className="mt-6">
            <ButtonLink to="/contact" size="lg">
              Make an enquiry
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  )
}