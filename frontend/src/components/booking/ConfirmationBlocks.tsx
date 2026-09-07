import { FaCircleCheck, FaCircleXmark, FaClock, FaHotel, FaBuildingColumns } from 'react-icons/fa6'
import type { Booking, HotelConfig } from '../../api/types'
import { formatNaira } from '../../lib/money'

export function ConfirmationStatus({ booking }: { booking: Booking }) {
  if (booking.paymentState === 'success') {
    return (
      <div className="flex items-center gap-3 text-bronze-deep">
        <FaCircleCheck className="h-6 w-6" />
        <p className="text-sm font-semibold uppercase tracking-[0.18em]">Payment verified · {booking.reference}</p>
      </div>
    )
  }
  if (booking.paymentState === 'pay_at_hotel') {
    return (
      <div className="flex items-center gap-3 text-bronze-deep">
        <FaHotel className="h-6 w-6" />
        <p className="text-sm font-semibold uppercase tracking-[0.18em]">
          Confirmed · pay at check-in{booking.financials.amountPaid > 0 ? ' · deposit received' : ''}
        </p>
      </div>
    )
  }
  if (booking.paymentMethod === 'transfer') {
    return (
      <div className="flex items-center gap-3 text-bronze-deep">
        <FaClock className="h-6 w-6" />
        <p className="text-sm font-semibold uppercase tracking-[0.18em]">Reservation received · awaiting transfer</p>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-3 text-error">
      <FaCircleXmark className="h-6 w-6" />
      <p className="text-sm font-semibold uppercase tracking-[0.18em]">Payment not yet received</p>
    </div>
  )
}

export function TransferNotice({ booking }: { booking: Booking }) {
  const t = booking.transferInstructions
  if (booking.paymentMethod !== 'transfer' || !t) return null
  return (
    <div className="border border-hairline">
      <div className="flex items-center gap-3 border-b border-hairline bg-paper-soft/40 p-5">
        <FaBuildingColumns className="h-5 w-5 text-bronze-deep" />
        <div>
          <p className="text-sm font-semibold text-ink">Transfer {formatNaira(t.amount)} to confirm your stay</p>
          <p className="text-xs text-ink-mute">via {t.provider} · we verify within minutes</p>
        </div>
      </div>
      <dl className="space-y-2 p-5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-ink-mute">Bank</dt>
          <dd className="text-right font-medium text-ink">{t.bankName}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink-mute">Account name</dt>
          <dd className="text-right font-medium text-ink">{t.accountName}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink-mute">Account number</dt>
          <dd className="font-numeric text-right font-medium text-ink">{t.accountNumber}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink-mute">Payment reference</dt>
          <dd className="font-numeric text-right font-medium text-ink">{t.reference}</dd>
        </div>
      </dl>
      <p className="px-5 pb-5 text-xs text-ink-mute">
        Use the payment reference as your transfer narration. Your reservation is confirmed once the transfer is verified.
      </p>
    </div>
  )
}

export function NextSteps({ booking, hotel }: { booking: Booking; hotel?: HotelConfig }) {
  const checkIn = hotel?.policies.checkInTime ?? '2:00 PM'
  let steps: string[]
  if (booking.paymentState === 'pay_at_hotel') {
    steps = [
      `Check-in is from ${checkIn}. Please bring a valid ID.`,
      booking.financials.amountPaid > 0
        ? `Your deposit of ${formatNaira(booking.financials.amountPaid)} has been received. The balance of ${formatNaira(booking.financials.balanceDue)} is due at check-in.`
        : `Settle ${formatNaira(booking.financials.balanceDue)} at check-in — card or cash accepted.`,
      `A confirmation has been sent to ${booking.guest.email}.`,
    ]
  } else if (booking.paymentMethod === 'transfer' && booking.paymentState !== 'success') {
    steps = [
      `Make the transfer above using your payment reference, then we’ll confirm your reservation within minutes.`,
      `Check-in is from ${checkIn}. Please bring a valid ID.`,
      `A confirmation has been sent to ${booking.guest.email}.`,
    ]
  } else {
    steps = [
      `Check-in is from ${checkIn}. Please bring a valid ID.`,
      `A confirmation has been sent to ${booking.guest.email}.`,
      `You can view or manage your reservation any time with your booking reference.`,
    ]
  }

  return (
    <div className="border border-hairline p-6">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bronze-deep">What happens next</h2>
      <ol className="mt-4 space-y-3 text-sm text-ink-mute">
        {steps.map((s, i) => (
          <li key={i}>
            {i + 1} · {s}
          </li>
        ))}
      </ol>
    </div>
  )
}