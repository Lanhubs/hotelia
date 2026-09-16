import { Link } from 'react-router-dom'
import { Section, SectionHeading } from '../shared/Section'
import { Skeleton } from '../shared/Skeleton'
import { Reveal } from '../shared/Reveal'
import { useEvents } from '../../hooks/useEvents'
import { formatNumber } from '../../lib/money'

const typeLabels: Record<string, string> = {
  party: 'Party',
  wedding: 'Wedding',
  corporate: 'Corporate',
  gala: 'Gala',
  conference: 'Conference',
  social: 'Social',
  other: 'Other',
}

export function EventsPreview() {
  const { data, isLoading } = useEvents()

  return (
    <Section className="bg-paper-soft!">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <SectionHeading eyebrow="Events" title="Meaningful occasions, hosted well" />
        <Link to="/events" className="text-sm font-semibold text-zinc-900 underline decoration-bronze underline-offset-4 hover:text-bronze-deep">
          All events
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="aspect-4/3 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {data?.filter(e => new Date(e.endDate) < new Date()).slice(0, 3).map((event, i) => (
            <Reveal key={event.id} delay={i * 70}>
              <Link to={`/events/${event.slug}`} className="group block">
                <div className="aspect-4/3 overflow-hidden bg-zinc-100">
                  <img
                    src={event.heroImage || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800&h=600'}
                    alt={event.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bronze-deep">
                    {typeLabels[event.eventType] || event.eventType}
                  </p>
                  {event.maxCapacity ? (
                    <span className="text-xs text-zinc-500">{formatNumber(event.maxCapacity)} guests</span>
                  ) : (
                    <span className="text-xs text-zinc-500">Enquire for capacity</span>
                  )}
                </div>
                <h3 className="mt-1 text-xl group-hover:text-bronze-deep">{event.title}</h3>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </Section>
  )
}