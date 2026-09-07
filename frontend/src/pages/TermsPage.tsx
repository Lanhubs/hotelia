import { Seo } from '../components/seo/Seo'
import { PageHeader } from '../components/shared/PageHeader'
import { Section } from '../components/shared/Section'

export function TermsPage() {
  return (
    <>
      <Seo title="Terms & Conditions" description="Terms and conditions for bookings at KEO Experience Hotel & Events." path="/terms" />
      <PageHeader eyebrow="Legal" title="Terms & conditions" />
      <Section className="py-0!">
        <div className="max-w-2xl space-y-6 py-16 text-sm leading-relaxed text-ink-mute">
          <h2 className="text-lg text-ink">Bookings</h2>
          <p>
            A reservation is confirmed once payment is verified by our payment provider. We will send a
            confirmation with your booking reference to the email address you provide.
          </p>
          <h2 className="text-lg text-ink">Payment</h2>
          <p>
            Prices are shown in Nigerian Naira (₦). All applicable taxes and fees are included in your
            final total. Payment is collected securely through our payment partners.
          </p>
          <h2 className="text-lg text-ink">Cancellation</h2>
          <p>
            Cancellation terms are shown at the time of booking and in our booking policies. Refunds, where
            applicable, are processed to the original payment method.
          </p>
          <h2 className="text-lg text-ink">Conduct</h2>
          <p>
            Guests are asked to respect other guests and the property. The hotel may decline or terminate a
            stay in the event of behaviour that disturbs other guests or damages property.
          </p>
          <h2 className="text-lg text-ink">Liability</h2>
          <p>
            While we take every care with your belongings and comfort, the hotel is not liable for loss or
            damage to personal property, except where required by law.
          </p>
        </div>
      </Section>
    </>
  )
}