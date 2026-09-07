import { Seo } from '../components/seo/Seo'
import { PageHeader } from '../components/shared/PageHeader'
import { Section } from '../components/shared/Section'

export function PrivacyPage() {
  return (
    <>
      <Seo title="Privacy Policy" description="How KEO Experience Hotel & Events handles your personal information." path="/privacy" />
      <PageHeader eyebrow="Legal" title="Privacy policy" />
      <Section className="py-0!">
        <div className="max-w-2xl space-y-6 py-16 text-sm leading-relaxed text-ink-mute">
          <p>
            KEO Experience Hotel &amp; Events respects your privacy. This policy explains what information
            we collect when you use this website and how we use it.
          </p>
          <h2 className="text-lg text-ink">Information we collect</h2>
          <p>
            When you make a booking or enquiry, we collect the details you provide — your name, email,
            phone number and any special requests. This information is used only to manage your
            reservation and communicate with you about your stay.
          </p>
          <h2 className="text-lg text-ink">Payment information</h2>
          <p>
            Payments are processed by our payment partners. We do not store your card details. Payment
            status is verified through our payment provider’s secure systems.
          </p>
          <h2 className="text-lg text-ink">How we use your information</h2>
          <p>
            We use your information to confirm bookings, provide the services you request, respond to
            enquiries, and improve our website. We do not sell your personal information to third
            parties.
          </p>
          <h2 className="text-lg text-ink">Contact</h2>
          <p>
            To access, correct or delete your personal information, contact us at
            booking@keoexperience.com or call +234 813 014 8920.
          </p>
        </div>
      </Section>
    </>
  )
}