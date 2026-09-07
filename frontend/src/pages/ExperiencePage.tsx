import { Seo } from '../components/seo/Seo'
import { PageHeader } from '../components/shared/PageHeader'
import { Section, SectionHeading } from '../components/shared/Section'
import { Reveal } from '../components/shared/Reveal'
import { ButtonLink } from '../components/shared/Button'
import { ROOM_IMAGES, img } from '../lib/images'

const chapters = [
  {
    title: 'Stay',
    text: 'Rooms and apartments that give you space to rest, work and breathe. Quiet corridors, comfortable beds and everything you need for a calm, private stay.',
    image: ROOM_IMAGES.bedroomSuite,
    href: '/rooms',
    cta: 'Explore rooms',
  },
  {
    title: 'Dine',
    text: 'Breakfast in the courtyard, warm meals through the day and a lounge for unhurried conversation. Food that feels made for you, not for a crowd.',
    image: img('photo-1504674900247-0877df9cc836'),
    href: '/services/restaurant',
    cta: 'Dining at KEO',
  },
  {
    title: 'Celebrate',
    text: 'Weddings, anniversaries and family occasions, hosted with care from the first meeting to the last guest. Our team carries the details so you can be present.',
    image: ROOM_IMAGES.eventWedding,
    href: '/events',
    cta: 'Plan an event',
  },
  {
    title: 'Relax',
    text: 'The courtyard, the lounge and the quiet corners of the property — places to slow down, read, sit with someone you love, or simply be still.',
    image: ROOM_IMAGES.courtyardPool,
    href: '/gallery',
    cta: 'See the spaces',
  },
  {
    title: 'Connect',
    text: 'Meetings, workshops and corporate days in focused, comfortable spaces, supported by our events team and high-speed WiFi throughout.',
    image: img('photo-1540575467063-178a50c2df87'),
    href: '/events/corporate-events',
    cta: 'Meeting spaces',
  },
]

export function ExperiencePage() {
  return (
    <>
      <Seo
        title="The KEO Experience"
        description="Stay, dine, celebrate, relax and connect at KEO Experience Hotel & Events in Ilorin — refined hospitality for every kind of moment."
        path="/experience"
      />
      <PageHeader
        eyebrow="Experience"
        title="More than a place to sleep"
        description="KEO is a place to stay, dine, relax, celebrate, meet and host. Here is what that feels like."
      />

      <Section className="py-0!">
        <div className="divide-y divide-hairline">
          {chapters.map((chapter, i) => (
            <Reveal key={chapter.title}>
              <div className="grid items-center gap-10 py-16 md:py-20 lg:grid-cols-2">
                <div className={`aspect-[4/3] overflow-hidden bg-paper-soft lg:aspect-auto lg:h-[26rem] ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <img src={chapter.image} alt={chapter.title} loading="lazy" className="h-full w-full object-cover" />
                </div>
                <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                  <SectionHeading eyebrow={String(i + 1).padStart(2, '0')} title={chapter.title} />
                  <p className="mt-4 max-w-md text-base leading-relaxed text-ink-mute">{chapter.text}</p>
                  <div className="mt-6 flex flex-wrap gap-4">
                    <ButtonLink to={chapter.href} variant="outline">
                      {chapter.cta}
                    </ButtonLink>
                    {i === 0 ? <ButtonLink to="/availability">Book your stay</ButtonLink> : null}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section dark>
        <SectionHeading
          eyebrow="Begin"
          title="Your stay at KEO starts with a simple booking"
          dark
          align="center"
        />
        <div className="mt-10 text-center">
          <ButtonLink to="/availability" variant="light" size="lg">
            Check availability
          </ButtonLink>
        </div>
        <p className="mt-4 text-center text-sm text-paper/60">
          Or call us on{' '}
          <a href="tel:+2348130148920" className="text-bronze-soft underline underline-offset-4">
            +234 813 014 8920
          </a>
        </p>
      </Section>
    </>
  )
}