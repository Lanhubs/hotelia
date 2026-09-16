import { Seo } from '../components/seo/Seo'
import { CheckoutLayout } from '../components/booking/CheckoutLayout'
import { useCheckoutStore } from '../stores/checkoutStore'
import { ButtonLink, Button } from '../components/shared/Button'
import { formatDateRange, nightsBetween } from '../lib/dates'
import { formatNaira } from '../lib/money'
import { computeFinancials } from '../lib/financials'
import { useRoomAvailability } from '../hooks/useRoomAvailability'
import { FaTriangleExclamation, FaArrowRight } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'

export function ReviewStepPage() {
  const navigate = useNavigate()
  const room = useCheckoutStore((s) => s.room)
  const search = useCheckoutStore((s) => s.search)

  // Re-check availability right here before the guest can continue to payment
  const { available, availableUnits, isChecking } = useRoomAvailability({
    slug: room?.slug ?? '',
    checkIn: search?.checkIn ?? '',
    checkOut: search?.checkOut ?? '',
    refetchInterval: 20_000, // tighter poll on the review step
  })

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

            {/* ── Live availability status ── */}
            {isChecking ? (
              <div className="flex items-center gap-2 rounded-sm border border-hairline bg-paper-soft px-4 py-3 text-xs text-ink-mute">
                <span className="h-3 w-3 animate-spin rounded-full border border-ink-mute border-t-transparent" />
                Verifying room availability…
              </div>
            ) : !available ? (
              <div className="rounded-sm border border-amber-300 bg-amber-50 px-4 py-4" role="alert">
                <div className="flex items-start gap-3">
                  <FaTriangleExclamation className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                  <div>
                    <p className="font-semibold text-amber-800">Room no longer available</p>
                    <p className="mt-1 text-sm text-amber-700">
                      All units for <strong>{room.name}</strong> have been booked for your selected dates.
                      Please choose different dates or select another room.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <ButtonLink to="/availability" variant="outline" size="sm">
                        Change dates
                      </ButtonLink>
                      <ButtonLink to="/rooms" size="sm">
                        Browse rooms <FaArrowRight className="ml-1 h-3 w-3" />
                      </ButtonLink>
                    </div>
                  </div>
                </div>
              </div>
            ) : availableUnits <= 3 ? (
              <div className="flex items-center gap-2 rounded-sm border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-medium text-amber-800">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Only {availableUnits} unit{availableUnits > 1 ? 's' : ''} left — don't wait too long!
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-sm border border-green-200 bg-green-50 px-4 py-2.5 text-xs font-medium text-green-800">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Room is available for your dates
              </div>
            )}

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
              {available ? (
                <ButtonLink to="/booking/guest">Continue</ButtonLink>
              ) : (
                <Button disabled aria-disabled="true">
                  Room unavailable
                </Button>
              )}
            </div>
          </div>
        </div>
      </CheckoutLayout>
    </>
  )
}