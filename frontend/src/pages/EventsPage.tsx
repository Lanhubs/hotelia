import { Link } from 'react-router-dom'
import { Seo } from '../components/seo/Seo'
import { PageHeader } from '../components/shared/PageHeader'
import { Skeleton } from '../components/shared/Skeleton'
import { ErrorState } from '../components/shared/ErrorState'
import { useEvents } from '../hooks/useEvents'
import { EventCard } from '../components/events/EventCard'
import { EventCalendar } from '../components/events/EventCalendar'

export function EventsPage() {
  const { data, isLoading, isError } = useEvents()

  return (
    <>
      <Seo
        title="Events & Celebrations"
        description="Discover past events, celebrations, and gatherings at KEO Experience Hotel & Events. View our event timeline and memories."
        path="/events"
      />
      <PageHeader
        eyebrow="Events"
        title="Occasions, hosted well"
        description="KEO is both a hotel and an event destination. Browse our past celebrations and explore upcoming events."
      />

      <section className="container-x py-12">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] w-full" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState message="We couldn't load our events right now. Please try again later." actionLabel="Back to home" actionTo="/" />
        ) : (
          <>
            {/* Interactive Timeline Calendar */}
            <EventCalendar events={data || []} />

            {/* Past Events Grid */}
            <div className="mt-16">
              <h2 className="text-2xl font-light text-zinc-900 mb-8">Past Celebrations</h2>
              <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                {data?.filter(e => new Date(e.endDate) < new Date()).map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
              
              {(data?.filter(e => new Date(e.endDate) < new Date()).length || 0) === 0 && (
                <div className="text-center py-16 text-zinc-500">
                  <p className="text-lg">No past events yet. Check back soon!</p>
                </div>
              )}

              <div className="mt-16 border-t border-zinc-200 pt-10 text-center">
                <h3 className="text-2xl font-light text-zinc-900">Planning something?</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
                  Tell us about your event and we'll help you shape it — venue, catering and every detail in between.
                </p>
                <div className="mt-6">
                  <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-bronze-deep text-white rounded-lg font-medium hover:bg-bronze-deep/90 transition-colors">
                    Make an enquiry
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  )
}