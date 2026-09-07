import { Seo } from '../components/seo/Seo'
import { PageHeader } from '../components/shared/PageHeader'
import { Section, SectionHeading } from '../components/shared/Section'
import { Reveal } from '../components/shared/Reveal'
import { ButtonLink } from '../components/shared/Button'
import { useHotel } from '../hooks/useHotel'
import { ROOM_IMAGES } from '../lib/images'

export function AboutPage() {
  const { data: hotel } = useHotel()
  const contact = hotel?.contact

  return (
    <>
      <Seo
        title="About KEO Experience"
        description="KEO Experience is a boutique hotel and event destination in Ilorin, Kwara State — built on comfort, privacy and thoughtful hospitality."
        path="/about"
      />
      <PageHeader
        eyebrow="About"
        title="KEO Experience Hotel & Events"
        description="A boutique hotel and event destination in Ilorin, built on a simple belief: that hospitality should feel calm, personal and considered."
      />

      <Section className="py-0!">
        <div className="grid items-center gap-12 py-16 md:py-20 lg:grid-cols-2">
          <div className="aspect-[4/3] overflow-hidden bg-paper-soft lg:aspect-auto lg:h-[28rem]">
            <img src={ROOM_IMAGES.livingLounge} alt="Inside the KEO Experience lounge" className="h-full w-full object-cover" />
          </div>
          <Reveal delay={100}>
            <SectionHeading eyebrow="Our story" title="Comfort, privacy and the moments that matter" />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-mute">
              <p>
                KEO Experience began with a straightforward ambition: to offer Ilorin a hotel that felt
                personal. Not a conveyor of check-ins, but a place where guests are genuinely looked after —
                where the room is comfortable, the breakfast is warm, and the welcome is real.
              </p>
              <p>
                Over time, that ambition grew to include events. Weddings, corporate days, family
                celebrations. The same care that goes into a room goes into an occasion — the space, the
                pacing, the details that let you simply enjoy the moment.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="bg-paper-soft!">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { title: 'Comfort', text: 'Rooms and apartments designed for rest — quiet, private, and made for real sleep.' },
            { title: 'Hospitality', text: 'A team that treats every guest as a person, not a booking number.' },
            { title: 'Moments', text: 'From a calm breakfast to a full celebration, we help good moments happen well.' },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 80}>
              <div className="border-t-2 border-bronze pt-5">
                <h2 className="text-xl">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-mute">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Where we are" title="In Ilorin, easy to reach" />
            <p className="mt-4 max-w-md text-base leading-relaxed text-ink-mute">
              {contact?.address ?? '54, Pipeline Road, Off Offa Garage Road'}.
              <br />
              {contact?.city ?? 'Ilorin, Kwara State, Nigeria'}
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <ButtonLink to="/contact">Contact us</ButtonLink>
              <ButtonLink to="/availability" variant="outline">Plan your stay</ButtonLink>
            </div>
          </div>
          <div className="aspect-[4/3] overflow-hidden bg-paper-soft">
            <img src={ROOM_IMAGES.courtyardPool} alt="The KEO Experience courtyard" loading="lazy" className="h-full w-full object-cover" />
          </div>
        </div>
      </Section>
    </>
  )
}