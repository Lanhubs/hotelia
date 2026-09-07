import { Seo } from '../components/seo/Seo'
import { PageHeader } from '../components/shared/PageHeader'
import { BookingSearch } from '../components/booking/BookingSearch'
import { AvailabilityCard } from '../components/booking/AvailabilityCard'
import { ListSkeleton } from '../components/shared/Skeleton'
import { ErrorState } from '../components/shared/ErrorState'
import { useBookingStore } from '../stores/bookingStore'
import { useAvailability } from '../hooks/useAvailability'
import { isValidRange, formatDateRange } from '../lib/dates'
import { ButtonLink } from '../components/shared/Button'

export function AvailabilityPage() {
  const search = useBookingStore((s) => s.search)
  const valid = isValidRange(search.checkIn, search.checkOut)
  const { data, isLoading, isError } = useAvailability(valid ? search : null)

  return (
    <>
      <Seo
        title="Check Availability"
        description="Search available rooms at KEO Experience Hotel, Ilorin. See nightly rates and totals before you book."
        path="/availability"
      />
      <PageHeader
        eyebrow="Book"
        title="Check availability"
        description="Choose your dates and guest details to see what’s available for your stay."
      />

      <section className="container-x py-10">
        <div className="mb-10 max-w-3xl">
          <BookingSearch />
        </div>

        {valid ? (
          <div>
            <p className="mb-6 text-sm text-ink-mute">
              Showing availability for <span className="font-semibold text-ink">{formatDateRange(search.checkIn, search.checkOut)}</span>
            </p>

            {isLoading ? (
              <ListSkeleton count={3} card={AvailabilityCardSkeleton} />
            ) : isError ? (
              <ErrorState
                message="We couldn’t check availability right now. Please try again in a moment."
                actionLabel="Try again"
                actionTo="/availability"
              />
            ) : data && data.length > 0 ? (
              <div className="space-y-6">
                {data.map((item) => (
                  <AvailabilityCard key={item.room.id} item={item} search={search} />
                ))}
              </div>
            ) : (
              <ErrorState
                title="No rooms are available for these dates"
                message="Try different dates, reduce your guest count, or explore another room category."
                actionLabel="Browse all rooms"
                actionTo="/rooms"
              />
            )}
          </div>
        ) : (
          <div className="border border-hairline bg-paper-soft/50 p-8">
            <p className="text-sm text-ink-mute">Select a check-in and check-out date to see availability.</p>
            <div className="mt-4">
              <ButtonLink to="/rooms" variant="outline">Browse rooms instead</ButtonLink>
            </div>
          </div>
        )}
      </section>
    </>
  )
}

function AvailabilityCardSkeleton() {
  return (
    <div className="animate-pulse border border-hairline bg-paper p-5">
      <div className="grid gap-6 md:grid-cols-[2fr_3fr]">
        <div className="aspect-[4/3] bg-ink/8" />
        <div className="space-y-3">
          <div className="h-4 w-1/3 bg-ink/8" />
          <div className="h-6 w-2/3 bg-ink/8" />
          <div className="h-3 w-full bg-ink/8" />
          <div className="h-3 w-1/2 bg-ink/8" />
        </div>
      </div>
    </div>
  )
}