import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { DateSelector } from './DateSelector'
import { GuestSelector } from './GuestSelector'
import { useBookingStore } from '../../stores/bookingStore'
import { Button } from '../shared/Button'
import { isValidRange } from '../../lib/dates'

export function BookingSearch() {
  const navigate = useNavigate()
  const search = useBookingStore((s) => s.search)
  const setSearch = useBookingStore((s) => s.setSearch)
  const [openGuests, setOpenGuests] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidRange(search.checkIn, search.checkOut)) return
    navigate('/availability')
  }

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-3xl border border-hairline bg-paper p-6 shadow-card md:p-8"
      aria-label="Check availability"
    >
      <div className="space-y-6">
        <DateSelector
          checkIn={search.checkIn}
          checkOut={search.checkOut}
          onChange={(checkIn, checkOut) => setSearch({ checkIn, checkOut })}
        />

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenGuests((v) => !v)}
            className="w-full border border-hairline px-4 py-3 text-left text-sm text-ink hover:border-ink focus:outline-none focus:border-ink"
            aria-expanded={openGuests}
          >
            <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-mute">Guests</span>
            <span className="mt-0.5 block">
              {search.adults} adult{search.adults === 1 ? '' : 's'} · {search.children} child
              {search.children === 1 ? '' : 'ren'} · {search.rooms} room{search.rooms === 1 ? '' : 's'}
            </span>
          </button>
          {openGuests ? (
            <div className="absolute inset-x-0 top-full z-10 mt-2 bg-paper shadow-soft">
              <GuestSelector
                adults={search.adults}
                childCount={search.children}
                rooms={search.rooms}
                onChange={setSearch}
              />
            </div>
          ) : null}
        </div>
      </div>

      <Button type="submit" size="lg" className="mt-6 w-full">
        <FaMagnifyingGlass className="h-3.5 w-3.5" />
        Search Availability
      </Button>
    </form>
  )
}