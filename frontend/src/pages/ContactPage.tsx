import { FaPhone, FaEnvelope, FaLocationDot, FaClock } from 'react-icons/fa6'
import { Seo } from '../components/seo/Seo'
import { PageHeader } from '../components/shared/PageHeader'
import { Section } from '../components/shared/Section'
import { ContactForm } from '../components/contact/ContactForm'
import { MapSection } from '../components/shared/MapSection'
import { useHotel } from '../hooks/useHotel'

export function ContactPage() {
  const { data: hotel } = useHotel()
  const contact = hotel?.contact
  const policies = hotel?.policies

  return (
    <>
      <Seo
        title="Contact"
        description="Contact KEO Experience Hotel & Events in Ilorin. Call +234 813 014 8920, email booking@keoexperience.com, or visit 54 Pipeline Road, Off Offa Garage Road."
        path="/contact"
      />
      <PageHeader
        eyebrow="Contact"
        title="We’d love to hear from you"
        description="Booking questions, event enquiries or anything else — reach out and our team will take care of you."
      />

      <Section className="py-0!">
        <div className="grid gap-12 py-16 md:py-20 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl">Send us a message</h2>
            <p className="mt-2 text-sm text-ink-mute">
              We usually respond within a few hours during the day.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <div>
            <h2 className="text-2xl">Reach us directly</h2>
            <ul className="mt-6 space-y-5 text-sm">
              <li className="flex items-start gap-4">
                <FaPhone className="mt-0.5 h-4 w-4 shrink-0 text-bronze-deep" />
                <div>
                  <p className="font-semibold text-ink">Reservations &amp; support</p>
                  <a href={`tel:${contact?.phone ?? '+2348130148920'}`} className="text-ink-mute hover:text-bronze-deep">
                    {contact?.phoneDisplay ?? '+234 813 014 8920'}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <FaEnvelope className="mt-0.5 h-4 w-4 shrink-0 text-bronze-deep" />
                <div>
                  <p className="font-semibold text-ink">Email</p>
                  <a href={`mailto:${contact?.email ?? 'booking@keoexperience.com'}`} className="text-ink-mute hover:text-bronze-deep">
                    {contact?.email ?? 'booking@keoexperience.com'}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <FaLocationDot className="mt-0.5 h-4 w-4 shrink-0 text-bronze-deep" />
                <div>
                  <p className="font-semibold text-ink">Address</p>
                  <p className="text-ink-mute">
                    {contact?.address ?? '54, Pipeline Road, Off Offa Garage Road'}
                    <br />
                    {contact?.city ?? 'Ilorin, Kwara State, Nigeria'}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <FaClock className="mt-0.5 h-4 w-4 shrink-0 text-bronze-deep" />
                <div>
                  <p className="font-semibold text-ink">Front desk</p>
                  <p className="text-ink-mute">Open 24 hours, every day. Check-in from {policies?.checkInTime ?? '2:00 PM'}.</p>
                </div>
              </li>
            </ul>

            <div className="mt-10">
              <MapSection query={contact?.mapsQuery ?? 'KEO Experience Hotel Ilorin'} />
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}