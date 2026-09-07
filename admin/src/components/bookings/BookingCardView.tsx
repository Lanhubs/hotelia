import React from 'react';
import { ChevronRight } from 'lucide-react';
import { BookingRecord } from '../../types/booking';
import { DisplayCurrency, formatMoney, getChannelBadge, getStatusBadge } from './bookingUtils';

interface BookingCardViewProps {
  bookings: BookingRecord[];
  displayCurrency: DisplayCurrency;
  onOpenDetails: (booking: BookingRecord) => void;
}

export const BookingCardView: React.FC<BookingCardViewProps> = ({
  bookings,
  displayCurrency,
  onOpenDetails,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {bookings.map((b) => (
        <div
          key={b.id}
          onClick={() => onOpenDetails(b)}
          className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          {/* Card Header with Room Image */}
          <div className="relative h-36 w-full bg-zinc-900 overflow-hidden">
            <img
              src={b.room.heroImage}
              alt={b.room.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Floating Badges */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5">
              <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                Room #{b.room.roomNumber}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-ink text-white text-[10px] font-bold uppercase tracking-wider">
                {b.id}
              </span>
            </div>

            <div className="absolute top-3 right-3">
              {getStatusBadge(b.status)}
            </div>

            <div className="absolute bottom-2.5 left-3 right-3 text-white">
              <h3 className="font-bold text-sm leading-tight drop-shadow-sm">{b.room.name}</h3>
              <p className="text-[11px] text-zinc-300">{b.room.category}</p>
            </div>
          </div>

          {/* Card Content Body */}
          <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
            {/* Guest Row */}
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <div className="flex items-center gap-2.5">
                <img
                  src={b.guest.avatar}
                  alt={b.guest.name}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-zinc-200"
                />
                <div>
                  <div className="font-bold text-xs text-zinc-900 group-hover:text-ink transition-colors">
                    {b.guest.name}
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    {b.guest.vipTier} VIP • {b.guest.nationality}
                  </div>
                </div>
              </div>

              <div>
                {getChannelBadge(b.channel, b.channelLabel, b.channelCategory)}
              </div>
            </div>

            {/* Stay Dates Info */}
            <div className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-zinc-400 block font-medium">Dates of Stay</span>
                <strong className="text-zinc-900 font-bold text-[11px]">
                  {b.stay.checkInDate} → {b.stay.checkOutDate}
                </strong>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-zinc-400 block font-medium">Duration</span>
                <span className="px-1.5 py-0.5 bg-zinc-200/80 rounded text-[10px] font-bold text-zinc-700">
                  {b.stay.nights} Nights
                </span>
              </div>
            </div>

            {/* Keycard & Financial Footer */}
            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-zinc-400 block">Total Folio</span>
                <strong className="text-zinc-900 font-black text-sm">
                  {formatMoney(b.financials.totalAmount, displayCurrency)}
                </strong>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetails(b);
                }}
                className="px-3 py-1.5 bg-ink text-white rounded-xl text-xs font-bold hover:bg-[#4338CA] transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
              >
                <span>Review Folio</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};