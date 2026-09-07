import React from 'react';
import { TrendingUp, Sparkles, Store } from 'lucide-react';

interface RevenueKpiCardsProps {
  totalGrossWeekUSD: number;
  formatMoney: (val: number) => string;
}

export const RevenueKpiCards: React.FC<RevenueKpiCardsProps> = ({
  totalGrossWeekUSD,
  formatMoney,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-1.5">
        <span className="text-xs font-medium text-zinc-400 block">Gross Operating Revenue</span>
        <div className="text-2xl font-bold text-zinc-900 tracking-tight">{formatMoney(totalGrossWeekUSD)}</div>
        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+12.4% vs forecast</span>
        </div>
        <div className="text-[11px] text-zinc-400 font-normal">96.4% of monthly target</div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-1.5">
        <span className="text-xs font-medium text-zinc-400 block">RevPAR (Yield / Room)</span>
        <div className="text-2xl font-bold text-zinc-900 tracking-tight">{formatMoney(324.5)}</div>
        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+$44.50 vs CompSet</span>
        </div>
        <div className="text-[11px] text-zinc-400 font-normal">Luxury Tier Benchmark #1</div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-1.5">
        <span className="text-xs font-medium text-zinc-400 block">Average Daily Rate (ADR)</span>
        <div className="text-2xl font-bold text-zinc-900 tracking-tight">{formatMoney(368.0)}</div>
        <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Dynamic Surge Rate</span>
        </div>
        <div className="text-[11px] text-zinc-400 font-normal">+6.8% YoY index</div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-1.5">
        <span className="text-xs font-medium text-zinc-400 block">F&B & Ancillary Spend</span>
        <div className="text-2xl font-bold text-zinc-900 tracking-tight">{formatMoney(197900)}</div>
        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>42.9% of hotel yield</span>
        </div>
        <div className="text-[11px] text-zinc-400 font-normal">Dining, Spa & Charters</div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-1.5">
        <span className="text-xs font-medium text-zinc-400 block">OTA Commission Savings</span>
        <div className="text-2xl font-bold text-zinc-900 tracking-tight">{formatMoney(34100)}</div>
        <div className="flex items-center gap-1 text-xs font-semibold text-orange-600">
          <Store className="w-3.5 h-3.5" />
          <span>Walk-In & Direct Web</span>
        </div>
        <div className="text-[11px] text-zinc-400 font-normal">0% Commission drag</div>
      </div>
    </div>
  );
};
