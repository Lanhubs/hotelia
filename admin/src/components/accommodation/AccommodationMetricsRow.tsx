import React from 'react';

interface AccommodationMetricsRowProps {
  displayCurrency: 'USD' | 'NGN';
}

export const AccommodationMetricsRow: React.FC<AccommodationMetricsRowProps> = ({ displayCurrency }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <p className="text-[11px] font-medium text-zinc-400">Total Physical Capacity</p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-xl sm:text-2xl font-extrabold text-zinc-900">500</span>
          <span className="text-xs text-zinc-400 font-normal">Rooms</span>
        </div>
        <p className="text-[11px] text-indigo-600 font-bold mt-1">6 Signature Luxury Variants</p>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <p className="text-[11px] font-medium text-zinc-400">Walk-In Ready Now</p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-xl sm:text-2xl font-extrabold text-emerald-600">50</span>
          <span className="text-xs text-zinc-400 font-normal">Vacant Inspected</span>
        </div>
        <p className="text-[11px] text-emerald-600 font-semibold mt-1">Instant Keycard Programming</p>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <p className="text-[11px] font-medium text-zinc-400">Occupancy Rate</p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-xl sm:text-2xl font-extrabold text-zinc-900">56.0%</span>
          <span className="text-xs text-zinc-400 font-normal">280 / 500 Rooms</span>
        </div>
        <p className="text-[11px] text-zinc-500 font-medium mt-1">+12.4% vs last week</p>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <p className="text-[11px] font-medium text-zinc-400">Walk-In Revenue (Today)</p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-xl sm:text-2xl font-extrabold text-zinc-900 truncate">
            {displayCurrency === 'USD' ? '$3,820' : '₦6,100,000'}
          </span>
        </div>
        <p className="text-[11px] text-indigo-600 font-bold mt-1">4 Direct Check-Ins</p>
      </div>
    </div>
  );
};