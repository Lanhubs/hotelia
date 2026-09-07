import React from 'react';
import { Globe, CheckCircle2 } from 'lucide-react';
import { ChannelStats } from '../../data/dashboardData';
import { useBookingStore } from '../../stores/bookingStore';

interface OnlineChannelsCardProps {
  stats: ChannelStats;
}

export const OnlineChannelsCard: React.FC<OnlineChannelsCardProps> = ({ stats }) => {
  const { displayCurrency } = useBookingStore();

  const formatMoney = (amountUSD: number) => {
    if (displayCurrency === 'NGN') {
      return `₦${(amountUSD * 1600).toLocaleString()}`;
    }
    return `$${amountUSD.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-3.5 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-ink text-white">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-zinc-900">Online Direct & OTAs</h4>
            <span className="text-[11px] text-zinc-500">Web Portal, Booking.com, Airbnb</span>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-100 text-indigo-800">
          Volume Leader (65%)
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="bg-white/90 p-2.5 rounded-xl border border-indigo-100/80">
          <span className="text-[10px] text-zinc-400 font-medium block">Total Bookings</span>
          <strong className="text-base font-bold text-zinc-900">{stats.bookingsCount}</strong>
          <span className="text-[10px] text-indigo-600 font-medium block">65% of total volume</span>
        </div>

        <div className="bg-white/90 p-2.5 rounded-xl border border-indigo-100/80">
          <span className="text-[10px] text-zinc-400 font-medium block">Gross Revenue</span>
          <strong className="text-base font-bold text-zinc-900">{formatMoney(stats.grossRevenueUSD)}</strong>
          <span className="text-[10px] text-emerald-600 font-medium block">+8.2% vs last month</span>
        </div>

        <div className="bg-white/90 p-2.5 rounded-xl border border-indigo-100/80">
          <span className="text-[10px] text-zinc-400 font-medium block">Avg Booking Value</span>
          <strong className="text-base font-bold text-zinc-900">{formatMoney(stats.avgBookingUSD)}</strong>
          <span className="text-[10px] text-zinc-400 block">{stats.avgStayNights} nights average</span>
        </div>

        <div className="bg-white/90 p-2.5 rounded-xl border border-indigo-100/80">
          <span className="text-[10px] text-zinc-400 font-medium block">OTA Commission Drag</span>
          <strong className="text-base font-bold text-rose-600">-{formatMoney(stats.otaCommissionUSD)}</strong>
          <span className="text-[10px] text-rose-500 font-medium block">9.5% average fee loss</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs pt-1 border-t border-indigo-100/80 text-zinc-600">
        <span>Net Yield Profitability:</span>
        <strong className="text-ink font-bold">{formatMoney(stats.netYieldUSD)} ({stats.netMarginPct})</strong>
      </div>
    </div>
  );
};