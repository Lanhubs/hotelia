import React from 'react';
import { GripVertical, ChevronDown } from 'lucide-react';
import { useDashboardStore } from '../../stores/dashboardStore';
import { useBookingStore } from '../../stores/bookingStore';
import { BOOKING_BARS, TIME_RANGE_OPTIONS } from '../../data/dashboardData';

export const BookingTimelineChart: React.FC = () => {
  const { selectedBar, setSelectedBar, timeRange, setTimeRange, showTimeRangeDropdown, setShowTimeRangeDropdown } = useDashboardStore();
  const { displayCurrency } = useBookingStore();

  const formatMoney = (amountUSD: number) => {
    if (displayCurrency === 'NGN') {
      return `₦${(amountUSD * 1600).toLocaleString()}`;
    }
    return `$${amountUSD.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <GripVertical className="w-4 h-4 text-zinc-400 cursor-grab" />
          <div>
            <h3 className="text-sm font-bold text-zinc-900">Booking Timeline Yield</h3>
            <p className="text-[10px] text-zinc-400 font-normal">Last updated 1m ago</p>
          </div>
        </div>

        {/* Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowTimeRangeDropdown(!showTimeRangeDropdown)}
            className="flex items-center gap-1 text-xs font-semibold text-ink hover:text-indigo-700 cursor-pointer"
          >
            <span>{timeRange}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {showTimeRangeDropdown && (
            <div className="absolute right-0 mt-1 w-32 bg-white border border-zinc-200 rounded-xl shadow-lg py-1 z-30 text-xs">
              {TIME_RANGE_OPTIONS.map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setTimeRange(range)}
                  className={`w-full text-left px-3 py-1.5 hover:bg-zinc-50 font-medium cursor-pointer ${
                    timeRange === range ? 'text-ink font-bold' : 'text-zinc-700'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="relative h-48 w-full pt-2">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] text-zinc-400 font-medium select-none pointer-events-none">
          <span>100k</span>
          <span>80k</span>
          <span>60k</span>
          <span>40k</span>
          <span>20k</span>
          <span>0</span>
        </div>

        {/* Bars Area */}
        <div className="ml-8 h-full flex items-end justify-between px-1">
          {BOOKING_BARS.map((item, idx) => {
            const heightPct = (item.amount / 100000) * 100;
            const isSelected = selectedBar === idx;

            return (
              <div
                key={item.day}
                onClick={() => setSelectedBar(idx)}
                className="group flex flex-col items-center cursor-pointer relative"
                style={{ width: '11%' }}
              >
                {/* Hover Tooltip */}
                {isSelected && (
                  <div className="absolute -top-7 bg-zinc-900 text-white rounded-md px-1.5 py-0.5 text-[10px] font-bold whitespace-nowrap z-20 shadow-md font-numeric">
                    {formatMoney(item.amount)}
                  </div>
                )}

                {/* Bar */}
                <div
                  className={`w-full rounded-xl transition-all duration-300 ${
                    isSelected
                      ? 'bg-linear-to-t from-ink to-[#717cf7] shadow-sm'
                      : 'bg-linear-to-t from-[#5861F7] to-[#7A82FB] opacity-90 group-hover:opacity-100'
                  }`}
                  style={{ height: `${heightPct}%`, minHeight: '12px' }}
                />

                {/* Day Label */}
                <span className="text-[10px] text-zinc-400 font-medium mt-2 whitespace-nowrap">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};