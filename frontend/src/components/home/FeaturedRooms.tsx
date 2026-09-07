import { Link } from 'react-router-dom'
import { Section, SectionHeading } from '../shared/Section'
import { RoomCard } from '../rooms/RoomCard'
import { ListSkeleton } from '../shared/Skeleton'
import { ErrorState } from '../shared/ErrorState'
import { Reveal } from '../shared/Reveal'
import { useRooms } from '../../hooks/useRooms'
import { useBookingStore } from '../../stores/bookingStore'

export function FeaturedRooms() {
  const { data, isLoading, isError } = useRooms()
  const search = useBookingStore((s) => s.search)

  return (
    <Section>
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <SectionHeading eyebrow="Stay" title="Rooms & suites for every kind of stay" />
        <Link to="/rooms" className="text-sm font-semibold text-ink underline decoration-bronze underline-offset-4 hover:text-bronze-deep">
          View all rooms
        </Link>
      </div>

      {isLoading ? (
        <ListSkeleton count={3} />
      ) : isError ? (
        <ErrorState
          message="We couldn’t load our rooms right now. Please try again in a moment."
          actionLabel="Try again"
          actionTo="/rooms"
        />
      ) : (
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {data?.slice(0, 3).map((room, i) => (
            <Reveal key={room.id} delay={i * 90}>
              <RoomCard room={room} search={search} />
            </Reveal>
          ))}
        </div>
      )}
    </Section>
  )
}