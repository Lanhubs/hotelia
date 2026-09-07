import React from 'react';
import { Building, Radio, KeyRound } from 'lucide-react';
import { BookingRecord } from '../../../types/booking';

interface DrawerKeycardTabProps {
  booking: BookingRecord;
  isEncodingKey: boolean;
  onIssueKey: () => void;
}

export const DrawerKeycardTab: React.FC<DrawerKeycardTabProps> = ({
  booking,
  isEncodingKey,
  onIssueKey,
}) => {
  return (
    <div className="space-y-5">
      <div className="relative w-full aspect-[1.58/1] max-w-sm mx-auto rounded-2xl p-6 bg-gradient-to-br from-zinc-900 via-zinc-800 to-indigo-950 text-white shadow-xl overflow-hidden border border-zinc-700 flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-32 h-32 bg-ink/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-indigo-400" />
            <span className="text-xs font-black tracking-wider uppercase">KeoExperience Resort</span>
          </div>
          <Radio className="w-5 h-5 text-indigo-300 animate-pulse" />
        </div>

        <div className="relative z-10 space-y-1 my-auto">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest block">Access Suite</span>
          <div className="text-3xl font-black tracking-tight text-white">
            Room #{booking.room.roomNumber}
          </div>
          <div className="text-xs text-indigo-300 font-semibold">{booking.room.name}</div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-zinc-400 border-t border-zinc-700/80 pt-3 relative z-10">
          <div>
            <span className="block text-[9px] uppercase font-bold text-zinc-500">Guest</span>
            <span className="text-white font-bold">{booking.guest.name}</span>
          </div>
          <div className="text-right">
            <span className="block text-[9px] uppercase font-bold text-zinc-500">RFID Tag</span>
            <span className="font-mono text-indigo-300">{booking.keycard.cardUid || 'PENDING'}</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-zinc-900">
            <KeyRound className="w-4 h-4 text-ink" />
            <span>NFC / RFID Desk Encoder</span>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${booking.keycard.status === 'Active'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-zinc-200 text-zinc-700'
              }`}
          >
            Status: {booking.keycard.status}
          </span>
        </div>

        <div className="space-y-1.5 text-zinc-600 divide-y divide-zinc-200/60 pt-1">
          <div className="flex justify-between py-1">
            <span>Assigned Door Lock:</span>
            <strong className="text-zinc-900">Room #{booking.room.roomNumber} (Floor {booking.room.floor})</strong>
          </div>
          <div className="flex justify-between py-1">
            <span>Issued By:</span>
            <strong className="text-zinc-900">{booking.keycard.issuedBy || 'Front Desk Operations'}</strong>
          </div>
          <div className="flex justify-between py-1">
            <span>Expiration:</span>
            <strong className="text-zinc-900">{booking.stay.checkOutDate} 11:00 AM</strong>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            disabled={isEncodingKey}
            onClick={onIssueKey}
            className="w-full py-2.5 px-4 rounded-xl bg-ink hover:bg-[#4338CA] text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <KeyRound className="w-4 h-4" />
            <span>
              {isEncodingKey
                ? 'Encoding RFID Hardware...'
                : booking.keycard.status === 'Active'
                  ? 'Re-Program / Replace RFID Keycard'
                  : 'Encode & Issue Keycard to Guest'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
