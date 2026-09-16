import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Calendar, MapPin, Clock, Users, Ticket, CheckCircle2, Mail, Phone } from 'lucide-react'
import { Seo } from '../components/seo/Seo'
import { Skeleton } from '../components/shared/Skeleton'
import { ErrorState } from '../components/shared/ErrorState'
import { ButtonLink } from '../components/shared/Button'
import { GalleryGrid } from '../components/gallery/GalleryGrid'
import { useEvent } from '../hooks/useEvents'
import { formatNumber } from '../lib/money'
import { BookingForm } from '../components/events/BookingForm'

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

const typeLabels: Record<string, string> = {
  party: 'Party',
  wedding: 'Wedding',
  corporate: 'Corporate',
  gala: 'Gala',
  conference: 'Conference',
  social: 'Social',
  other: 'Other',
}

export function EventDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const { data: event, isLoading, isError } = useEvent(slug)
  const [showBooking, setShowBooking] = useState(false)

  if (isLoading) {
    return (
      <div className="container-x py-20">
        <Skeleton className="aspect-video w-full" />
        <Skeleton className="mt-8 h-10 w-2/3" />
      </div>
    )
  }

  if (isError || !event) {
    return (
      <div className="container-x py-20">
        <ErrorState title="Event not found" message="We couldn't find that event. Browse all our events instead." actionLabel="All events" actionTo="/events" />
      </div>
    )
  }

  const isPast = new Date(event.endDate) < new Date()
  const isToday = new Date(event.startDate).toDateString() === new Date().toDateString()
  const isFuture = new Date(event.startDate) > new Date()

  return (
    <>
      <Seo title={event.title} description={event.description || ''} path={`/events/${event.slug}`} />
      
      <section className="container-x py-10 md:py-14">
        <nav className="text-xs text-zinc-500">
          <Link to="/events" className="hover:text-bronze-deep">Events</Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-900">{event.title}</span>
        </nav>

        <div className="mt-8">
          <GalleryGrid images={event.gallery.length > 0 ? event.gallery : (event.heroImage ? [event.heroImage] : [])} columns={2} />
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[3fr_2fr]">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-purple-100 text-purple-700">
                {typeLabels[event.eventType] || event.eventType}
              </span>
              {event.isRecurring && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-amber-100 text-amber-700">
                  Recurring
                </span>
              )}
              {isPast && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-emerald-100 text-emerald-700">
                  Completed
                </span>
              )}
              {isToday && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-bronze-deep text-white animate-pulse">
                  Happening Today
                </span>
              )}
              {isFuture && !isToday && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-blue-100 text-blue-700">
                  Upcoming
                </span>
              )}
            </div>
            
            <h1 className="text-4xl font-light leading-tight text-zinc-900">{event.title}</h1>
            <p className="mt-5 text-base leading-relaxed text-zinc-500">{event.description}</p>

            {event.tags && event.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {event.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-zinc-100 text-zinc-700 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="p-5 bg-zinc-50 rounded-xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400 mb-2">Date & Time</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-bronze-deep shrink-0" />
                    <div>
                      <p className="font-medium text-zinc-900">{formatDate(event.startDate)}</p>
                      {event.endDate !== event.startDate && (
                        <p className="text-sm text-zinc-500">Ends {formatDate(event.endDate)}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-bronze-deep shrink-0" />
                    <div>
                      <p className="font-medium text-zinc-900">{event.startTime} – {event.endTime}</p>
                      <p className="text-sm text-zinc-500">{event.timezone}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-zinc-50 rounded-xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400 mb-2">Venue</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-bronze-deep shrink-0" />
                    <div>
                      <p className="font-medium text-zinc-900">{event.venueName || 'TBA'}</p>
                      {event.venueDescription && <p className="text-sm text-zinc-500">{event.venueDescription}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-bronze-deep shrink-0" />
                    <div>
                      <p className="font-medium text-zinc-900">Capacity: {event.maxCapacity ? formatNumber(event.maxCapacity) : 'Unlimited'}</p>
                      {event.hasTickets && event.ticketTiers.length > 0 && (
                        <p className="text-sm text-zinc-500">{event.ticketTiers.length} ticket tier{event.ticketTiers.length > 1 ? 's' : ''} available</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {event.contactEmail || event.contactPhone && (
              <div className="mt-10 p-6 bg-zinc-50 rounded-xl space-y-3">
                <h3 className="text-lg font-medium text-zinc-900">Contact Organizer</h3>
                {event.contactEmail && (
                  <a href={`mailto:${event.contactEmail}`} className="flex items-center gap-3 text-zinc-600 hover:text-bronze-deep transition-colors">
                    <Mail className="h-5 w-5 text-bronze-deep" />
                    {event.contactEmail}
                  </a>
                )}
                {event.contactPhone && (
                  <a href={`tel:${event.contactPhone}`} className="flex items-center gap-3 text-zinc-600 hover:text-bronze-deep transition-colors">
                    <Phone className="h-5 w-5 text-bronze-deep" />
                    {event.contactPhone}
                  </a>
                )}
              </div>
            )}

            {event.externalRegistrationUrl && (
              <div className="mt-10">
                <a
                  href={event.externalRegistrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-bronze-deep text-white rounded-lg font-medium hover:bg-bronze-deep/90 transition-colors"
                >
                  <Ticket className="h-5 w-5" />
                  Register on External Site
                </a>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-zinc-200 bg-white p-6 rounded-xl space-y-6">
              <div className="p-4 bg-zinc-50 rounded-lg">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400 mb-2">Event Status</p>
                {isPast ? (
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">Event Concluded</span>
                  </div>
                ) : isToday ? (
                  <div className="flex items-center gap-2 text-bronze-deep animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-bronze-deep" />
                    <span className="font-medium">Happening Today</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-blue-600">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    <span className="font-medium">Upcoming Event</span>
                  </div>
                )}
              </div>

              <div className="border-t border-zinc-200 pt-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400 mb-2">Quick Info</p>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-zinc-500">Type</dt>
                    <dd className="font-medium text-zinc-900">{typeLabels[event.eventType] || event.eventType}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-zinc-500">Category</dt>
                    <dd className="font-medium text-zinc-900">{event.category}</dd>
                  </div>
                  {event.isRecurring && (
                    <div className="flex justify-between">
                      <dt className="text-zinc-500">Frequency</dt>
                      <dd className="font-medium text-zinc-900">Recurring</dd>
                    </div>
                  )}
                </dl>
              </div>

              {!isPast && (
                <ButtonLink 
                  to={`/events/${event.slug}/book`}
                  size="lg" 
                  className="w-full"
                  onClick={(e) => { e.preventDefault(); setShowBooking(true); }}
                >
                  {event.hasTickets ? 'Buy Tickets' : 'Reserve Spot'}
                </ButtonLink>
              )}
            </div>
          </aside>
        </div>
      </section>

      {showBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-zinc-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-zinc-900">{event.hasTickets ? 'Buy Tickets' : 'Reserve Spot'}</h2>
              <button onClick={() => setShowBooking(false)} className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <BookingForm event={event} onClose={() => setShowBooking(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}