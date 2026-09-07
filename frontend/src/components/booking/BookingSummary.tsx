import { formatDateRange, nightsBetween } from '../../lib/dates'
import { formatNaira } from '../../lib/money'
import { useCheckoutStore } from '../../stores/checkoutStore'
import { computeFinancials } from '../../lib/financials'

export function BookingSummary() {
  const room = useCheckoutStore((s) => s.room)
  const search = useCheckoutStore((s) => s.search)
  const extras = useCheckoutStore((s) => s.extras)
  const booking = useCheckoutStore((s) => s.booking)

  if (!room || !search) {
    return (
      <aside className="border border-hairline bg-paper-soft/50 p-6">
        <p className="text-sm text-ink-mute">No stay selected yet.</p>
      </aside>
    )
  }

  const nights = nightsBetween(search.checkIn, search.checkOut)
  const fin = computeFinancials(room, search, extras)

  return (
    <aside className="border border-hairline bg-paper-soft/40 p-6 md:p-7">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bronze-deep">Your stay</h2>

      <div className="mt-4 flex items-center gap-4">
        <img src={room.image} alt="" className="h-16 w-20 object-cover" />
        <div>
          <p className="font-semibold text-ink">{room.name}</p>
          <p className="text-xs text-ink-mute">{room.category}</p>
        </div>
      </div>

      <dl className="mt-6 space-y-3 border-t border-hairline pt-5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-ink-mute">Dates</dt>
          <dd className="text-right text-ink">{formatDateRange(search.checkIn, search.checkOut)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink-mute">Nights</dt>
          <dd className="text-ink">{nights}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink-mute">Guests</dt>
          <dd className="text-ink">
            {search.adults} adult{search.adults === 1 ? '' : 's'}
            {search.children ? ` · ${search.children} child${search.children === 1 ? '' : 'ren'}` : ''} · {search.rooms} room
            {search.rooms === 1 ? '' : 's'}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink-mute">Nightly rate</dt>
          <dd className="font-numeric text-ink">{formatNaira(room.pricePerNight)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink-mute">Room total</dt>
          <dd className="font-numeric text-ink">{formatNaira(fin.roomTotal)}</dd>
        </div>
        {fin.extrasTotal > 0 ? (
          <div className="flex justify-between gap-4">
            <dt className="text-ink-mute">Extras</dt>
            <dd className="font-numeric text-ink">{formatNaira(fin.extrasTotal)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <dt className="text-ink-mute">Taxes &amp; fees</dt>
          <dd className="font-numeric text-ink">{formatNaira(fin.taxAmount)}</dd>
        </div>
      </dl>

      <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-hairline pt-5">
        <span className="text-sm font-semibold text-ink">Total</span>
        <span className="font-numeric text-2xl font-semibold text-ink">{formatNaira(fin.totalAmount)}</span>
      </div>

      {booking ? (
        <dl className="mt-4 space-y-2 border-t border-hairline pt-4 text-xs">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-mute">Amount paid</dt>
            <dd className="font-numeric text-ink">{formatNaira(booking.financials.amountPaid)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-mute">Balance due</dt>
            <dd className="font-numeric text-ink">{formatNaira(booking.financials.balanceDue)}</dd>
          </div>
        </dl>
      ) : null}

      <p className="mt-5 text-xs leading-relaxed text-ink-mute">
        Reservations are confirmed once payment is verified. Need help? Call{' '}
        <span className="whitespace-nowrap">+234 813 014 8920</span>.
      </p>
    </aside>
  )
}