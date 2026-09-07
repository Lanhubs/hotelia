import { Seo } from '../components/seo/Seo'
import { PageHeader } from '../components/shared/PageHeader'
import { Section } from '../components/shared/Section'
import { useHotel } from '../hooks/useHotel'
import { Skeleton } from '../components/shared/Skeleton'

const policyRows = [
  { key: 'checkInTime', title: 'Check-in & check-out' },
  { key: 'cancellation', title: 'Cancellation' },
  { key: 'payment', title: 'Payment' },
  { key: 'children', title: 'Children' },
  { key: 'guests', title: 'Guests' },
  { key: 'pets', title: 'Pets' },
] as const

export function PoliciesPage() {
  const { data: hotel, isLoading } = useHotel()
  const policies = hotel?.policies

  return (
    <>
      <Seo title="Booking Policies" description="Booking policies for KEO Experience Hotel & Events — check-in, cancellation, payment and more." path="/policies" />
      <PageHeader
        eyebrow="Hotel"
        title="Booking policies"
        description="Clear, straightforward policies so you always know where you stand. These can be updated by the hotel at any time."
      />

      <Section className="py-0!">
        <div className="max-w-3xl py-16 md:py-20">
          {isLoading ? (
            <div className="space-y-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : (
            <dl className="divide-y divide-hairline border-y border-hairline">
              {policyRows.map((row) => (
                <div key={row.key} className="grid gap-2 py-6 sm:grid-cols-[10rem_1fr]">
                  <dt className="text-sm font-semibold text-ink">{row.title}</dt>
                  <dd className="text-sm leading-relaxed text-ink-mute">
                    {policies?.[row.key] ?? 'Please contact the hotel for details on this policy.'}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-10 border border-hairline bg-paper-soft/50 p-6">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bronze-deep">Questions?</h2>
            <p className="mt-2 text-sm text-ink-mute">
              If anything is unclear, our team is happy to help before you book.
            </p>
            <p className="mt-3 text-sm">
              Call <a href="tel:+2348130148920" className="font-semibold text-ink underline decoration-bronze underline-offset-4">+234 813 014 8920</a> or email{' '}
              <a href="mailto:booking@keoexperience.com" className="font-semibold text-ink underline decoration-bronze underline-offset-4">booking@keoexperience.com</a>.
            </p>
          </div>
        </div>
      </Section>
    </>
  )
}