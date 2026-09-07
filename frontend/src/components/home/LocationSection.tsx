import { FaLocationDot, FaPhone, FaEnvelope } from 'react-icons/fa6'
import { Section } from '../shared/Section'
import { ButtonLink } from '../shared/Button'
import { useHotel } from '../../hooks/useHotel'
import { ROOM_IMAGES } from '../../lib/images'

export function LocationSection() {
  const { data: hotel } = useHotel()
  const contact = hotel?.contact

  return (
    <Section className="py-0!">
      <div className="grid lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-16 md:px-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bronze-deep">Location</p>
          <h2 className="mt-4 text-3xl md:text-4xl">In the heart of Ilorin</h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink-mute">
            {contact?.address ?? '54, Pipeline Road, Off Offa Garage Road'}.
            <br />
            {contact?.city ?? 'Ilorin, Kwara State, Nigeria'}
          </p>
          <div className="mt-8 space-y-3 text-sm">
            <a href={`tel:${contact?.phone ?? '+2348130148920'}`} className="flex items-center gap-3 text-ink hover:text-bronze-deep">
              <FaPhone className="h-4 w-4 text-bronze-deep" />
              {contact?.phoneDisplay ?? '+234 813 014 8920'}
            </a>
            <a href={`mailto:${contact?.email ?? 'booking@keoexperience.com'}`} className="flex items-center gap-3 text-ink hover:text-bronze-deep">
              <FaEnvelope className="h-4 w-4 text-bronze-deep" />
              {contact?.email ?? 'booking@keoexperience.com'}
            </a>
          </div>
          <div className="mt-8">
            <ButtonLink
              to="https://www.google.com/maps/search/?api=1&query=KEO+Experience+Hotel+Ilorin"
              variant="outline"
            >
              <FaLocationDot className="h-4 w-4" />
              Directions
            </ButtonLink>
          </div>
        </div>
        <div className="relative min-h-[320px] bg-paper-soft">
          <img
            src={ROOM_IMAGES.lobbyLounge}
            alt="KEO Experience exterior and lounge"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </Section>
  )
}