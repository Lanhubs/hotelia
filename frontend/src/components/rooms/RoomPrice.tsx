import type { SearchParams } from '../../api/types'
import { nightsBetween } from '../../lib/dates'
import { formatNaira } from '../../lib/money'
import { TAX_RATE } from '../../lib/financials'

export function RoomPrice({
  pricePerNight,
  search,
  detail = false,
  className,
}: {
  pricePerNight: number
  search?: SearchParams | null
  detail?: boolean
  className?: string
}) {
  if (search?.checkIn && search.checkOut && nightsBetween(search.checkIn, search.checkOut) > 0) {
    const nights = nightsBetween(search.checkIn, search.checkOut)
    const rooms = search.rooms || 1
    const roomTotal = pricePerNight * nights * rooms
    const tax = Math.round(roomTotal * TAX_RATE)

    if (detail) {
      return (
        <div className={className}>
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-3xl font-numeric font-semibold text-ink">{formatNaira(roomTotal)}</span>
            <span className="text-xs text-ink-mute">for {nights} night{nights === 1 ? '' : 's'}</span>
          </div>
          <dl className="mt-4 space-y-2 border-t border-hairline pt-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-mute">
                {formatNaira(pricePerNight)} × {nights} {rooms > 1 ? `· ${rooms} room${rooms === 1 ? '' : 's'}` : ''}
              </dt>
              <dd className="font-numeric text-ink">{formatNaira(roomTotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-mute">Taxes &amp; fees</dt>
              <dd className="font-numeric text-ink">{formatNaira(tax)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-hairline pt-3">
              <dt className="font-semibold text-ink">Total</dt>
              <dd className="font-numeric text-base font-semibold text-ink">{formatNaira(roomTotal + tax)}</dd>
            </div>
          </dl>
        </div>
      )
    }

    return (
      <div className={className}>
        <p className="font-numeric text-2xl font-semibold text-ink">{formatNaira(roomTotal)}</p>
        <p className="text-xs text-ink-mute">
          {nights} night{nights === 1 ? '' : 's'} · {formatNaira(pricePerNight)} / night
        </p>
      </div>
    )
  }

  return (
    <div className={className}>
      <p className="font-numeric text-2xl font-semibold text-ink">{formatNaira(pricePerNight)}</p>
      <p className="text-xs text-ink-mute">per night</p>
    </div>
  )
}