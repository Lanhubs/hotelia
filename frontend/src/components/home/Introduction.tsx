import { Link } from 'react-router-dom'
import { Section, SectionHeading } from '../shared/Section'
import { Reveal } from '../shared/Reveal'
import { ROOM_IMAGES } from '../../lib/images'

export function Introduction() {
  return (
    <Section>
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="relative">
            <img
              src={ROOM_IMAGES.courtyardPool}
              alt="The KEO Experience courtyard"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="max-w-xl">
            <SectionHeading
              eyebrow="Welcome to KEO"
              title="A place designed for comfort, celebration and quiet confidence."
            />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-mute">
              <p>
                KEO Experience is a boutique hotel and events destination in Ilorin. We built it around
                a simple idea: that a hotel should feel like more than a place to sleep. It should feel
                calm. Private. Considered.
              </p>
              <p>
                Stay in a room that gives you space to breathe. Eat well in the morning before the day
                begins. Gather with the people who matter, in a venue that looks after every detail.
              </p>
              <p>
                Wherever you are travelling for work, rest or celebration, KEO is a place to slow down
                and be well looked after.
              </p>
            </div>
            <Link to="/about" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-bronze underline-offset-4 transition-colors hover:text-bronze-deep">
              Our story
            </Link>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}