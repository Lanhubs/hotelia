import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaCircleCheck, FaUserGroup, FaCalendarDays, FaTriangleExclamation, FaArrowRight } from 'react-icons/fa6'
import type { Room } from '../../api/types'
import { DateSelector } from '../booking/DateSelector'
import { GuestSelector } from '../booking/GuestSelector'
import { RoomPrice } from './RoomPrice'
import { Button, ButtonLink } from '../shared/Button'
import { useBookingStore } from '../../stores/bookingStore'
import { useCheckoutStore } from '../../stores/checkoutStore'
import { isValidRange } from '../../lib/dates'
import { useRoomAvailability } from '../../hooks/useRoomAvailability'

const included = ['Free cancellation up to 48 hours', 'Complimentary breakfast', 'Pay at the hotel or online']

export function RoomBookingPanel({ room }: { room: Room }) {
  const navigate = useNavigate()
  const search = useBookingStore((s) => s.search)
  const setSearch = useBookingStore((s) => s.setSearch)
  const setCheckoutRoom = useCheckoutStore((s) => s.setRoom)
  const setCheckoutSearch = useCheckoutStore((s) => s.setSearch)
  const [openGuests, setOpenGuests] = useState(false)

  const valid = isValidRange(search.checkIn, search.checkOut)

  // 🔄 Real-time availability check — polls every 30 s
  const { available, availableUnits, isChecking } = useRoomAvailability({
    slug: room.slug,
    checkIn: search.checkIn,
    checkOut: search.checkOut,
  })

  const canBook = valid && available

  const book = () => {
    if (!canBook) return
    setCheckoutRoom(room)
    setCheckoutSearch(search)
    navigate('/booking/review')
  }

  return (
    <div className="border border-hairline bg-paper-soft/40 p-6 md:p-7">
      <RoomPrice pricePerNight={room.pricePerNight} search={valid ? search : null} detail />

      <div className="mt-6 space-y-4 border-t border-hairline pt-6">
        <DateSelector
          checkIn={search.checkIn}
          checkOut={search.checkOut}
          onChange={(checkIn, checkOut) => setSearch({ checkIn, checkOut })}
        />

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenGuests((v) => !v)}
            aria-expanded={openGuests}
            className="w-full border border-hairline bg-paper px-4 py-3 text-left text-sm text-ink transition-colors hover:border-ink focus:border-ink focus:outline-none"
          >
            <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-mute">
              <FaUserGroup className="h-3 w-3" /> Guests
            </span>
            <span className="mt-0.5 block">
              {search.adults} adult{search.adults === 1 ? '' : 's'} · {search.children} child{search.children === 1 ? '' : 'ren'} ·{' '}
              {search.rooms} room{search.rooms === 1 ? '' : 's'}
            </span>
          </button>
          {openGuests ? (
            <div className="absolute inset-x-0 top-full z-10 mt-2 bg-paper shadow-soft">
              <GuestSelector adults={search.adults} childCount={search.children} rooms={search.rooms} onChange={setSearch} />
            </div>
          ) : null}
        </div>
      </div>

      {/* ── Availability status banner ── */}
      {valid && (
        <div className="mt-4">
          {isChecking ? (
            <div className="flex items-center gap-2 rounded-sm border border-hairline bg-paper-soft px-4 py-2.5 text-xs text-ink-mute">
              <span className="h-3 w-3 animate-spin rounded-full border border-ink-mute border-t-transparent" />
              Checking availability…
            </div>
          ) : !available ? (
            <div className="rounded-sm border border-amber-300 bg-amber-50 px-4 py-3 text-sm" role="alert">
              <div className="flex items-start gap-2.5">
                <FaTriangleExclamation className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <div>
                  <p className="font-semibold text-amber-800">This room is fully booked for your selected dates.</p>
                  <p className="mt-0.5 text-xs text-amber-700">
                    All {room.units ?? 1} unit{(room.units ?? 1) > 1 ? 's' : ''} are taken. Try different dates or explore other rooms.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setSearch({ checkIn: '', checkOut: '' })}
                      className="text-xs font-semibold text-amber-700 underline underline-offset-2 hover:text-amber-900"
                    >
                      Change dates
                    </button>
                    <span className="text-amber-400">·</span>
                    <a href="/rooms" className="flex items-center gap-1 text-xs font-semibold text-amber-700 underline underline-offset-2 hover:text-amber-900">
                      Browse other rooms <FaArrowRight className="h-2.5 w-2.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : availableUnits <= 3 ? (
            <div className="flex items-center gap-2 rounded-sm border border-green-200 bg-green-50 px-4 py-2.5 text-xs font-medium text-green-800" role="status">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Only {availableUnits} unit{availableUnits > 1 ? 's' : ''} left — book now to secure your stay.
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-sm border border-green-200 bg-green-50 px-4 py-2.5 text-xs font-medium text-green-800" role="status">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Available for your dates
            </div>
          )}
        </div>
      )}

      <Button
        size="lg"
        className="mt-4 w-full"
        onClick={book}
        disabled={!canBook}
        aria-disabled={!canBook}
      >
        {!available && valid ? 'Unavailable for selected dates' : 'Book this room'}
      </Button>

      <ButtonLink to="/availability" variant="ghost" size="sm" className="mt-3 w-full">
        <FaCalendarDays className="h-3.5 w-3.5" /> Check availability
      </ButtonLink>

      {!valid ? (
        <p className="mt-3 text-center text-xs text-error">Choose valid dates to book this room.</p>
      ) : null}

      <ul className="mt-6 space-y-3 border-t border-hairline pt-6">
        {included.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-ink-mute">
            <FaCircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-bronze-deep" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}