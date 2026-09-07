import React from 'react';
import { Filter, Store, Globe, Phone, Plane, Briefcase } from 'lucide-react';
import { BookingFilters } from '../../types/booking';

interface BookingChannelFilterPillsProps {
  filters: BookingFilters;
  onFilterChange: (newFilters: Partial<BookingFilters>) => void;
  totalFilteredCount: number;
  totalCount: number;
}

export const BookingChannelFilterPills: React.FC<BookingChannelFilterPillsProps> = ({
  filters,
  onFilterChange,
  totalFilteredCount,
  totalCount,
}) => {
  return (
    <div className="pt-2 border-t border-zinc-100 flex items-center justify-between gap-2 overflow-x-auto custom-scrollbar">
      <div className="flex items-center gap-1.5 flex-nowrap">
        <span className="text-xs text-zinc-400 font-semibold mr-1 flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" /> Channel Origin:
        </span>

        <button
          onClick={() => onFilterChange({ channelCategory: 'all', channelSpecific: 'all' })}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            filters.channelCategory === 'all' && filters.channelSpecific === 'all'
              ? 'bg-ink text-white shadow-xs'
              : 'bg-zinc-50 text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          All Bookings ({totalCount})
        </button>

        <button
          onClick={() => onFilterChange({ channelCategory: 'offline', channelSpecific: 'front_desk_walkin' })}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
            filters.channelSpecific === 'front_desk_walkin'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'bg-orange-50/70 text-orange-800 border border-orange-200/60 hover:bg-orange-100'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Front Desk Walk-In</span>
        </button>

        <button
          onClick={() => onFilterChange({ channelCategory: 'online', channelSpecific: 'online_direct' })}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
            filters.channelSpecific === 'online_direct'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-blue-50/70 text-blue-800 border border-blue-200/60 hover:bg-blue-100'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Online Web Direct</span>
        </button>

        <button
          onClick={() => onFilterChange({ channelCategory: 'offline', channelSpecific: 'phone_concierge' })}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
            filters.channelSpecific === 'phone_concierge'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-purple-50/70 text-purple-800 border border-purple-200/60 hover:bg-purple-100'
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Phone Concierge</span>
        </button>

        <button
          onClick={() => onFilterChange({ channelCategory: 'online', channelSpecific: 'ota_booking_com' })}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
            filters.channelSpecific === 'ota_booking_com' || filters.channelSpecific === 'ota_airbnb'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-indigo-50/70 text-indigo-800 border border-indigo-200/60 hover:bg-indigo-100'
          }`}
        >
          <Plane className="w-3.5 h-3.5" />
          <span>OTAs (Booking/Airbnb)</span>
        </button>

        <button
          onClick={() => onFilterChange({ channelCategory: 'offline', channelSpecific: 'corporate_direct' })}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
            filters.channelSpecific === 'corporate_direct'
              ? 'bg-zinc-800 text-white shadow-xs'
              : 'bg-zinc-100 text-zinc-800 border border-zinc-200 hover:bg-zinc-200'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Corporate Direct</span>
        </button>
      </div>

      <div className="text-xs text-zinc-400 font-medium whitespace-nowrap shrink-0">
        Showing <strong className="text-zinc-900 font-bold">{totalFilteredCount}</strong> of {totalCount}
      </div>
    </div>
  );
};
