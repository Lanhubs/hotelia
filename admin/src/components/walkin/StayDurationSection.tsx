import React from 'react';
import { Calendar } from 'lucide-react';

interface StayDurationSectionProps {
  checkInDate: string;
  onCheckInDateChange: (value: string) => void;
  checkOutDate: string;
  onCheckOutDateChange: (value: string) => void;
  nightsCount: number;
  onNightsChange: (value: number) => void;
  roomNumbers: string[];
  selectedRoomNumber: string;
  onSelectedRoomNumberChange: (value: string) => void;
  floor: number;
}

export const StayDurationSection: React.FC<StayDurationSectionProps> = ({
  checkInDate,
  onCheckInDateChange,
  checkOutDate,
  onCheckOutDateChange,
  nightsCount,
  onNightsChange,
  roomNumbers,
  selectedRoomNumber,
  onSelectedRoomNumberChange,
  floor,
}) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[#EEF2FF] text-ink flex items-center justify-center text-xs font-black">
            2
          </div>
          <h2 className="text-sm font-bold text-zinc-900">Stay Duration & Physical Room Allocation</h2>
        </div>
        <span className="text-[11px] text-ink font-bold">● RFID Key Available</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
        <div>
          <label className="block font-semibold text-zinc-700 mb-1">Check-In Date</label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={checkInDate}
              onChange={(e) => onCheckInDateChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200/80 rounded-lg text-zinc-900 font-semibold focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-zinc-700 mb-1">Check-Out Date</label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={checkOutDate}
              onChange={(e) => onCheckOutDateChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200/80 rounded-lg text-zinc-900 font-semibold focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-zinc-700 mb-1">Stay Length</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNightsChange(Math.max(1, nightsCount - 1))}
              className="px-3 py-2 bg-zinc-100 rounded-lg font-bold text-zinc-800 hover:bg-zinc-200 cursor-pointer"
            >
              -
            </button>
            <div className="flex-1 py-2 text-center bg-zinc-50 rounded-lg font-bold text-zinc-900 border border-zinc-200">
              {nightsCount} {nightsCount === 1 ? 'Night' : 'Nights'}
            </div>
            <button
              type="button"
              onClick={() => onNightsChange(nightsCount + 1)}
              className="px-3 py-2 bg-zinc-100 rounded-lg font-bold text-zinc-800 hover:bg-zinc-200 cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-zinc-700 mb-1">Physical Room Key Assigned</label>
          <select
            value={selectedRoomNumber}
            onChange={(e) => onSelectedRoomNumberChange(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200/80 rounded-lg text-zinc-900 font-bold focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink"
          >
            {roomNumbers.map((num) => (
              <option key={num} value={num}>
                Suite #{num} — Floor {floor} (Clean & Inspected)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-zinc-700 mb-1">Number of Keycards</label>
          <select className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200/80 rounded-lg text-zinc-900 font-semibold">
            <option value={1}>1 RFID Card</option>
            <option value={2}>2 RFID Cards (Standard)</option>
            <option value={3}>3 RFID Cards (Executive)</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-zinc-700 mb-1">Early Check-In / Luggage</label>
          <div className="py-2 px-3 text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 rounded-lg text-center">
            ✓ Immediate Access Ready
          </div>
        </div>
      </div>
    </div>
  );
};