import React from 'react';
import { Eye, KeyRound } from 'lucide-react';
import { BookingRecord, BookingStatus } from '../../types/booking';
import { DisplayCurrency, formatMoney, getChannelBadge, getStatusBadge } from './bookingUtils';

interface BookingTableViewProps {
  bookings: BookingRecord[];
  displayCurrency: DisplayCurrency;
  onOpenDetails: (booking: BookingRecord) => void;
  onQuickStatusToggle: (e: React.MouseEvent, bookingId: string, currentStatus: BookingStatus) => void;
  onResetFilters: () => void;
}

const GRID_TEMPLATE =
  'grid-cols-[1fr_1.5fr_1.2fr_1.1fr_1.1fr_0.9fr_0.8fr_0.7fr_1.1fr]';

export const BookingTableView: React.FC<BookingTableViewProps> = ({
  bookings,
  displayCurrency,
  onOpenDetails,
  onQuickStatusToggle,
  onResetFilters,
}) => {
  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="p-4 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-zinc-900">Reservations & Folio Ledger</h2>
          <p className="text-xs text-zinc-400">
            Click any record to inspect room assignment, settle folio payments, or program RFID keys.
          </p>
        </div>
        <div className="text-xs font-semibold text-zinc-500">
          Showing <strong className="text-zinc-900 font-black">{bookings.length}</strong> active folios
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-zinc-700">No reservations match your active filters.</p>
          <button
            onClick={onResetFilters}
            className="px-4 py-2 bg-ink text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="w-full text-left text-xs text-zinc-600">
            {/* Header Row */}
            <div
              className={`grid ${GRID_TEMPLATE} bg-[#FAFBFD] text-zinc-400 border-b border-zinc-100 uppercase text-[10px] font-bold tracking-wider`}
            >
              <div className="py-3 px-4">Folio / Code</div>
              <div className="py-3 px-4">Guest Profile</div>
              <div className="py-3 px-4">Origin Channel</div>
              <div className="py-3 px-4">Suite / Room</div>
              <div className="py-3 px-4">Stay Duration</div>
              <div className="py-3 px-4">Status</div>
              <div className="py-3 px-4">Folio Total</div>
              <div className="py-3 px-4">Keycard</div>
              <div className="py-3 px-4 text-right">Actions</div>
            </div>

            {/* Data Rows */}
            <div className="divide-y divide-zinc-100">
              {bookings?.map((b) => (
                <div
                  key={b.id}
                  onClick={() => onOpenDetails(b)}
                  className={`grid ${GRID_TEMPLATE} hover:bg-zinc-50/80 transition-colors cursor-pointer group`}
                >
                  {/* Folio / Code */}
                  <div className="py-3.5 px-4 font-mono font-bold text-zinc-900">
                    <span className="text-ink font-black">{b.id}</span>
                    <div className="text-[10px] text-zinc-400 font-normal">{b.folioNumber}</div>
                  </div>

                  {/* Guest Name & Avatar */}
                  <div className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={b.guest?.avatar}
                        alt={b.guest?.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-200 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-zinc-900 group-hover:text-ink transition-colors">
                          {b.guest?.name}
                        </div>
                        <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                          <span className="font-semibold text-indigo-600">{b.guest?.vipTier} VIP</span>
                          <span>•</span>
                          <span>{b.guest?.nationality}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Origin Channel */}
                  <div className="py-3.5 px-4">
                    {getChannelBadge(b.channel, b.channelLabel, b.channelCategory)}
                  </div>

                  {/* Room & Number */}
                  <div className="py-3.5 px-4">
                    <div className="font-bold text-zinc-800 truncate max-w-[160px]">
                      {b.room?.name}
                    </div>
                    <div className="text-[11px] font-semibold text-ink">
                      Room #{b.room?.roomNumber} (Fl {b.room?.floor})
                    </div>
                  </div>

                  {/* Stay Dates */}
                  <div className="py-3.5 px-4">
                    <div className="font-semibold text-zinc-800">
                      {b.stay?.checkInDate} → {b.stay?.checkOutDate}
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      {b.stay?.nights} Nights • {b.stay?.adults} Guests
                    </div>
                  </div>

                  {/* Status */}
                  <div className="py-3.5 px-4">
                    {getStatusBadge(b?.status)}
                  </div>

                  {/* Total / Balance */}
                  <div className="py-3.5 px-4">
                    <div className="font-black text-zinc-900">
                      {formatMoney(b.financials?.totalAmount, displayCurrency)}
                    </div>
                    <div className="text-[10px]">
                      {b.financials?.balanceDue > 0 ? (
                        <span className="text-red-600 font-bold">
                          Due: {formatMoney(b.financials?.balanceDue, displayCurrency)}
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-medium">Settled</span>
                      )}
                    </div>
                  </div>

                  {/* Keycard */}
                  <div className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        b.keycard?.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-zinc-100 text-zinc-500'
                      }`}
                    >
                      <KeyRound className="w-3 h-3" />
                      <span>{b.keycard?.status}</span>
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {b.status === 'Confirmed' && (
                        <button
                          type="button"
                          onClick={(e) => onQuickStatusToggle(e, b.id, b.status)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
                          title="Perform Instant Check-In"
                        >
                          Check In
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDetails(b);
                        }}
                        className="px-2.5 py-1 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-bold transition-all shadow-2xs group-hover:border-ink/40 group-hover:text-ink inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Review</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};