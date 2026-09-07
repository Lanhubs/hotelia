import { useParams, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { FaPhone, FaEnvelope, FaLocationDot } from 'react-icons/fa6'
import { Seo } from '../components/seo/Seo'
import { PageHeader } from '../components/shared/PageHeader'
import { ButtonLink } from '../components/shared/Button'
import { useReservation } from '../hooks/useBooking'
import { useHotel } from '../hooks/useHotel'
import { useVerifyPaymentMutation, useInvalidateReservation } from '../hooks/usePayment'
import { useCheckoutStore } from '../stores/checkoutStore'
import { formatDateRange } from '../lib/dates'
import { formatNaira } from '../lib/money'
import { Skeleton } from '../components/shared/Skeleton'
import { ErrorState } from '../components/shared/ErrorState'
import { ConfirmationStatus, TransferNotice, NextSteps } from '../components/booking/ConfirmationBlocks'

export function ConfirmationPage() {
  const { reference: refParam } = useParams<{ reference: string }>()
  const [searchParams] = useSearchParams()
  const queryRef = searchParams.get('ref') || searchParams.get('reference') || searchParams.get('trxref')

  const storeBooking = useCheckoutStore((s) => s.booking)
  const storeReference = useCheckoutStore((s) => s.booking?.reference ?? '')
  const reference = refParam || queryRef || storeReference

  const verify = useVerifyPaymentMutation()
  const invalidate = useInvalidateReservation()

  useEffect(() => {
    if (queryRef) {
      verify.mutateAsync(queryRef).then(() => {
        if (reference) invalidate(reference)
      }).catch(() => {})
    }
  }, [queryRef])

  const { data: fetched, isLoading, isError } = useReservation(reference || null)
  const { data: hotel } = useHotel()

  const booking = fetched ?? storeBooking

  if (isLoading) {
    return (
      <div className="container-x py-20">
        <Skeleton className="mx-auto h-64 max-w-2xl" />
      </div>
    )
  }

  if (isError || !booking) {
    return (
      <div className="container-x py-20">
        <ErrorState
          title="Reservation not found"
          message="We couldn’t find a reservation for this reference. Check the reference and try again."
          actionLabel="Look up a reservation"
          actionTo="/reservation"
        />
      </div>
    )
  }

  const contact = hotel?.contact

  return (
    <>
      <Seo title="Booking Confirmation" description="Your reservation confirmation at KEO Experience Hotel." path="/booking/confirmation" />
      <PageHeader eyebrow="Booking" title="Reservation received" />

      <section className="container-x py-12">
        <div className="mx-auto max-w-2xl">
          <ConfirmationStatus booking={booking} />

          <div className="mt-8 space-y-6">
            <div className="border border-hairline bg-paper-soft/40 p-6">
              <dl className="grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase tracking-[0.14em] text-ink-mute">Reference</dt>
                  <dd className="mt-1 font-numeric text-lg font-semibold text-ink">{booking.reference}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.14em] text-ink-mute">Guest</dt>
                  <dd className="mt-1 font-medium text-ink">{booking.guest.fullName}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.14em] text-ink-mute">Room</dt>
                  <dd className="mt-1 font-medium text-ink">{booking.room.name}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.14em] text-ink-mute">Dates</dt>
                  <dd className="mt-1 font-medium text-ink">{formatDateRange(booking.stay.checkIn, booking.stay.checkOut)}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.14em] text-ink-mute">Guests</dt>
                  <dd className="mt-1 font-medium text-ink">
                    {booking.stay.adults} adult{booking.stay.adults === 1 ? '' : 's'}
                    {booking.stay.children ? ` · ${booking.stay.children} child${booking.stay.children === 1 ? '' : 'ren'}` : ''}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.14em] text-ink-mute">Total</dt>
                  <dd className="mt-1 font-numeric font-semibold text-ink">{formatNaira(booking.financials.totalAmount)}</dd>
                </div>
              </dl>
            </div>

            <TransferNotice booking={booking} />

            <NextSteps booking={booking} hotel={hotel} />

            <div className="border border-hairline p-6">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bronze-deep">Hotel contact</h2>
              <ul className="mt-4 space-y-3 text-sm text-ink-mute">
                <li className="flex items-center gap-3">
                  <FaPhone className="h-3.5 w-3.5 text-bronze-deep" /> {contact?.phoneDisplay ?? '+234 813 014 8920'}
                </li>
                <li className="flex items-center gap-3">
                  <FaEnvelope className="h-3.5 w-3.5 text-bronze-deep" /> {contact?.email ?? 'booking@keoexperience.com'}
                </li>
                <li className="flex items-start gap-3">
                  <FaLocationDot className="mt-0.5 h-3.5 w-3.5 shrink-0 text-bronze-deep" /> {contact?.address ?? '54, Pipeline Road, Off Offa Garage Road'}, {contact?.city ?? 'Ilorin, Kwara State'}
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap gap-4">
              <ButtonLink to={`/reservation/${booking.reference}/receipt`} variant="outline">
                View full receipt
              </ButtonLink>
              <ButtonLink to={`/reservation/${booking.reference}`} variant="ghost">
                Manage reservation
              </ButtonLink>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-ink-mute">
            Save your booking reference <span className="font-semibold text-ink">{booking.reference}</span> — you’ll need it to manage this reservation.
          </p>
        </div>
      </section>
    </>
  )
}