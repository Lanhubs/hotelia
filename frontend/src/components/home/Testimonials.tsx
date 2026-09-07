import { Section, SectionHeading } from '../shared/Section'
import { Skeleton } from '../shared/Skeleton'
import { useHotel } from '../../hooks/useHotel'
import { Reveal } from '../shared/Reveal'

export function Testimonials() {
  const { data, isLoading } = useHotel()

  if (isLoading) {
    return (
      <Section>
        <SectionHeading eyebrow="Guests" title="Notes from our guests" align="center" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full" />
          ))}
        </div>
      </Section>
    )
  }

  const testimonials = data?.testimonials ?? []
  if (testimonials.length === 0) return null

  return (
    <Section className="bg-paper-soft!">
      <SectionHeading eyebrow="Guests" title="Notes from our guests" align="center" />
      <div className="mx-auto mt-12 grid max-w-5xl gap-px bg-hairline md:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.id} delay={i * 80}>
            <figure className="flex h-full flex-col justify-between gap-6 bg-paper p-8">
              <blockquote className="text-base leading-relaxed text-ink">“{t.text}”</blockquote>
              <figcaption className="border-t border-hairline pt-4">
                <p className="text-sm font-semibold text-ink">{t.name}</p>
                <p className="text-xs text-ink-mute">{t.role}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}