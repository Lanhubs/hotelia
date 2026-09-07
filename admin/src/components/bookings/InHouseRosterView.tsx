import React from 'react';
import { BookingRecord } from '../../types/booking';
import { DisplayCurrency, formatMoney } from './bookingUtils';

interface InHouseRosterViewProps {
  bookings: BookingRecord[];
  displayCurrency: DisplayCurrency;
  onOpenDetails: (booking: BookingRecord) => void;
}

export const InHouseRosterView: React.FC<InHouseRosterViewProps> = ({
  bookings,
  displayCurrency,
  onOpenDetails,
}) => {
  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
      <div className="p-4 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-base font-bold text-zinc-900">In-House Resident Roster</h2>
          </div>
          <p className="text-xs text-zinc-400">
            All guests currently residing in suites, with active RFID keycards and open billing folios.
          </p>
        </div>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold">
          {bookings.length} Suites Occupied
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {bookings.map((b) => (
          <div
            key={b.id}
            onClick={() => onOpenDetails(b)}
            className="p-4 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 hover:bg-zinc-100/50 transition-all cursor-pointer space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={b.guest.avatar}
                  alt={b.guest.name}
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-zinc-200"
                />
                <div>
                  <h4 className="font-bold text-sm text-zinc-900">{b.guest.name}</h4>
                  <span className="text-xs text-ink font-semibold">
                    Room #{b.room.roomNumber} • {b.room.name}
                  </span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Keycard Active
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-zinc-200/70">
              <div>
                <span className="text-zinc-400 text-[10px] block">Checkout</span>
                <strong className="text-zinc-900 font-bold">{b.stay.checkOutDate}</strong>
              </div>
              <div>
                <span className="text-zinc-400 text-[10px] block">Folio Balance</span>
                <strong className={b.financials.balanceDue > 0 ? 'text-red-600 font-bold' : 'text-emerald-700 font-bold'}>
                  {formatMoney(b.financials.balanceDue, displayCurrency)}
                </strong>
              </div>
              <div className="text-right">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDetails(b);
                  }}
                  className="px-2.5 py-1 bg-white border border-zinc-200 rounded-lg text-xs font-bold hover:bg-zinc-50"
                >
                  Audit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};