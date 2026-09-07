import { Link, useParams } from 'react-router-dom'
import { Seo } from '../components/seo/Seo'
import { RoomGallery } from '../components/rooms/RoomGallery'
import { QuickFacts } from '../components/rooms/QuickFacts'
import { AmenityList } from '../components/rooms/AmenityList'
import { RoomHighlights } from '../components/rooms/RoomHighlights'
import { GoodToKnow } from '../components/rooms/GoodToKnow'
import { RoomBookingPanel } from '../components/rooms/RoomBookingPanel'
import { RoomCard } from '../components/rooms/RoomCard'
import { ErrorState } from '../components/shared/ErrorState'
import { Skeleton } from '../components/shared/Skeleton'
import { useRoom, useRooms } from '../hooks/useRooms'
import { useBookingStore } from '../stores/bookingStore'
import { formatNaira } from '../lib/money'

export function RoomDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: room, isLoading, isError } = useRoom(slug ?? '')
  const { data: allRooms } = useRooms()
  const search = useBookingStore((s) => s.search)

  if (isLoading) {
    return (
      <div className="container-x py-12">
        <Skeleton className="aspect-[16/9] w-full" />
        <div className="mt-10 grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (isError || !room) {
    return (
      <div className="container-x py-20">
        <ErrorState
          title="Room not found"
          message="We couldn’t find that room. Explore our full collection instead."
          actionLabel="View all rooms"
          actionTo="/rooms"
        />
      </div>
    )
  }

  const related = allRooms?.filter((r) => r.id !== room.id).slice(0, 3) ?? []
  const bandImage = room.gallery[1] ?? room.image

  return (
    <>
      <Seo
        title={room.name}
        description={`${room.name} at KEO Experience Hotel, Ilorin — ${room.tagline}. From ${formatNaira(room.pricePerNight)} per night with breakfast included.`}
        path={`/rooms/${room.slug}`}
      />

      <section className="container-x py-10 md:py-14">
        <nav className="text-xs text-ink-mute">
          <Link to="/rooms" className="hover:text-bronze-deep">Rooms</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{room.name}</span>
        </nav>

        <div className="mt-8">
          <RoomGallery images={[room.image, ...room.gallery]} alt={room.name} />

          <div className="mt-10 grid gap-8 lg:grid-cols-[2fr_1fr] lg:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bronze-deep">{room.category}</p>
              <h1 className="mt-2 text-4xl font-light leading-tight md:text-5xl">{room.name}</h1>
              <p className="mt-3 text-lg font-light text-ink-mute">{room.tagline}</p>
            </div>
            <QuickFacts room={room} />
          </div>
        </div>
      </section>

      <section className="border-t border-hairline bg-paper-soft/30">
        <div className="container-x py-14 md:py-16">
          <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-14">
              <div className="max-w-2xl space-y-5 text-base leading-relaxed text-ink-mute">
                <p>{room.overview}</p>
                <p>{room.description}</p>
              </div>

              <RoomHighlights features={room.features} />

              <div>
                <h2 className="text-2xl">Amenities &amp; comforts</h2>
                <AmenityList amenities={room.amenities} grid className="mt-6" />
              </div>

              <figure>
                <div className="aspect-[16/8] overflow-hidden bg-paper-soft">
                  <img src={bandImage} alt={`Inside ${room.name}`} loading="lazy" className="h-full w-full object-cover" />
                </div>
                <figcaption className="mt-3 text-xs uppercase tracking-[0.16em] text-ink-mute">
                  {room.name} — {room.tagline}
                </figcaption>
              </figure>

              <GoodToKnow />
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <RoomBookingPanel room={room} />
            </aside>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="border-t border-hairline bg-paper-soft/50">
          <div className="container-x py-16">
            <h2 className="text-2xl">Other rooms you may like</h2>
            <div className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <RoomCard key={r.id} room={r} search={search} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}