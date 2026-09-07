import React from 'react';
import { BedDouble, Bubbles, TriangleRight, Users } from 'lucide-react';

interface ReceiptRoomShowcaseProps {
  roomImage: string;
  roomNumber: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
}

export const ReceiptRoomShowcase: React.FC<ReceiptRoomShowcaseProps> = ({
  roomImage,
  roomNumber,
  roomName,
  checkIn,
  checkOut,
  nights,
}) => {
  return (
    <article className="bg-white border border-[#c5c6cd] rounded-none overflow-hidden">
      <div className="room-showcase-grid grid grid-cols-1 md:grid-cols-12">
        {/* Suite Image Showcase */}
        <div className="md:col-span-5 relative min-h-[220px] bg-[#eaedff]">
          {roomImage && <img className="w-full h-full object-cover" src={roomImage} alt={roomName} />}
          <span className="absolute top-3 left-3 bg-[#0e1c2f] text-white text-[11px] font-bold px-2.5 py-1 rounded-none tracking-widest uppercase">
            Suite #{roomNumber}
          </span>
        </div>
        {/* Suite Technical Meta */}
        <div className="md:col-span-7 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#426086]">Primary Reservation</span>
              <span className="text-[11px] text-[#44474c]">Room Key Active</span>
            </div>
            <h2 className="text-xl font-serif font-medium text-[#131b2e] mt-1 mb-2">{roomName}</h2>
            <p className="text-xs text-[#44474c] mb-4">
              Unobstructed Atlantic panorama featuring bespoke millwork, curated editorial mini-library, deep soaking marble tub, and private balcony seating.
            </p>
            {/* Badge Tags */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-[#c5c6cd]">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#f2f3ff] border border-[#c5c6cd] text-xs text-[#131b2e] rounded-none">
                <span className="material-symbols-outlined text-[15px]"><BedDouble /></span> King Bed
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#f2f3ff] border border-[#c5c6cd] text-xs text-[#131b2e] rounded-none">
                <span className="material-symbols-outlined text-[15px]"><TriangleRight /></span> 620 sq ft
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#f2f3ff] border border-[#c5c6cd] text-xs text-[#131b2e] rounded-none">
                <span className="material-symbols-outlined text-[15px]"><Users /></span> 2 Guests Max
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#f2f3ff] border border-[#c5c6cd] text-xs text-[#131b2e] rounded-none">
                <span className="material-symbols-outlined text-[15px]"><Bubbles /></span> Private Terrace
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Check-in & Check-out Tabular Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-[#c5c6cd] bg-[#f2f3ff] divide-y sm:divide-y-0 sm:divide-x divide-[#c5c6cd]">
        <div className="p-4">
          <span className="block text-[11px] uppercase tracking-widest font-bold text-[#44474c]">Check-In</span>
          <span className="text-sm font-semibold text-[#131b2e] block mt-0.5">{checkIn}</span>
          <span className="text-xs text-[#426086]">From 3:00 PM EST</span>
        </div>
        <div className="p-4">
          <span className="block text-[11px] uppercase tracking-widest font-bold text-[#44474c]">Check-Out</span>
          <span className="text-sm font-semibold text-[#131b2e] block mt-0.5">{checkOut}</span>
          <span className="text-xs text-[#426086]">Until 11:00 AM EST</span>
        </div>
        <div className="p-4">
          <span className="block text-[11px] uppercase tracking-widest font-bold text-[#44474c]">Length of Stay</span>
          <span className="text-sm font-semibold text-[#131b2e] block mt-0.5">{nights} Nights</span>
          <span className="text-xs text-[#44474c]">Guaranteed Key Handover</span>
        </div>
      </div>
    </article>
  );
};
