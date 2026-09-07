import React from 'react';
import { ChefHat, DollarSign, Clock, Sparkles, TrendingUp } from 'lucide-react';
import { DisplayCurrency, formatMoney } from '../bookings/bookingUtils';

interface ServiceMetricsStripProps {
  displayCurrency: DisplayCurrency;
  activeOrdersCount: number;
  inKitchenCount: number;
  revenue: number;
}

export const ServiceMetricsStrip: React.FC<ServiceMetricsStripProps> = ({
  displayCurrency,
  activeOrdersCount,
  inKitchenCount,
  revenue,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500">Live Active Orders</span>
          <div className="p-2 rounded-xl bg-indigo-50 text-ink">
            <ChefHat className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-zinc-900">{activeOrdersCount}</span>
          <span className="text-xs text-zinc-400 font-medium">In Queue / Delivery</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold">
          <span className="w-2 h-2 rounded-full bg-ink animate-pulse" />
          <span>{inKitchenCount} In Kitchen Station</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500">Services Daily Volume</span>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-zinc-900">{formatMoney(revenue, displayCurrency)}</span>
        </div>
        <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+18.4% auxiliary yield</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500">Average Fulfillment</span>
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-zinc-900">22 min</span>
          <span className="text-xs text-zinc-400 font-medium">Order-to-Suite</span>
        </div>
        <div className="text-xs text-zinc-500 font-medium">98.2% on-time benchmark</div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500">VIP Experience Index</span>
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-zinc-900">4.96 ★</span>
        </div>
        <div className="text-xs text-purple-700 font-semibold">100% Folio Billed Cleanly</div>
      </div>
    </div>
  );
};