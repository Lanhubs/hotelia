import { useNavigate } from 'react-router-dom'
import { FaUserGroup, FaBed, FaCheck } from 'react-icons/fa6'
import type { AvailabilityItem, SearchParams } from '../../api/types'
import { formatNaira } from '../../lib/money'
import { Button } from '../shared/Button'
import { useCheckoutStore } from '../../stores/checkoutStore'

export function AvailabilityCard({ item, search }: { item: AvailabilityItem; search: SearchParams }) {
  const navigate = useNavigate()
  const setRoom = useCheckoutStore((s) => s.setRoom)
  const setSearch = useCheckoutStore((s) => s.setSearch)

  const select = () => {
    setRoom(item.room)
    setSearch(search)
    navigate('/booking/review')
  }

  const { room } = item

  return (
    <article className="grid gap-6 border border-hairline bg-paper p-5 md:grid-cols-[2fr_3fr] md:p-0">
      <div className="aspect-[4/3] overflow-hidden bg-paper-soft md:aspect-auto md:h-full">
        <img src={room.image} alt={room.name} loading="lazy" className="h-full w-full object-cover" />
      </div>

      <div className="flex flex-col justify-between gap-5 p-0 md:p-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bronze-deep">{room.category}</p>
          <h3 className="mt-1 text-2xl">{room.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-ink-mute">{room.description}</p>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-mute">
            <span className="flex items-center gap-2">
              <FaUserGroup className="h-4 w-4 text-bronze-deep" /> Up to {room.capacity} guests
            </span>
            <span className="flex items-center gap-2">
              <FaBed className="h-4 w-4 text-bronze-deep" /> {room.bedType}
            </span>
          </div>

          {room.amenities && room.amenities.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {room.amenities.slice(0, 4).map((a, idx) => {
                const name = typeof a === 'string' ? a : a.name
                const id = typeof a === 'string' ? `am-${idx}-${a}` : a.id
                return (
                  <li key={id} className="flex items-center gap-2 text-xs text-ink-mute">
                    <FaCheck className="h-3 w-3 text-bronze-deep" />
                    {name}
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4 border-t border-hairline pt-5">
          <div>
            <p className="text-xs text-ink-mute">
              {item.nights} night{item.nights === 1 ? '' : 's'} · {formatNaira(item.pricePerNight)} / night
            </p>
            <p className="mt-1 font-numeric text-2xl font-semibold text-ink">{formatNaira(item.total)}</p>
            <p className="text-xs text-ink-mute">incl. est. tax {formatNaira(item.taxEstimate)}</p>
          </div>
          <Button onClick={select}>
            Select · {item.availableUnits} left
          </Button>
        </div>
      </div>
    </article>
  )
}