import React from 'react';

export type ReservationsViewMode = 'discovery' | 'ledger' | 'rack';

interface ReservationsPageHeaderProps {
  viewMode: ReservationsViewMode;
  onViewModeChange: (mode: ReservationsViewMode) => void;
  roomCount: number;
  reservationCount: number;
  displayCurrency: 'USD' | 'NGN';
  onToggleCurrency: () => void;
}

export const ReservationsPageHeader: React.FC<ReservationsPageHeaderProps> = ({
  viewMode,
  onViewModeChange,
  roomCount,
  reservationCount,
  displayCurrency,
  onToggleCurrency,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-[#E86E15]">
            Front Desk & Room Inventory
          </span>
          <span className="text-xs font-semibold text-zinc-500">
            {roomCount} Luxury Variants Available
          </span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight mt-1">
          Accommodation & Walk-In Booking
        </h1>
      </div>

      {/* View Mode Tabs & Currency Switcher */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center p-1 bg-white border border-zinc-200 rounded-xl shadow-2xs">
          <button
            onClick={() => onViewModeChange('discovery')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'discovery'
                ? 'bg-[#E86E15] text-white shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Room Discovery & Walk-In
          </button>
          <button
            onClick={() => onViewModeChange('ledger')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'ledger'
                ? 'bg-[#E86E15] text-white shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Bookings Ledger ({reservationCount})
          </button>
        </div>

        <button
          onClick={onToggleCurrency}
          className="px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 hover:bg-zinc-50 shadow-2xs transition-colors"
        >
          Currency: <span className="text-[#E86E15]">{displayCurrency}</span>
        </button>
      </div>
    </div>
  );
};