import { Link } from 'react-router-dom'
import { FaBed, FaUtensils, FaChampagneGlasses, FaMugHot, FaUsers, FaSpa } from 'react-icons/fa6'
import { Section, SectionHeading } from '../shared/Section'
import { Reveal } from '../shared/Reveal'

const pillars = [
  {
    icon: FaBed,
    title: 'Stay',
    text: 'Rooms and apartments with space to rest, work and simply be.',
    href: '/rooms',
  },
  {
    icon: FaUtensils,
    title: 'Dine',
    text: 'Fresh meals, a calm breakfast and the comforts of our kitchen.',
    href: '/services/restaurant',
  },
  {
    icon: FaChampagneGlasses,
    title: 'Celebrate',
    text: 'Weddings and celebrations hosted with care, start to finish.',
    href: '/events',
  },
  {
    icon: FaMugHot,
    title: 'Relax',
    text: 'Quiet corners, the courtyard and time to unwind on your terms.',
    href: '/experience',
  },
  {
    icon: FaUsers,
    title: 'Meet',
    text: 'Focused space and support for meetings, workshops and corporate days.',
    href: '/events/corporate-events',
  },
  {
    icon: FaSpa,
    title: 'Experience',
    text: 'The full KEO stay — hospitality that looks after every detail.',
    href: '/experience',
  },
]

export function ExperienceSection() {
  return (
    <Section dark>
      <SectionHeading
        eyebrow="The KEO experience"
        title="More than a room — a place to be well looked after"
        dark
      />
      <ul className="mt-14 grid gap-px bg-paper/10 sm:grid-cols-2 lg:grid-cols-3">
        {pillars.map((p, i) => (
          <Reveal key={p.title} delay={i * 70}>
            <li className="group bg-ink p-8 transition-colors hover:bg-ink-soft">
              <p.icon className="h-6 w-6 text-bronze-soft" />
              <h3 className="mt-5 text-xl font-light text-paper">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-paper/60">{p.text}</p>
              <Link
                to={p.href}
                className="mt-5 inline-block text-xs font-semibold uppercase tracking-[0.18em] text-bronze-soft underline-offset-4 group-hover:underline"
              >
                Explore
              </Link>
            </li>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}