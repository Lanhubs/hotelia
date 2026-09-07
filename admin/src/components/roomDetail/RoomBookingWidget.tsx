import React from 'react';
import { ChevronDown } from 'lucide-react';
import { AccommodationRoom } from '../../data/accommodationData';

interface RoomBookingWidgetProps {
  currentRoom: AccommodationRoom;
  checkInDate: string;
  onCheckInDateChange: (val: string) => void;
  checkOutDate: string;
  onCheckOutDateChange: (val: string) => void;
  guestsCount: string;
  onGuestsCountChange: (val: string) => void;
  onBookNow: () => void;
  onExploreMore: () => void;
}

export const RoomBookingWidget: React.FC<RoomBookingWidgetProps> = ({
  currentRoom,
  checkInDate,
  onCheckInDateChange,
  checkOutDate,
  onCheckOutDateChange,
  guestsCount,
  onGuestsCountChange,
  onBookNow,
  onExploreMore,
}) => {
  return (
    <div className="xl:col-span-5 space-y-5">
      <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex items-baseline gap-1.5">
          <span className="text-xs text-zinc-400 line-through font-semibold">
            ${currentRoom.originalPricePerNight || 91}
          </span>
          <span className="text-2xl font-black text-zinc-900">
            .${currentRoom.pricePerNight || 79}
          </span>
          <span className="text-xs font-normal text-zinc-500 ml-1">for 2 nights</span>
        </div>

        <div className="border border-zinc-200 rounded-xl overflow-hidden divide-y divide-zinc-200 text-xs">
          <div className="p-3 bg-white flex items-center justify-between">
            <span className="text-zinc-600 font-medium">Check in:</span>
            <input
              type="text"
              value={checkInDate}
              onChange={(e) => onCheckInDateChange(e.target.value)}
              className="font-semibold text-zinc-900 text-right bg-transparent outline-none w-28"
            />
          </div>

          <div className="p-3 bg-white flex items-center justify-between">
            <span className="text-zinc-600 font-medium">Check Out:</span>
            <input
              type="text"
              value={checkOutDate}
              onChange={(e) => onCheckOutDateChange(e.target.value)}
              className="font-semibold text-zinc-900 text-right bg-transparent outline-none w-28"
            />
          </div>

          <div className="p-3 bg-white flex items-center justify-between">
            <span className="text-zinc-600 font-medium">Guest:</span>
            <div className="relative">
              <select
                value={guestsCount}
                onChange={(e) => onGuestsCountChange(e.target.value)}
                className="appearance-none pr-5 font-semibold text-zinc-900 bg-transparent outline-none cursor-pointer text-right"
              >
                <option value="1 Guest">1 Guest</option>
                <option value="2 Guest">2 Guest</option>
                <option value="3 Guest">3 Guest</option>
                <option value="4 Guest">4 Guest</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={onBookNow}
            className="w-full py-3 px-4 rounded-xl bg-ink hover:bg-[#4338CA] text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center cursor-pointer active:scale-98"
          >
            Book Now
          </button>

          <p className="text-[11px] text-center text-zinc-400 font-normal italic">
            *You wound be charged yet
          </p>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden aspect-16/10 bg-zinc-900 group shadow-xs border border-zinc-200/80">
        <img
          src="https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=85&w=800&h=500"
          alt="Explore more home"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 flex items-end justify-center py-4 bg-gradient-to-t from-black/50 via-transparent to-transparent">
          <button
            type="button"
            onClick={onExploreMore}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white/90 hover:bg-white text-zinc-900 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer backdrop-blur-xs text-center"
          >
            Explore more home
          </button>
        </div>
      </div>
    </div>
  );
};
