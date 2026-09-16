import React from 'react';
import { Plus } from 'lucide-react';
import { DisplayCurrency } from './bookingUtils';

interface BookingsHubHeaderProps {
  displayCurrency: DisplayCurrency;
  onToggleCurrency: () => void;
  onCreateWalkIn: () => void;
}

export const BookingsHubHeader: React.FC<BookingsHubHeaderProps> = ({
  displayCurrency,
  onToggleCurrency,
  onCreateWalkIn,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#EEF2FF] text-ink border border-indigo-100">
            Master Ledger
          </span>
          <span className="text-xs font-semibold text-zinc-400">
            Live Omnichannel Synchronizer
          </span>
        </div>
        <h1 className="text-xl md:text-2xl font-black text-zinc-900 tracking-tight mt-1">
          Bookings & Reservations Hub
        </h1>
      </div>

      {/* Global Action Toolbar */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        <button
          type="button"
          onClick={onToggleCurrency}
          className="px-3 py-2 bg-white border border-zinc-200/90 rounded-xl text-xs font-bold text-zinc-700 hover:bg-zinc-50 shadow-2xs transition-colors cursor-pointer"
        >
          Currency: <span className="text-ink font-black">{displayCurrency}</span>
        </button>

        <button
          type="button"
          onClick={onCreateWalkIn}
          className="px-4 py-2 bg-ink hover:bg-[#4338CA] text-white rounded-xl text-xs font-bold shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Create Walk-In Booking</span>
        </button>
      </div>
    </div>
  );
};