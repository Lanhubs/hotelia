import { Section } from '../shared/Section'
import { ButtonLink } from '../shared/Button'

export function StayWithUs() {
  return (
    <Section dark>
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-bronze-soft">KEO Experience</p>
        <h2 className="mt-5 text-3xl font-light leading-tight text-paper md:text-5xl">
          Stay well.
          <br />
          Celebrate better.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-paper/60">
          Plan your stay, or start planning a celebration. Our team is ready to look after the details.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <ButtonLink to="/availability" variant="light" size="lg">
            Book your stay
          </ButtonLink>
          <ButtonLink to="/events" variant="outline" size="lg" className="border-paper/30 text-paper hover:bg-paper hover:text-ink">
            Plan an event
          </ButtonLink>
        </div>
      </div>
    </Section>
  )
}