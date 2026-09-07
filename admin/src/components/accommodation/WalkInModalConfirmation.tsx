import React from 'react';
import { CheckCircle2, KeyRound, Printer } from 'lucide-react';
import { AccommodationRoom } from '../../data/accommodationData';

interface WalkInModalConfirmationProps {
  room: AccommodationRoom;
  selectedRoomNumber: string;
  guestName: string;
  vipTier: string;
  checkInDate: string;
  checkOutDate: string;
  nightsCount: number;
  currency: 'USD' | 'NGN';
  totalAmountNGN: number;
  totalAmountUSD: number;
  onClose: () => void;
}

export const WalkInModalConfirmation: React.FC<WalkInModalConfirmationProps> = ({
  room,
  selectedRoomNumber,
  guestName,
  vipTier,
  checkInDate,
  checkOutDate,
  nightsCount,
  currency,
  totalAmountNGN,
  totalAmountUSD,
  onClose,
}) => {
  return (
    <div className="p-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
      <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div>
        <h3 className="text-lg font-bold text-zinc-900">Walk-In Guest Successfully Checked In!</h3>
        <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
          Folio #GH-{Math.floor(100000 + Math.random() * 900000)} generated. RFID Room Keycard programmed for Suite #{selectedRoomNumber}.
        </p>
      </div>

      <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200/80 text-left text-xs space-y-2.5 max-w-md mx-auto">
        <div className="flex justify-between border-b border-zinc-200 pb-1.5">
          <span className="text-zinc-500">Guest:</span>
          <span className="font-bold text-zinc-900">{guestName} ({vipTier})</span>
        </div>
        <div className="flex justify-between border-b border-zinc-200 pb-1.5">
          <span className="text-zinc-500">Assigned Suite:</span>
          <span className="font-bold text-ink">Suite #{selectedRoomNumber} ({room.name})</span>
        </div>
        <div className="flex justify-between border-b border-zinc-200 pb-1.5">
          <span className="text-zinc-500">Stay Duration:</span>
          <span className="font-bold text-zinc-900">{checkInDate} → {checkOutDate} ({nightsCount} Nights)</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Amount Paid:</span>
          <span className="font-extrabold text-emerald-600">
            {currency === 'NGN' ? `₦${totalAmountNGN.toLocaleString()}` : `$${totalAmountUSD.toLocaleString()}`} (Settled)
          </span>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-[#EEF2FF] border border-indigo-100 flex items-center justify-center gap-2.5 text-ink font-semibold text-xs max-w-md mx-auto">
        <KeyRound className="w-4 h-4 animate-pulse" />
        <span>RFID Keycard Active • Hand over to Guest</span>
      </div>

      <div className="flex items-center justify-center gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-zinc-200 text-zinc-700 text-xs font-semibold hover:bg-zinc-50 transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4 text-zinc-500" /> Print Folio Receipt
        </button>

        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 rounded-lg bg-ink text-white text-xs font-bold hover:bg-[#4338CA] transition-colors cursor-pointer"
        >
          Done / Back to Rooms
        </button>
      </div>
    </div>
  );
};
