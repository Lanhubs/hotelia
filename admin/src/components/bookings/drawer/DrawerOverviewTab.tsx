import React from 'react';
import { Mail, Phone, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { BookingRecord } from '../../../types/booking';

interface DrawerOverviewTabProps {
  booking: BookingRecord;
  formatMoney: (val: number) => string;
}

export const DrawerOverviewTab: React.FC<DrawerOverviewTabProps> = ({ booking, formatMoney }) => {
  return (
    <div className="space-y-6">
      <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            Guest Information
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF2FF] text-ink border border-indigo-100">
            VIP Tier: {booking.guest.vipTier}
          </span>
        </div>

        <div className="flex items-start gap-3.5">
          <img
            src={booking.guest.avatar}
            alt={booking.guest.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-2xs"
          />
          <div className="space-y-1 flex-1">
            <h3 className="text-sm font-bold text-zinc-900">{booking.guest.name}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 text-xs text-zinc-600">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-zinc-400" />
                <span className="truncate">{booking.guest.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-zinc-400" />
                <span>{booking.guest.phone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                <span>Nationality: {booking.guest.nationality}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                <span>{booking.guest.idType}: {booking.guest.idNumber}</span>
              </div>
            </div>
          </div>
        </div>

        {booking.guest.specialRequests && (
          <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-900 font-medium space-y-1">
            <span className="font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Special Requests:
            </span>
            <p>{booking.guest.specialRequests}</p>
          </div>
        )}
      </div>

      <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            Allocated Accommodation
          </span>
          <span className="text-xs font-bold text-ink">
            Room #{booking.room.roomNumber} (Floor {booking.room.floor})
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3.5">
          <div className="sm:w-36 h-24 rounded-xl overflow-hidden bg-zinc-900 shrink-0">
            <img src={booking.room.heroImage} alt={booking.room.name} className="w-full h-full object-cover" />
          </div>
          <div className="space-y-1 flex-1">
            <h4 className="text-sm font-bold text-zinc-900">{booking.room.name}</h4>
            <p className="text-xs text-zinc-500 line-clamp-2">{booking.room.tagline}</p>
            <div className="pt-1 flex items-center gap-3 text-xs font-semibold text-zinc-700">
              <span>Category: {booking.room.category}</span>
              <span>•</span>
              <span>Rate: {formatMoney(booking.financials.ratePerNight)}/night</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-zinc-200/60 text-xs">
          <div className="p-2.5 bg-white rounded-xl border border-zinc-200/70">
            <span className="text-zinc-400 text-[11px] block">Check-In</span>
            <strong className="text-zinc-900 font-bold text-xs">{booking.stay.checkInDate} ({booking.stay.checkInTime})</strong>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-zinc-200/70">
            <span className="text-zinc-400 text-[11px] block">Check-Out</span>
            <strong className="text-zinc-900 font-bold text-xs">{booking.stay.checkOutDate} ({booking.stay.checkOutTime})</strong>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-zinc-200/70 col-span-2 sm:col-span-1">
            <span className="text-zinc-400 text-[11px] block">Duration & Party</span>
            <strong className="text-zinc-900 font-bold text-xs">{booking.stay.nights} Nights • {booking.stay.adults} Adults</strong>
          </div>
        </div>
      </div>

      <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200/80 space-y-2 text-xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Channel & Audit Telemetry</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-700 pt-1">
          <div><span className="text-zinc-400 block">Booking Channel:</span><strong className="text-zinc-900">{booking.channelLabel}</strong></div>
          <div><span className="text-zinc-400 block">Booked Timestamp:</span><strong className="text-zinc-900">{booking.bookedAt}</strong></div>
          <div><span className="text-zinc-400 block">Handled By:</span><strong className="text-zinc-900">{booking.handledBy}</strong></div>
          <div><span className="text-zinc-400 block">Transaction Reference:</span><strong className="font-mono text-zinc-900">{booking.financials.transactionRef}</strong></div>
        </div>
      </div>
    </div>
  );
};
