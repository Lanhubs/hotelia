import React from 'react';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';
import { Reservation } from '../../types';

interface ReservationsLedgerProps {
  reservations: Reservation[];
  onNewWalkIn: () => void;
}

const GRID_TEMPLATE =
  'grid-cols-[1.1fr_1.6fr_1.3fr_1.3fr_1fr_0.9fr_0.9fr]';

export const ReservationsLedger: React.FC<ReservationsLedgerProps> = ({
  reservations,
  onNewWalkIn,
}) => {
  return (
    <div className="bg-white border border-zinc-200/80 rounded-3xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="p-5 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-zinc-900">Master Reservations & Folios</h2>
          <p className="text-xs text-zinc-400">All registered guests, room stays, and billing statuses</p>
        </div>
        <button
          onClick={onNewWalkIn}
          className="px-4 py-2 bg-[#E86E15] text-white rounded-xl text-xs font-bold hover:bg-[#d05f0d] shadow-xs"
        >
          + New Walk-In Booking
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="w-full text-left text-xs text-zinc-600">
          {/* Header Row */}
          <div
            className={`grid ${GRID_TEMPLATE} bg-[#FAFBFD] text-zinc-400 border-b border-zinc-100 uppercase text-[10px] font-bold tracking-wider`}
          >
            <div className="py-3.5 px-5">Folio / Code</div>
            <div className="py-3.5 px-5">Guest Name</div>
            <div className="py-3.5 px-5">Room / Villa</div>
            <div className="py-3.5 px-5">Stay Dates</div>
            <div className="py-3.5 px-5">Status</div>
            <div className="py-3.5 px-5">Total Paid</div>
            <div className="py-3.5 px-5">Tier</div>
          </div>

          {/* Data Rows */}
          <div className="divide-y divide-zinc-100">
            {reservations.map((res) => (
              <div key={res.id} className={`grid ${GRID_TEMPLATE} hover:bg-zinc-50/70 transition-colors`}>
                <div className="py-4 px-5 font-mono font-bold text-zinc-900">
                  {res.confirmationCode}
                </div>
                <div className="py-4 px-5">
                  <div className="font-bold text-zinc-900">{res.guestName}</div>
                  <div className="text-[11px] text-zinc-400">{res.guestEmail}</div>
                </div>
                <div className="py-4 px-5">
                  <span className="font-semibold text-zinc-800">{res.roomType}</span>
                  <div className="text-[11px] text-[#E86E15] font-semibold">Room #{res.roomNumber}</div>
                </div>
                <div className="py-4 px-5">
                  <div className="flex items-center gap-1.5 text-zinc-700 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{res.checkIn} → {res.checkOut}</span>
                  </div>
                </div>
                <div className="py-4 px-5">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                      res.status === 'Checked In'
                        ? 'bg-emerald-50 text-emerald-600'
                        : res.status === 'Confirmed'
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    {res.status === 'Checked In' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {res.status}
                  </span>
                </div>
                <div className="py-4 px-5 font-bold text-zinc-900">
                  ${res.totalAmount.toLocaleString()}
                </div>
                <div className="py-4 px-5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-[#E86E15] border border-orange-100">
                    {res.vipTier || 'VIP Diamond'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};