import React from 'react';
import { AccommodationRoom } from '../../data/accommodationData';

interface RoomVariantSwitcherProps {
  rooms: AccommodationRoom[];
  selectedRoomIndex: number;
  onSelect: (index: number) => void;
  displayCurrency: 'USD' | 'NGN';
}

export const RoomVariantSwitcher: React.FC<RoomVariantSwitcherProps> = ({
  rooms,
  selectedRoomIndex,
  onSelect,
  displayCurrency,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
      {rooms.map((room, idx) => (
        <button
          key={room.id}
          onClick={() => onSelect(idx)}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
            selectedRoomIndex === idx
              ? 'bg-zinc-900 text-white shadow-md'
              : 'bg-white border border-zinc-200/80 text-zinc-600 hover:bg-zinc-50'
          }`}
        >
          <span>{room.name}</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
            selectedRoomIndex === idx ? 'bg-zinc-800 text-[#f97316]' : 'bg-zinc-100 text-zinc-500'
          }`}>
            {displayCurrency === 'USD' ? `$${room.pricePerNight}` : `₦${(room.priceNairaPerNight / 1000).toFixed(0)}k`}
          </span>
        </button>
      ))}
    </div>
  );
};