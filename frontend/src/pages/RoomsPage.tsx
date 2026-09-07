import { useState } from 'react'
import { Seo } from '../components/seo/Seo'
import { PageHeader } from '../components/shared/PageHeader'
import { RoomCard } from '../components/rooms/RoomCard'
import { ListSkeleton } from '../components/shared/Skeleton'
import { ErrorState } from '../components/shared/ErrorState'
import { cn } from '../lib/cn'
import { useRooms } from '../hooks/useRooms'
import { useBookingStore } from '../stores/bookingStore'
import { CATEGORIES } from '../lib/financials'

type SortOrder = 'price_asc' | 'price_desc'

export function RoomsPage() {
  const { data, isLoading, isError } = useRooms()
  const search = useBookingStore((s) => s.search)
  const [category, setCategory] = useState<string>('All')
  const [sort, setSort] = useState<SortOrder>('price_asc')

  const rooms =
    data
      ?.filter((room) => category === 'All' || room.category === category)
      .sort((a, b) =>
        sort === 'price_asc' ? a.pricePerNight - b.pricePerNight : b.pricePerNight - a.pricePerNight,
      ) ?? []

  return (
    <>
      <Seo
        title="Rooms & Suites"
        description="Explore rooms and apartments at KEO Experience Hotel — KEO Premium, KEO Luxury, Deluxe, Executive and Exclusive apartments. Book your stay in Ilorin."
        path="/rooms"
      />
      <PageHeader
        eyebrow="Stay"
        title="Rooms & suites"
        description="A considered collection of rooms and apartments — each designed for rest, privacy and comfort, with breakfast included every morning."
      />

      <section className="container-x py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-6">
          <div className="flex flex-wrap gap-2">
            {['All', ...CATEGORIES].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={cn(
                  'border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors',
                  category === c ? 'border-ink bg-ink text-paper' : 'border-hairline text-ink-mute hover:border-ink',
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-xs text-ink-mute">
            <span className="uppercase tracking-[0.14em]">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOrder)}
              className="border border-hairline bg-transparent px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none"
            >
              <option value="price_asc">Price · low to high</option>
              <option value="price_desc">Price · high to low</option>
            </select>
          </label>
        </div>

        <div className="mt-12">
          {isLoading ? (
            <ListSkeleton count={3} />
          ) : isError ? (
            <ErrorState
              message="We couldn’t load our rooms right now. Please try again in a moment."
              actionLabel="Back to home"
              actionTo="/"
            />
          ) : rooms.length === 0 ? (
            <ErrorState
              title="No rooms in this category"
              message="Try another room type, or browse the full collection."
              actionLabel="View all rooms"
              actionTo="/rooms"
            />
          ) : (
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} search={search} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}