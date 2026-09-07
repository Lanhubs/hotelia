import React from 'react';
import { ChannelStats } from '../../data/dashboardData';
import { useBookingStore } from '../../stores/bookingStore';

interface ProfitabilityTabProps {
  onlineStats: ChannelStats;
  offlineStats: ChannelStats;
}

export const ProfitabilityTab: React.FC<ProfitabilityTabProps> = ({ onlineStats, offlineStats }) => {
  const { displayCurrency } = useBookingStore();

  const formatMoney = (amountUSD: number) => {
    if (displayCurrency === 'NGN') {
      return `₦${(amountUSD * 1600).toLocaleString()}`;
    }
    return `$${amountUSD.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-3 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-3 rounded-xl border border-zinc-200 space-y-1">
          <span className="text-[10px] text-zinc-400 font-medium block">Direct Walk-In Advantage</span>
          <strong className="text-sm font-bold text-emerald-600">+$352 Higher Yield / Booking</strong>
          <p className="text-[11px] text-zinc-500 leading-snug">
            Walk-in guests at reception are 3.2x more likely to upgrade to premium suites and book fine dining.
          </p>
        </div>

        <div className="bg-white p-3 rounded-xl border border-zinc-200 space-y-1">
          <span className="text-[10px] text-zinc-400 font-medium block">OTA Commission Bleed</span>
          <strong className="text-sm font-bold text-rose-600">{formatMoney(onlineStats.otaCommissionUSD)} Lost to Intermediaries</strong>
          <p className="text-[11px] text-zinc-500 leading-snug">
            15% average commission paid to Booking.com and Airbnb on remote guest acquisitions.
          </p>
        </div>

        <div className="bg-white p-3 rounded-xl border border-zinc-200 space-y-1">
          <span className="text-[10px] text-zinc-400 font-medium block">Direct Channel Strategy</span>
          <strong className="text-sm font-bold text-ink">Shift 15% OTAs → Direct</strong>
          <p className="text-[11px] text-zinc-500 leading-snug">
            Incentivizing direct web & front-desk repeat reservations will save $21,300/quarter.
          </p>
        </div>
      </div>
    </div>
  );
};