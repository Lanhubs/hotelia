import React from 'react';
import { Store } from 'lucide-react';
import { ChannelStats } from '../../data/dashboardData';
import { useBookingStore } from '../../stores/bookingStore';

interface OfflineChannelsCardProps {
  stats: ChannelStats;
}

export const OfflineChannelsCard: React.FC<OfflineChannelsCardProps> = ({ stats }) => {
  const { displayCurrency } = useBookingStore();

  const formatMoney = (amountUSD: number) => {
    if (displayCurrency === 'NGN') {
      return `₦${(amountUSD * 1600).toLocaleString()}`;
    }
    return `$${amountUSD.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60 space-y-3.5 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-600 text-white">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-zinc-900">Reception Walk-Ins & Phone</h4>
            <span className="text-[11px] text-zinc-500">Front Desk Desk In-Person, Concierge</span>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
          ★ High-Margin Winner (100%)
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="bg-white/90 p-2.5 rounded-xl border border-amber-100">
          <span className="text-[10px] text-zinc-400 font-medium block">Total Walk-Ins</span>
          <strong className="text-base font-bold text-zinc-900">{stats.bookingsCount}</strong>
          <span className="text-[10px] text-amber-600 font-medium block">35% of total volume</span>
        </div>

        <div className="bg-white/90 p-2.5 rounded-xl border border-amber-100">
          <span className="text-[10px] text-zinc-400 font-medium block">Gross Revenue</span>
          <strong className="text-base font-bold text-zinc-900">{formatMoney(stats.grossRevenueUSD)}</strong>
          <span className="text-[10px] text-emerald-600 font-medium block">+16.4% direct growth</span>
        </div>

        <div className="bg-white/90 p-2.5 rounded-xl border border-amber-100">
          <span className="text-[10px] text-zinc-400 font-medium block">Avg Booking Value</span>
          <strong className="text-base font-bold text-emerald-700">{formatMoney(stats.avgBookingUSD)}</strong>
          <span className="text-[10px] text-emerald-600 font-semibold block">+43% higher per ticket!</span>
        </div>

        <div className="bg-white/90 p-2.5 rounded-xl border border-amber-100">
          <span className="text-[10px] text-zinc-400 font-medium block">OTA Commission Cost</span>
          <strong className="text-base font-bold text-emerald-600">$0.00</strong>
          <span className="text-[10px] text-emerald-600 font-semibold block">100% Retained Revenue</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs pt-1 border-t border-amber-100 text-zinc-600">
        <span>Net Yield Profitability:</span>
        <strong className="text-emerald-700 font-bold">{formatMoney(stats.netYieldUSD)} (100% Margin)</strong>
      </div>
    </div>
  );
};