import { Seo } from '../components/seo/Seo'
import { CheckoutLayout } from '../components/booking/CheckoutLayout'
import { useCheckoutStore } from '../stores/checkoutStore'
import { ButtonLink } from '../components/shared/Button'
import { formatDateRange, nightsBetween } from '../lib/dates'
import { formatNaira } from '../lib/money'
import { computeFinancials } from '../lib/financials'

export function ReviewStepPage() {
  const room = useCheckoutStore((s) => s.room)
  const search = useCheckoutStore((s) => s.search)

  if (!room || !search) return null
  const nights = nightsBetween(search.checkIn, search.checkOut)
  const fin = computeFinancials(room, search, [])

  return (
    <>
      <Seo title="Review your stay" description="Review your stay at KEO Experience before booking." path="/booking/review" />
      <CheckoutLayout step="Review">
        <div>
          <h1 className="text-3xl font-light">Review your stay</h1>
          <p className="mt-2 text-sm text-ink-mute">Confirm the details of your reservation before continuing.</p>

          <div className="mt-8 space-y-6">
            <div className="border border-hairline bg-paper-soft/40 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img src={room.image} alt="" className="h-20 w-28 object-cover" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-bronze-deep">{room.category}</p>
                    <p className="text-xl font-medium text-ink">{room.name}</p>
                    <p className="text-sm text-ink-mute">{formatDateRange(search.checkIn, search.checkOut)}</p>
                  </div>
                </div>
                <ButtonLink to="/rooms" variant="outline" size="sm">
                  Change room
                </ButtonLink>
              </div>
            </div>

            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-mute">Nights</dt>
                <dd className="text-ink">{nights}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-mute">Guests</dt>
                <dd className="text-ink">
                  {search.adults} adult{search.adults === 1 ? '' : 's'}
                  {search.children ? ` · ${search.children} child${search.children === 1 ? '' : 'ren'}` : ''} · {search.rooms} room{search.rooms === 1 ? '' : 's'}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-mute">Nightly rate</dt>
                <dd className="font-numeric text-ink">{formatNaira(room.pricePerNight)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-mute">Estimated taxes &amp; fees</dt>
                <dd className="font-numeric text-ink">{formatNaira(fin.taxAmount)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-hairline pt-3">
                <dt className="font-semibold text-ink">Total estimate</dt>
                <dd className="font-numeric text-lg font-semibold text-ink">{formatNaira(fin.totalAmount)}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6">
            <p className="text-xs text-ink-mute">
              You can still change your dates below. Your selection is remembered.
            </p>
            <div className="flex gap-3">
              <ButtonLink to="/availability" variant="outline">
                Change dates
              </ButtonLink>
              <ButtonLink to="/booking/guest">Continue</ButtonLink>
            </div>
          </div>
        </div>
      </CheckoutLayout>
    </>
  )
}