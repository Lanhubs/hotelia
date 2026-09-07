import { FaPhone, FaEnvelope, FaLocationDot } from 'react-icons/fa6'
import type { Booking } from '../../api/types'
import type { Contact } from '../../api/types'
import { Button, ButtonLink } from '../shared/Button'
import { formatDateRange } from '../../lib/dates'
import { formatNaira } from '../../lib/money'
import { paymentMethodLabel } from '../../lib/payments'

export function StayPanel({ booking }: { booking: Booking }) {
  return (
    <div className="border border-hairline p-6">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bronze-deep">Stay</h2>
      <div className="mt-4 flex items-center gap-4">
        <img src={booking.room.image} alt="" className="h-16 w-20 object-cover" />
        <div>
          <p className="font-semibold text-ink">{booking.room.name}</p>
          <p className="text-xs text-ink-mute">{booking.room.category}</p>
        </div>
      </div>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-ink-mute">Dates</dt>
          <dd className="text-right text-ink">{formatDateRange(booking.stay.checkIn, booking.stay.checkOut)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink-mute">Guests</dt>
          <dd className="text-ink">
            {booking.stay.adults} adult{booking.stay.adults === 1 ? '' : 's'}
            {booking.stay.children ? ` · ${booking.stay.children} child${booking.stay.children === 1 ? '' : 'ren'}` : ''}
          </dd>
        </div>
      </dl>
    </div>
  )
}

export function GuestPanel({ booking }: { booking: Booking }) {
  return (
    <div className="border border-hairline p-6">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bronze-deep">Guest</h2>
      <p className="mt-4 font-medium text-ink">{booking.guest.fullName}</p>
      <p className="mt-1 text-sm text-ink-mute">{booking.guest.email}</p>
      <p className="mt-1 text-sm text-ink-mute">{booking.guest.phone}</p>
      {booking.guest.specialRequest ? (
        <p className="mt-4 border-t border-hairline pt-3 text-sm text-ink-mute">
          <span className="text-ink">Special request:</span> {booking.guest.specialRequest}
        </p>
      ) : null}
    </div>
  )
}

export function PaymentPanel({ booking }: { booking: Booking }) {
  return (
    <div className="border border-hairline p-6">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bronze-deep">Payment</h2>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-ink-mute">Method</dt>
          <dd className="text-ink">{paymentMethodLabel(booking)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink-mute">Room</dt>
          <dd className="font-numeric text-ink">{formatNaira(booking.financials.roomTotal)}</dd>
        </div>
        {booking.financials.extrasTotal > 0 ? (
          <div className="flex justify-between gap-4">
            <dt className="text-ink-mute">Extras</dt>
            <dd className="font-numeric text-ink">{formatNaira(booking.financials.extrasTotal)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <dt className="text-ink-mute">Taxes &amp; fees</dt>
          <dd className="font-numeric text-ink">{formatNaira(booking.financials.taxAmount)}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-hairline pt-3">
          <dt className="text-ink-mute">Amount paid</dt>
          <dd className="font-numeric text-ink">{formatNaira(booking.financials.amountPaid)}</dd>
        </div>
        {booking.financials.depositAmount > 0 ? (
          <div className="flex justify-between gap-4">
            <dt className="text-ink-mute">Deposit received</dt>
            <dd className="font-numeric text-ink">{formatNaira(booking.financials.depositAmount)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <dt className="text-ink-mute">Balance due</dt>
          <dd className="font-numeric text-ink">{formatNaira(booking.financials.balanceDue)}</dd>
        </div>
        {booking.transferInstructions ? (
          <div className="mt-3 space-y-1 border-t border-hairline pt-3 text-xs text-ink-mute">
            <p className="flex justify-between gap-4">
              <span>Bank</span>
              <span className="text-ink">{booking.transferInstructions.bankName}</span>
            </p>
            <p className="flex justify-between gap-4">
              <span>Account</span>
              <span className="font-numeric text-ink">{booking.transferInstructions.accountNumber}</span>
            </p>
            <p className="flex justify-between gap-4">
              <span>Reference</span>
              <span className="font-numeric text-ink">{booking.transferInstructions.reference}</span>
            </p>
          </div>
        ) : null}
      </dl>
    </div>
  )
}

export function ManagePanel({
  booking,
  policy,
  confirming,
  onToggleConfirm,
  onCancel,
  cancelPending,
  onSimulateTransfer,
  simulateBusy,
}: {
  booking: Booking
  policy?: string
  confirming: boolean
  onToggleConfirm: () => void
  onCancel: () => void
  cancelPending: boolean
  onSimulateTransfer?: () => void
  simulateBusy?: boolean
}) {
  if (booking.status === 'Cancelled') {
    return (
      <div className="border border-hairline bg-paper-soft/50 p-6">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bronze-deep">Cancelled</h2>
        <p className="mt-2 text-sm text-ink-mute">
          This reservation has been cancelled. The room has been released for other guests. Please contact the hotel if you need anything else.
        </p>
      </div>
    )
  }

  const transferPending = booking.paymentMethod === 'transfer' && booking.paymentState !== 'success'

  return (
    <div className="border border-hairline p-6">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bronze-deep">Manage this reservation</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <ButtonLink to={`/reservation/${booking.reference}/receipt`} variant="outline">Download receipt</ButtonLink>
        <ButtonLink to={`/reservation/${booking.reference}`} variant="outline">View reservation</ButtonLink>
        <ButtonLink to="/contact" variant="outline">Contact hotel</ButtonLink>
      </div>
      {transferPending && onSimulateTransfer ? (
        <div className="mt-5 border-t border-hairline pt-5">
          <Button variant="outline" onClick={onSimulateTransfer} disabled={simulateBusy}>
            {simulateBusy ? 'Verifying…' : 'Simulate transfer received (demo)'}
          </Button>
          <p className="mt-2 text-xs text-ink-mute">Demo-only. In production the hotel confirms your transfer.</p>
        </div>
      ) : null}
      <div className="mt-5 border-t border-hairline pt-5">
        {confirming ? (
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-ink-mute">Cancelling will release your room. Are you sure?</p>
            <Button variant="outline" className="border-error text-error" onClick={onCancel} disabled={cancelPending}>
              {cancelPending ? 'Cancelling…' : 'Yes, cancel'}
            </Button>
            <Button variant="ghost" onClick={onToggleConfirm}>
              Keep reservation
            </Button>
          </div>
        ) : (
          <Button variant="ghost" className="text-error" onClick={onToggleConfirm}>
            Cancel reservation
          </Button>
        )}
      </div>
      {policy ? <p className="mt-4 text-xs text-ink-mute">{policy}</p> : null}
    </div>
  )
}

export function HotelPanel({ contact }: { contact?: Contact }) {
  return (
    <div className="border border-hairline bg-paper-soft/40 p-6">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bronze-deep">Hotel</h2>
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
  )
}