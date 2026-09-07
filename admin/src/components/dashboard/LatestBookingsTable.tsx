import React from 'react';
import { Link } from 'react-router-dom';
import { GripVertical, Globe, Store, ChevronRight } from 'lucide-react';
import { LatestBooking } from '../../data/dashboardData';
import { useBookingStore } from '../../stores/bookingStore';

interface LatestBookingsTableProps {
  bookings: LatestBooking[];
}

export const LatestBookingsTable: React.FC<LatestBookingsTableProps> = ({ bookings }) => {
  const { displayCurrency } = useBookingStore();

  const formatMoney = (amountUSD: number) => {
    if (displayCurrency === 'NGN') {
      return `₦${(amountUSD * 1600).toLocaleString()}`;
    }
    return `$${amountUSD.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <GripVertical className="w-4 h-4 text-zinc-400 cursor-grab" />
          <div>
            <h3 className="text-sm font-bold text-zinc-900">Latest Booking & Walk-In Stream</h3>
            <p className="text-[10px] text-zinc-400 font-normal">Real-time omnichannel arrivals stream</p>
          </div>
        </div>

        <Link
          to="/admin/reservations"
          className="text-xs font-semibold text-ink hover:text-indigo-700 flex items-center gap-0.5 cursor-pointer"
        >
          <span>View All Bookings</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAFBFD] text-zinc-400 text-[11px] font-semibold border-b border-zinc-100 uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-3">Booking ID</th>
              <th className="py-2.5 px-3">Guest</th>
              <th className="py-2.5 px-3">Channel Source</th>
              <th className="py-2.5 px-3">Stay Dates</th>
              <th className="py-2.5 px-3">Suite #</th>
              <th className="py-2.5 px-3 text-right">Settled Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {bookings.map((row, idx) => (
              <tr key={`${row.id}-${idx}`} className="hover:bg-zinc-50/70 transition-colors">
                <td className="py-3 px-3 font-mono font-semibold text-ink">
                  {row.id}
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={row.avatar}
                      alt={row.name}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-zinc-200"
                    />
                    <span className="font-semibold text-zinc-900">{row.name}</span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                      row.isOffline
                        ? 'bg-amber-50 text-amber-800 border border-amber-200/60'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                    }`}
                  >
                    {row.isOffline ? <Store className="w-3 h-3 text-amber-600" /> : <Globe className="w-3 h-3 text-indigo-600" />}
                    <span>{row.channel}</span>
                  </span>
                </td>
                <td className="py-3 px-3 text-zinc-600">{row.checkIn} → {row.checkOut}</td>
                <td className="py-3 px-3 font-medium text-zinc-800">{row.roomDesc}</td>
                <td className="py-3 px-3 text-right font-bold text-zinc-900">{formatMoney(row.amountUSD)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};