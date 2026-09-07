import React from 'react';
import { BookingRecord } from '../../../types/booking';

interface DrawerFolioTabProps {
  booking: BookingRecord;
  formatMoney: (val: number) => string;
  onOpenPaymentModal: () => void;
}

export const DrawerFolioTab: React.FC<DrawerFolioTabProps> = ({
  booking,
  formatMoney,
  onOpenPaymentModal,
}) => {
  return (
    <div className="space-y-5">
      <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Master Folio Invoice
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              booking.financials.paymentStatus === 'Paid'
                ? 'bg-emerald-100 text-emerald-800'
                : booking.financials.paymentStatus === 'Partial'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            Payment: {booking.financials.paymentStatus}
          </span>
        </div>

        <div className="space-y-2 text-xs divide-y divide-zinc-200/80 pt-1">
          <div className="flex justify-between py-1.5 text-zinc-700">
            <span>
              Room Accommodation ({booking.stay.nights} nights @ {formatMoney(booking.financials.ratePerNight)}/nt)
            </span>
            <span className="font-bold text-zinc-900">{formatMoney(booking.financials.roomTotal)}</span>
          </div>

          {booking.addons.map((addon) => (
            <div key={addon.id} className="flex justify-between py-1.5 text-zinc-700">
              <span>{addon.name} (x{addon.quantity})</span>
              <span className="font-bold text-zinc-900">{formatMoney(addon.price * addon.quantity)}</span>
            </div>
          ))}

          <div className="flex justify-between py-1.5 text-zinc-700">
            <span>State Lodging Tax & VAT (12%)</span>
            <span className="font-bold text-zinc-900">{formatMoney(booking.financials.taxAmount)}</span>
          </div>

          <div className="flex justify-between py-1.5 text-zinc-700">
            <span>Hospitality Service Fee</span>
            <span className="font-bold text-zinc-900">{formatMoney(booking.financials.serviceFee)}</span>
          </div>

          {booking.financials.discountAmount > 0 && (
            <div className="flex justify-between py-1.5 text-emerald-600 font-semibold">
              <span>VIP Promotional Discount</span>
              <span>-{formatMoney(booking.financials.discountAmount)}</span>
            </div>
          )}

          <div className="flex justify-between pt-2.5 text-sm font-black text-zinc-900">
            <span>Total Folio Amount</span>
            <span className="text-base text-ink">{formatMoney(booking.financials.totalAmount)}</span>
          </div>

          <div className="flex justify-between py-2 text-xs font-semibold">
            <span className="text-zinc-600">Amount Paid ({booking.financials.paymentMethod})</span>
            <span className="text-emerald-700 font-bold">{formatMoney(booking.financials.amountPaid)}</span>
          </div>

          <div className="flex justify-between py-2 text-xs font-semibold">
            <span className="text-zinc-600">Outstanding Balance Due</span>
            <span className={`font-bold ${booking.financials.balanceDue > 0 ? 'text-red-600' : 'text-zinc-500'}`}>
              {formatMoney(booking.financials.balanceDue)}
            </span>
          </div>
        </div>
      </div>

      {booking.financials.balanceDue > 0 && (
        <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold text-amber-900">Outstanding Balance at Desk</h4>
            <p className="text-[11px] text-amber-700">
              Collect remaining {formatMoney(booking.financials.balanceDue)} via cash, card, or transfer.
            </p>
          </div>
          <button
            onClick={onOpenPaymentModal}
            className="px-4 py-2 rounded-xl bg-ink text-white text-xs font-bold hover:bg-[#4338CA] shadow-xs cursor-pointer"
          >
            Collect Payment
          </button>
        </div>
      )}
    </div>
  );
};
