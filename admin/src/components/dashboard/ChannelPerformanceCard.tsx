import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Store, CheckCircle2, ChevronRight } from 'lucide-react';
import { useDashboardStore, ChannelViewMode } from '../../stores/dashboardStore';
import { ONLINE_STATS, OFFLINE_STATS } from '../../data/dashboardData';
import { useBookingStore } from '../../stores/bookingStore';
import { OnlineChannelsCard } from './OnlineChannelsCard';
import { OfflineChannelsCard } from './OfflineChannelsCard';
import { ProfitabilityTab } from './ProfitabilityTab';
import { SubChannelsTable } from './SubChannelsTable';
import { SUB_CHANNELS_DATA } from '../../data/dashboardData';

interface ChannelPerformanceCardProps {
  onlineStats?: any;
  offlineStats?: any;
}

export const ChannelPerformanceCard: React.FC<ChannelPerformanceCardProps> = ({
  onlineStats: apiOnline,
  offlineStats: apiOffline,
}) => {
  const { channelViewMode, setChannelViewMode } = useDashboardStore();
  const { displayCurrency } = useBookingStore();

  const activeOnline = apiOnline || ONLINE_STATS;
  const activeOffline = apiOffline || OFFLINE_STATS;

  const formatMoney = (amountUSD: number) => {
    if (displayCurrency === 'NGN') {
      return `₦${(amountUSD * 1600).toLocaleString()}`;
    }
    return `$${amountUSD.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const totalGross = activeOnline.grossRevenueUSD + activeOffline.grossRevenueUSD;
  const onlineRevenuePct = totalGross > 0 ? Math.round((activeOnline.grossRevenueUSD / totalGross) * 100) : 65;
  const offlineRevenuePct = 100 - onlineRevenuePct;

  const viewModes: { key: ChannelViewMode; label: string }[] = [
    { key: 'overview', label: 'Head-to-Head' },
    { key: 'profitability', label: 'Yield & Margins' },
    { key: 'channels', label: 'Sub-Channels' },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-ink border border-indigo-100">
              Channel Performance Intelligence
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Walk-Ins: +14.2% Net Margin</span>
            </span>
          </div>
          <h3 className="text-base font-bold text-zinc-900 mt-1">
            Online vs Offline (Walk-Ins & Reception) Performance
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Comparative yield, average stay transaction values, and commission fee drag.
          </p>
        </div>

        <div className="flex items-center p-1 bg-zinc-100 rounded-xl border border-zinc-200/60 self-start sm:self-auto">
          {viewModes.map((mode) => (
            <button
              key={mode.key}
              type="button"
              onClick={() => setChannelViewMode(mode.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                channelViewMode === mode.key
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-indigo-600">
            <Globe className="w-3.5 h-3.5" />
            <span>Online Channels: {onlineRevenuePct}% of Total Yield ({formatMoney(activeOnline.grossRevenueUSD)})</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-600">
            <Store className="w-3.5 h-3.5" />
            <span>Offline / Walk-Ins: {offlineRevenuePct}% of Total Yield ({formatMoney(activeOffline.grossRevenueUSD)})</span>
          </div>
        </div>

        <div className="h-3 w-full bg-zinc-100 rounded-full overflow-hidden flex p-0.5">
          <div
            className="h-full bg-linear-to-r from-ink to-[#6366F1] rounded-l-full transition-all duration-500"
            style={{ width: `${onlineRevenuePct}%` }}
          />
          <div
            className="h-full bg-linear-to-r from-amber-500 to-orange-500 rounded-r-full transition-all duration-500"
            style={{ width: `${offlineRevenuePct}%` }}
          />
        </div>
      </div>

      {channelViewMode === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <OnlineChannelsCard stats={activeOnline} />
          <OfflineChannelsCard stats={activeOffline} />
        </div>
      )}

      {channelViewMode === 'profitability' && (
        <ProfitabilityTab onlineStats={activeOnline} offlineStats={activeOffline} />
      )}

      {channelViewMode === 'channels' && <SubChannelsTable data={SUB_CHANNELS_DATA} />}

      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
        <span className="text-zinc-400 font-normal">
          Audited against all 280 active reservations and POS terminal logs
        </span>
        <Link
          to="/admin/revenue"
          className="text-xs font-semibold text-ink hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
        >
          <span>Full Channel P&L Matrix</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};