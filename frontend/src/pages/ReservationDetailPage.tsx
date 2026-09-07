import { useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { FaCircleCheck, FaCircleXmark } from 'react-icons/fa6'
import { Seo } from '../components/seo/Seo'
import { PageHeader } from '../components/shared/PageHeader'
import { Skeleton } from '../components/shared/Skeleton'
import { ErrorState } from '../components/shared/ErrorState'
import { StayPanel, GuestPanel, PaymentPanel, ManagePanel, HotelPanel } from '../components/reservation/ReservationPanels'
import { useReservation, useCancelReservation } from '../hooks/useBooking'
import { useConfirmTransfer, useInvalidateReservation } from '../hooks/usePayment'
import { useHotel } from '../hooks/useHotel'
import { formatNaira } from '../lib/money'
import { isMock } from '../config'

export function ReservationDetailPage() {
  const { reference = '' } = useParams<{ reference: string }>()
  const [params] = useSearchParams()
  const { data, isLoading, isError } = useReservation(reference, params.get('email') ?? undefined, params.get('phone') ?? undefined)
  const { data: hotel } = useHotel()
  const cancel = useCancelReservation()
  const confirmTransfer = useConfirmTransfer()
  const invalidate = useInvalidateReservation()
  const [confirming, setConfirming] = useState(false)
  const [simulateBusy, setSimulateBusy] = useState(false)

  if (isLoading) {
    return (
      <div className="container-x py-20">
        <Skeleton className="mx-auto h-80 max-w-3xl" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="container-x py-20">
        <ErrorState
          title="Reservation not found"
          message="We couldn’t find a reservation for this reference. Double-check the reference and your email or phone."
          actionLabel="Try again"
          actionTo="/reservation"
        />
      </div>
    )
  }

  const paid = data.paymentState === 'success'

  const handleCancel = async () => {
    if (!confirming) {
      setConfirming(true)
      return
    }
    await cancel.mutateAsync(reference)
    setConfirming(false)
  }

  const handleSimulateTransfer = async () => {
    setSimulateBusy(true)
    try {
      await confirmTransfer.mutateAsync(reference)
      invalidate(reference)
    } finally {
      setSimulateBusy(false)
    }
  }

  return (
    <>
      <Seo title={`Reservation ${data.reference}`} description="Your reservation details at KEO Experience Hotel." path={`/reservation/${reference}`} />
      <PageHeader eyebrow="Reservation" title={`Reservation ${data.reference}`} />

      <section className="container-x py-12">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border border-hairline bg-paper-soft/40 p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-ink-mute">Status</p>
              <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-ink">
                {data.status === 'Cancelled' ? (
                  <>
                    <FaCircleXmark className="h-4 w-4 text-error" /> Cancelled
                  </>
                ) : paid ? (
                  <>
                    <FaCircleCheck className="h-4 w-4 text-bronze-deep" /> Confirmed · Paid
                  </>
                ) : (
                  <>
                    <FaCircleXmark className="h-4 w-4 text-error" /> Pending payment
                  </>
                )}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.14em] text-ink-mute">Total</p>
              <p className="font-numeric text-2xl font-semibold text-ink">{formatNaira(data.financials.totalAmount)}</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <StayPanel booking={data} />
            <GuestPanel booking={data} />
          </div>

          <PaymentPanel booking={data} />

          <ManagePanel
            booking={data}
            policy={hotel?.policies.cancellation}
            confirming={confirming}
            onToggleConfirm={() => setConfirming((v) => !v)}
            onCancel={handleCancel}
            cancelPending={cancel.isPending}
            onSimulateTransfer={isMock() && data.paymentMethod === 'transfer' && data.paymentState !== 'success' ? handleSimulateTransfer : undefined}
            simulateBusy={simulateBusy}
          />

          <HotelPanel contact={hotel?.contact} />

          <div className="text-center">
            <Link to="/reservation" className="text-sm font-semibold text-ink underline decoration-bronze underline-offset-4 hover:text-bronze-deep">
              Look up another reservation
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}