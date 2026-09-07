import type { Booking, HotelConfig } from '../../api/types'
import { formatDateRange, formatDateTime } from '../../lib/dates'
import { formatNaira } from '../../lib/money'
import { paymentMethodLabel } from '../../lib/payments'

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5 text-sm">
      <span className="text-ink-mute">{label}</span>
      <span className={`text-right font-numeric ${strong ? 'text-base font-semibold text-ink' : 'text-ink'}`}>{value}</span>
    </div>
  )
}

function SectionTitle({ children }: { children: string }) {
  return <h2 className="mt-7 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-mute">{children}</h2>
}

export function Receipt({ booking, hotel }: { booking: Booking; hotel?: HotelConfig }) {
  const f = booking.financials
  const contact = hotel?.contact
  const issuedAt = booking.paidAt ?? booking.createdAt

  return (
    <div className="receipt-sheet mx-auto max-w-3xl border border-hairline bg-white p-8 text-ink md:p-12">
      <div className="flex flex-wrap items-start justify-between gap-6 border-b border-ink pb-6">
        <div>
          <p className="font-display text-3xl font-semibold tracking-[0.18em]">KEO</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-mute">Experience Hotel &amp; Events</p>
          <p className="mt-4 max-w-xs text-xs leading-relaxed text-ink-mute">
            {contact?.address ?? '54, Pipeline Road, Off Offa Garage Road'}
            <br />
            {contact?.city ?? 'Ilorin, Kwara State, Nigeria'}
            <br />
            {contact?.phoneDisplay ?? '+234 813 014 8920'} · {contact?.email ?? 'booking@keoexperience.com'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ink-mute">Official receipt</p>
          <p className="mt-2 font-numeric text-2xl font-semibold text-ink">{booking.reference}</p>
          <p className="mt-1 text-xs text-ink-mute">Issued {formatDateTime(issuedAt)}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink">
          {booking.status === 'Cancelled' ? 'Cancelled' : booking.status === 'Confirmed' ? 'Confirmed' : 'Pending'}
        </p>
        <p className="text-sm text-ink-mute">{paymentMethodLabel(booking)}</p>
      </div>

      <SectionTitle>Guest</SectionTitle>
      <div className="mt-3 grid gap-1 text-sm">
        <p className="font-medium text-ink">{booking.guest.fullName}</p>
        <p className="text-ink-mute">{booking.guest.email}</p>
        <p className="text-ink-mute">{booking.guest.phone}</p>
      </div>

      <SectionTitle>Stay</SectionTitle>
      <div className="mt-3 grid gap-1 text-sm">
        <p className="font-medium text-ink">
          {booking.room.name} · {booking.room.category}
        </p>
        <p className="text-ink-mute">{formatDateRange(booking.stay.checkIn, booking.stay.checkOut)}</p>
        <p className="text-ink-mute">
          {booking.stay.adults} adult{booking.stay.adults === 1 ? '' : 's'}
          {booking.stay.children ? ` · ${booking.stay.children} child${booking.stay.children === 1 ? '' : 'ren'}` : ''} ·{' '}
          {booking.stay.rooms} room{booking.stay.rooms === 1 ? '' : 's'}
        </p>
      </div>

      {booking.extras.length > 0 ? (
        <>
          <SectionTitle>Extras</SectionTitle>
          <div className="mt-2">
            {booking.extras.map((e) => (
              <div key={e.id} className="flex items-baseline justify-between gap-4 py-1 text-sm">
                <span className="text-ink">{e.name}</span>
                <span className="font-numeric text-ink">{e.price > 0 ? formatNaira(e.price) : 'Included'}</span>
              </div>
            ))}
          </div>
        </>
      ) : null}

      <SectionTitle>Charges</SectionTitle>
      <div className="mt-3 border-t border-hairline pt-3">
        <Row label={`Room · ${f.nights} night${f.nights === 1 ? '' : 's'}`} value={formatNaira(f.roomTotal)} />
        {f.extrasTotal > 0 ? <Row label="Extras" value={formatNaira(f.extrasTotal)} /> : null}
        <Row label="Taxes &amp; fees" value={formatNaira(f.taxAmount)} />
        <div className="border-t border-hairline pt-3">
          <Row label="Total" value={formatNaira(f.totalAmount)} strong />
        </div>
        <Row label="Amount paid" value={formatNaira(f.amountPaid)} />
        {f.depositAmount > 0 ? <Row label="Deposit received" value={formatNaira(f.depositAmount)} /> : null}
        <Row label="Balance due" value={formatNaira(f.balanceDue)} />
      </div>

      {booking.paymentMethod === 'transfer' && booking.transferInstructions ? (
        <>
          <SectionTitle>Transfer details</SectionTitle>
          <div className="mt-3 border border-hairline p-4 text-sm">
            <Row label="Bank" value={booking.transferInstructions.bankName} />
            <Row label="Account name" value={booking.transferInstructions.accountName} />
            <Row label="Account number" value={booking.transferInstructions.accountNumber} />
            <Row label="Payment reference" value={booking.transferInstructions.reference} />
          </div>
        </>
      ) : null}

      <div className="mt-10 border-t border-hairline pt-6">
        <p className="text-center text-sm text-ink-mute">
          Thank you for choosing KEO Experience Hotel &amp; Events. We look forward to welcoming you.
        </p>
        <p className="mt-2 text-center text-xs text-ink-mute">
          For enquiries, call {contact?.phoneDisplay ?? '+234 813 014 8920'} or email {contact?.email ?? 'booking@keoexperience.com'}.
        </p>
      </div>
    </div>
  )
}