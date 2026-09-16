import React from 'react';
import {
  Globe,
  Store,
  CalendarCheck2,
  DollarSign,
  TrendingUp,
  KeyRound,
  Users,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { BookingRecord, BookingFilters } from '../../types/booking';

interface BookingStatsRowProps {
  bookings: BookingRecord[];
  displayCurrency: 'USD' | 'NGN';
  activeFilters: BookingFilters;
  onQuickFilter: (newFilters: Partial<BookingFilters>) => void;
}

export const BookingStatsRow: React.FC<BookingStatsRowProps> = ({
  bookings,
  displayCurrency,
  activeFilters,
  onQuickFilter,
}) => {
  const totalCount = bookings.length;
  const onlineCount = bookings.filter((b) => b.channelCategory === 'online').length;
  const offlineCount = bookings.filter((b) => b.channelCategory === 'offline').length;
  
  const onlinePercentage = totalCount > 0 ? Math.round((onlineCount / totalCount) * 100) : 0;
  const offlinePercentage = 100 - onlinePercentage;

  const checkedInCount = bookings.filter((b) => b.status === 'Checked In').length;
  const confirmedCount = bookings.filter((b) => b.status === 'Confirmed').length;
  const activeKeysCount = bookings.filter((b) => b.keycard?.status === 'Active').length;

  const totalRevenueUSD = bookings.reduce((sum, b) => sum + b.financials?.totalAmount, 0);
  const walkinRevenueUSD = bookings
    .filter((b) => b.channel === 'front_desk_walkin')
    .reduce((sum, b) => sum + b.financials.totalAmount, 0);

  const formatMoney = (amountUSD: number) => {
    if (displayCurrency === 'NGN') {
      return `₦${(amountUSD * 1600).toLocaleString()}`;
    }
    return `$${amountUSD.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. Master Bookings & In-House */}
      <div
        onClick={() => onQuickFilter({ timeframe: 'all', status: 'all', channelCategory: 'all' })}
        className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-indigo-300 hover:shadow-md ${
          activeFilters.timeframe === 'all' && activeFilters.status === 'all' && activeFilters.channelCategory === 'all'
            ? 'border-ink/40 ring-1 ring-ink/20'
            : 'border-zinc-200/80'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500">Master Reservations</span>
          <div className="p-2 rounded-xl bg-indigo-50 text-ink">
            <CalendarCheck2 className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-2xl font-black text-zinc-900">{totalCount}</span>
          <span className="text-xs text-zinc-400 font-medium">Total Stays</span>
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{checkedInCount} In-House</span>
          </div>
          <span className="text-zinc-400 text-[11px]">{confirmedCount} Upcoming</span>
        </div>
      </div>

      {/* 2. Channel Split: Walk-In vs Online */}
      <div
        onClick={() => onQuickFilter({ channelCategory: 'offline', channelSpecific: 'front_desk_walkin' })}
        className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-orange-300 hover:shadow-md ${
          activeFilters.channelCategory === 'offline'
            ? 'border-orange-400/50 ring-1 ring-orange-400/20'
            : 'border-zinc-200/80'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500">Origin Split</span>
          <div className="flex items-center gap-1">
            <span className="p-1.5 rounded-lg bg-orange-50 text-orange-600" title="Desk Walk-In">
              <Store className="w-3.5 h-3.5" />
            </span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600" title="Online & OTA">
              <Globe className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Dual Progress Bar */}
        <div className="space-y-1.5 mt-2">
          <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${offlinePercentage}%` }}
              className="h-full bg-orange-500 transition-all duration-300"
              title={`Walk-in: ${offlinePercentage}%`}
            />
            <div
              style={{ width: `${onlinePercentage}%` }}
              className="h-full bg-ink transition-all duration-300"
              title={`Online: ${onlinePercentage}%`}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-bold pt-0.5">
            <span className="text-orange-600">{offlineCount} Walk-Ins ({offlinePercentage}%)</span>
            <span className="text-ink">{onlineCount} Online ({onlinePercentage}%)</span>
          </div>
        </div>
      </div>

      {/* 3. Gross Revenue Generated */}
      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500">Folio Revenue</span>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-zinc-900">{formatMoney(totalRevenueUSD)}</span>
        </div>

        <div className="text-xs text-zinc-500 font-medium flex items-center justify-between">
          <span>Walk-In Share:</span>
          <strong className="text-zinc-800 font-bold">{formatMoney(walkinRevenueUSD)}</strong>
        </div>
      </div>

      {/* 4. Keycard & Front Desk Operations */}
      <div
        onClick={() => onQuickFilter({ timeframe: 'currently_in_house', status: 'Checked In' })}
        className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-indigo-300 transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500">Keycard Operations</span>
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
            <KeyRound className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-2xl font-black text-zinc-900">{activeKeysCount}</span>
          <span className="text-xs text-zinc-400 font-medium">Active RFID Keys</span>
        </div>

        <div className="text-xs text-emerald-600 font-bold flex items-center gap-1 pt-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Front Desk Encoder Synced</span>
        </div>
      </div>
    </div>
  );
};
