import { Link } from 'react-router-dom'
import { FaUserGroup, FaBed } from 'react-icons/fa6'
import type { Room, SearchParams } from '../../api/types'
import { RoomPrice } from './RoomPrice'
import { AmenityIcon } from './AmenityIcon'
import { ButtonLink } from '../shared/Button'

export function RoomCard({ room, search }: { room: Room; search?: SearchParams | null }) {
  return (
    <article className="group">
      <Link to={`/rooms/${room.slug}`} className="block" aria-label={room.name}>
        <div className="aspect-[4/3] overflow-hidden bg-paper-soft">
          <img
            src={room.image}
            alt={room.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          />
        </div>
      </Link>

      <div className="pt-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bronze-deep">{room.category}</p>
        <h3 className="mt-2 text-2xl">
          <Link to={`/rooms/${room.slug}`} className="transition-colors hover:text-bronze-deep">
            {room.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-mute">{room.description}</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-mute">
          <span className="flex items-center gap-2">
            <FaUserGroup className="h-4 w-4 text-bronze-deep" />
            {room.capacity} guest{room.capacity === 1 ? '' : 's'}
          </span>
          <span className="flex items-center gap-2">
            <FaBed className="h-4 w-4 text-bronze-deep" />
            {room.bedType}
          </span>
          {room.amenities && room.amenities.length > 0 && (() => {
            const first = room.amenities[0]
            const name = typeof first === 'string' ? first : first.name
            const icon = typeof first === 'string' ? 'sparkles' : (first.icon || 'sparkles')
            return (
              <span className="flex items-center gap-2">
                <AmenityIcon name={icon} className="h-4 w-4 text-bronze-deep" />
                {name}
              </span>
            )
          })()}
        </div>

        <div className="mt-5 flex items-end justify-between gap-4 border-t border-hairline pt-5">
          <RoomPrice pricePerNight={room.pricePerNight} search={search} />
          <ButtonLink to={`/rooms/${room.slug}`} variant="outline" size="sm" state={{ search }}>
            View Room
          </ButtonLink>
        </div>
      </div>
    </article>
  )
}