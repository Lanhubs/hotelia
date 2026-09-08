import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Store, 
  Globe, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Eye, 
  KeyRound, 
  ArrowRight 
} from 'lucide-react';
import { BookingRecord } from '../../types/booking';
import { AccommodationRoom } from '../../data/accommodationData';
import { useBookingStore } from '../../stores/bookingStore';

interface ReservationsTableProps {
  displayCurrency: 'USD' | 'NGN';
  onOpenBookingDetails: (booking: BookingRecord) => void;
  quickWalkInRoom: AccommodationRoom;
}

export const ReservationsTable: React.FC<ReservationsTableProps> = ({
  displayCurrency,
  onOpenBookingDetails,
  quickWalkInRoom,
}) => {
  const navigate = useNavigate();
  const { bookings } = useBookingStore();

  return (
    <div className="bg-white border border-zinc-200/80 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
      {/* Header */}
      <div className="p-4 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-zinc-900">Master Reservations & Folios</h2>
          <p className="text-xs text-zinc-400">
            Tracking all online web bookings, front desk walk-ins, phone concierge, and OTA channels.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/bookings')}
            className="px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Open Full Tracking Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => quickWalkInRoom && quickWalkInRoom}
            className="px-3.5 py-1.5 bg-ink text-white rounded-lg text-xs font-semibold hover:bg-[#4338CA] shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>+ Create Walk-In Booking</span>
          </button>
        </div>
      </div>

      {/* Table replaced with div structure - NO <table> element */}
      <div className="overflow-x-auto">
        {/* Table Header Row */}
        <div className="flex items-center bg-[#FAFBFD] text-zinc-400 border-b border-zinc-100 uppercase text-[10px] font-bold tracking-wider">
          <div className="py-3 px-4 w-[120px] flex-shrink-0">Folio Code</div>
          <div className="py-3 px-4 w-[180px] flex-shrink-0">Guest Name</div>
          <div className="py-3 px-4 w-[140px] flex-shrink-0">Channel Origin</div>
          <div className="py-3 px-4 w-[160px] flex-shrink-0">Suite / Room</div>
          <div className="py-3 px-4 w-[150px] flex-shrink-0">Stay Dates</div>
          <div className="py-3 px-4 w-[120px] flex-shrink-0">Status</div>
          <div className="py-3 px-4 w-[120px] flex-shrink-0">Total Amount</div>
          <div className="py-3 px-4 w-[100px] flex-shrink-0 text-right">Actions</div>
        </div>

        {/* Table Body - Rows */}
        <div className="divide-y divide-zinc-100">
          {bookings.map((res) => (
            <div
              key={res.id}
              onClick={() => onOpenBookingDetails(res)}
              className="flex items-center hover:bg-zinc-50/70 transition-colors cursor-pointer group"
            >
              {/* Folio Code Column */}
              <div className="py-3.5 px-4 w-[120px] flex-shrink-0 font-mono font-bold text-zinc-900">
                <span className="text-ink">{res.id}</span>
                <div className="text-[10px] text-zinc-400 font-normal">{res.folioNumber}</div>
              </div>

              {/* Guest Name Column */}
              <div className="py-3.5 px-4 w-[180px] flex-shrink-0">
                <div className="flex items-center gap-2">
                  <img
                    src={res.guest.avatar}
                    alt={res.guest.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-zinc-200"
                  />
                  <div>
                    <div className="font-bold text-zinc-900 group-hover:text-ink transition-colors">
                      {res.guest.name}
                    </div>
                    <div className="text-[11px] text-zinc-400">{res.guest.vipTier} VIP</div>
                  </div>
                </div>
              </div>

              {/* Channel Origin Column */}
              <div className="py-3.5 px-4 w-[140px] flex-shrink-0">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    res.channelCategory === 'offline'
                      ? 'bg-orange-50 text-orange-700 border border-orange-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}
                >
                  {res.channelCategory === 'offline' ? (
                    <Store className="w-3 h-3 text-orange-600" />
                  ) : (
                    <Globe className="w-3 h-3 text-blue-600" />
                  )}
                  <span>{res.channelLabel}</span>
                </span>
              </div>

              {/* Suite / Room Column */}
              <div className="py-3.5 px-4 w-[160px] flex-shrink-0">
                <span className="font-semibold text-zinc-800">{res.room.name}</span>
                <div className="text-[11px] text-ink font-semibold">Room #{res.room.roomNumber}</div>
              </div>

              {/* Stay Dates Column */}
              <div className="py-3.5 px-4 w-[150px] flex-shrink-0">
                <div className="flex items-center gap-1.5 text-zinc-700 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{res.stay.checkInDate} → {res.stay.checkOutDate}</span>
                </div>
                <div className="text-[10px] text-zinc-400">{res.stay.nights} Nights</div>
              </div>

              {/* Status Column */}
              <div className="py-3.5 px-4 w-[120px] flex-shrink-0">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                    res.status === 'Checked In'
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      : res.status === 'Confirmed'
                      ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                      : 'bg-zinc-100 text-zinc-600'
                  }`}
                >
                  {res.status === 'Checked In' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  {res.status}
                </span>
              </div>

              {/* Total Amount Column */}
              <div className="py-3.5 px-4 w-[120px] flex-shrink-0 font-bold text-zinc-900">
                {displayCurrency === 'USD'
                  ? `$${res.financials.totalAmount.toLocaleString()}`
                  : `₦${(res.financials.totalAmount * 1600).toLocaleString()}`}
              </div>

              {/* Actions Column */}
              <div className="py-3.5 px-4 w-[100px] flex-shrink-0 text-right">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenBookingDetails(res);
                  }}
                  className="px-2.5 py-1 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-lg text-zinc-700 text-xs font-bold transition-all shadow-2xs group-hover:border-ink/40 inline-flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3 h-3" />
                  <span>Review</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};