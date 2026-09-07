import { useParams, useSearchParams, Link } from 'react-router-dom'
import { FaArrowLeft, FaPrint } from 'react-icons/fa6'
import { Seo } from '../components/seo/Seo'
import { Receipt } from '../components/reservation/Receipt'
import { Skeleton } from '../components/shared/Skeleton'
import { ErrorState } from '../components/shared/ErrorState'
import { useReservation } from '../hooks/useBooking'
import { useHotel } from '../hooks/useHotel'
import { useCheckoutStore } from '../stores/checkoutStore'

export function ReceiptPage() {
  const { reference = '' } = useParams<{ reference: string }>()
  const [params] = useSearchParams()
  const storeBooking = useCheckoutStore((s) => s.booking)
  const { data: fetched, isLoading, isError } = useReservation(
    reference,
    params.get('email') ?? undefined,
    params.get('phone') ?? undefined,
  )
  const { data: hotel } = useHotel()

  const booking = fetched ?? (storeBooking?.reference === reference ? storeBooking : undefined)

  if (isLoading) {
    return (
      <div className="container-x py-20">
        <Skeleton className="mx-auto h-[600px] max-w-3xl" />
      </div>
    )
  }

  if (isError || !booking) {
    return (
      <div className="container-x py-20">
        <ErrorState
          title="Receipt not found"
          message="We couldn’t find a receipt for this reference. Check the reference and try again."
          actionLabel="Look up a reservation"
          actionTo="/reservation"
        />
      </div>
    )
  }

  return (
    <>
      <Seo title={`Receipt ${booking.reference}`} description="Receipt for your reservation at KEO Experience Hotel." path={`/reservation/${reference}/receipt`} />
      <section className="container-x py-10 md:py-14">
        <div className="no-print mx-auto mb-6 flex max-w-3xl flex-wrap items-center justify-between gap-4">
          <Link
            to={`/reservation/${booking.reference}`}
            className="flex items-center gap-2 text-sm font-semibold text-ink underline decoration-bronze underline-offset-4 hover:text-bronze-deep"
          >
            <FaArrowLeft className="h-3.5 w-3.5" /> Back to reservation
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 border border-ink px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            <FaPrint className="h-3.5 w-3.5" /> Print / save as PDF
          </button>
        </div>
        <Receipt booking={booking} hotel={hotel} />
      </section>
    </>
  )
}