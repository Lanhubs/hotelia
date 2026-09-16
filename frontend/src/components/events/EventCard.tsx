import { Link } from 'react-router-dom'
import { Calendar, MapPin, Clock, CheckCircle2 } from 'lucide-react'
import type { Event } from '../../api/types'

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const startDate = new Date(event.startDate)
  const formattedDate = startDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const typeColors: Record<string, string> = {
    party: 'bg-purple-100 text-purple-700',
    wedding: 'bg-pink-100 text-pink-700',
    corporate: 'bg-blue-100 text-blue-700',
    gala: 'bg-amber-100 text-amber-700',
    conference: 'bg-indigo-100 text-indigo-700',
    social: 'bg-emerald-100 text-emerald-700',
    other: 'bg-zinc-100 text-zinc-700',
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

  const typeBadge = typeColors[event.eventType] || typeColors.other
  const typeLabel = typeLabels[event.eventType] || event.eventType

  return (
    <Link to={`/events/${event.slug}`} className="group block h-full">
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
        {event.heroImage ? (
          <img
            src={event.heroImage}
            alt={event.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full text-zinc-400">
            <Calendar className="h-12 w-12" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${typeBadge}`}>
            {typeLabel}
          </span>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <h3 className="text-lg font-medium leading-tight group-hover:text-bronze-deep transition-colors">
          {event.title}
        </h3>
        <p className="text-sm text-zinc-500 line-clamp-2">{event.description}</p>
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-500 pt-2 border-t border-zinc-200">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formattedDate}
          </span>
          {event.venueName && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {event.venueName}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {event.startTime} – {event.endTime}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-600">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Event Concluded
        </div>
      </div>
    </Link>
  )
}