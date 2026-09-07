import React from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import { AccommodationRoom } from '../../data/accommodationData';

interface WalkInBookingEngineProps {
  room: AccommodationRoom;
  nextRoom: AccommodationRoom;
  nightsCount: number;
  displayCurrency: 'USD' | 'NGN';
  checkInDate: string;
  onCheckInDateChange: (value: string) => void;
  checkOutDate: string;
  onCheckOutDateChange: (value: string) => void;
  guestsCount: number;
  onGuestsCountChange: (value: number) => void;
  onBook: () => void;
  onNextRoom: () => void;
}

export const WalkInBookingEngine: React.FC<WalkInBookingEngineProps> = ({
  room,
  nextRoom,
  nightsCount,
  displayCurrency,
  checkInDate,
  onCheckInDateChange,
  checkOutDate,
  onCheckOutDateChange,
  guestsCount,
  onGuestsCountChange,
  onBook,
  onNextRoom,
}) => {
  return (
    <div className="xl:col-span-4 space-y-5 sticky top-20">
      {/* Floating Walk-in Booking Card */}
      <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-lg shadow-zinc-200/50 space-y-5">
        {/* Price Header */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-zinc-400 line-through font-semibold">
              {displayCurrency === 'USD'
                ? `$${room.originalPricePerNight * nightsCount}`
                : `₦${((room.priceNairaPerNight * 1.15) * nightsCount).toLocaleString()}`}
            </span>
            <span className="text-2xl font-black text-zinc-900">
              {displayCurrency === 'USD'
                ? `$${room.pricePerNight * nightsCount}`
                : `₦${(room.priceNairaPerNight * nightsCount).toLocaleString()}`}
            </span>
            <span className="text-xs font-medium text-zinc-500">for {nightsCount} nights</span>
          </div>
          <p className="text-[11px] text-[#E86E15] font-semibold">
            Exclusive Reception Walk-In Rate
          </p>
        </div>

        {/* Booking Fields Container */}
        <div className="border border-zinc-200 rounded-2xl overflow-hidden divide-y divide-zinc-200 text-xs">
          {/* Check-In */}
          <div className="p-3 bg-zinc-50/50 flex items-center justify-between">
            <span className="text-zinc-500 font-medium">Check in:</span>
            <input
              type="text"
              value={checkInDate}
              onChange={(e) => onCheckInDateChange(e.target.value)}
              className="font-bold text-zinc-900 text-right bg-transparent outline-none w-28"
            />
          </div>

          {/* Check-Out */}
          <div className="p-3 bg-zinc-50/50 flex items-center justify-between">
            <span className="text-zinc-500 font-medium">Check Out:</span>
            <input
              type="text"
              value={checkOutDate}
              onChange={(e) => onCheckOutDateChange(e.target.value)}
              className="font-bold text-zinc-900 text-right bg-transparent outline-none w-28"
            />
          </div>

          {/* Guests Dropdown */}
          <div className="p-3 bg-zinc-50/50 flex items-center justify-between">
            <span className="text-zinc-500 font-medium">Guest:</span>
            <select
              value={guestsCount}
              onChange={(e) => onGuestsCountChange(Number(e.target.value))}
              className="font-bold text-zinc-900 bg-transparent outline-none cursor-pointer"
            >
              <option value={1}>1 Guest</option>
              <option value={2}>2 Guests</option>
              <option value={3}>3 Guests</option>
              <option value={4}>4 Guests</option>
              <option value={6}>6 Guests (Villa Max)</option>
            </select>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={onBook}
            className="w-full py-3.5 px-4 rounded-xl bg-[#E86E15] hover:bg-[#d05f0d] text-white font-bold text-sm shadow-md shadow-orange-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Sparkles className="w-4 h-4" />
            <span>Book Now</span>
          </button>

          <p className="text-[11px] text-center text-zinc-400 font-normal italic">
            *You won't be charged yet • Instant keycard issuance
          </p>
        </div>
      </div>

      {/* Bottom Mini Preview: Explore more homes */}
      <div className="relative rounded-2xl overflow-hidden aspect-video bg-zinc-900 group shadow-sm border border-zinc-200">
        <img
          src={nextRoom.heroImage}
          alt="Next room preview"
          className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
          <button
            type="button"
            onClick={onNextRoom}
            className="w-full py-2.5 px-3 rounded-xl bg-white/95 backdrop-blur-xs text-zinc-900 font-bold text-xs hover:bg-white transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <span>Explore more homes</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#E86E15]" />
          </button>
        </div>
      </div>
    </div>
  );
};