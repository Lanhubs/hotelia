import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaCircleCheck, FaUserGroup, FaCalendarDays } from 'react-icons/fa6'
import type { Room } from '../../api/types'
import { DateSelector } from '../booking/DateSelector'
import { GuestSelector } from '../booking/GuestSelector'
import { RoomPrice } from './RoomPrice'
import { Button, ButtonLink } from '../shared/Button'
import { useBookingStore } from '../../stores/bookingStore'
import { isValidRange } from '../../lib/dates'

const included = ['Free cancellation up to 48 hours', 'Complimentary breakfast', 'Pay at the hotel or online']

export function RoomBookingPanel({ room }: { room: Room }) {
  const navigate = useNavigate()
  const search = useBookingStore((s) => s.search)
  const setSearch = useBookingStore((s) => s.setSearch)
  const [openGuests, setOpenGuests] = useState(false)
  const valid = isValidRange(search.checkIn, search.checkOut)

  const book = () => {
    if (!valid) return
    navigate('/booking/review')
  }

  return (
    <div className="border border-hairline bg-paper-soft/40 p-6 md:p-7">
      <RoomPrice pricePerNight={room.pricePerNight} search={valid ? search : null} detail />

      <div className="mt-6 space-y-4 border-t border-hairline pt-6">
        <DateSelector checkIn={search.checkIn} checkOut={search.checkOut} onChange={(checkIn, checkOut) => setSearch({ checkIn, checkOut })} />

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

      <Button size="lg" className="mt-6 w-full" onClick={book} disabled={!valid}>
        Book this room
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