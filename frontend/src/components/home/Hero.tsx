import { BookingSearch } from '../booking/BookingSearch'
import { ROOM_IMAGES } from '../../lib/images'

export function Hero() {
  return (
    <section className="bg-ink">
      <div className="grid lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-16 text-paper md:px-12 md:py-20 lg:py-28">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-bronze-soft">
            KEO Experience · Ilorin
          </p>
          <h1 className="mt-5 max-w-xl text-4xl font-light leading-[1.05] tracking-tight md:text-5xl">
            Refined stays.
            <br />
            Remarkable events.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-paper/70">
            Stay beautifully. Celebrate meaningfully. A premium boutique hotel and event destination
            in the heart of Ilorin — built for comfort, privacy and the moments that matter.
          </p>
          <div className="mt-10">
            <BookingSearch />
          </div>
        </div>
        <div className="relative min-h-[320px] bg-paper-soft md:min-h-[420px] lg:min-h-[680px]">
          <img
            src={ROOM_IMAGES.livingBright}
            alt="KEO Experience hotel interior"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}