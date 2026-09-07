import React, { useState } from 'react';
import { Download, CheckCircle2, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip,
  CartesianGrid, Legend, PieChart, Pie, Cell,
} from 'recharts';
import { useBookingStore } from '../stores/bookingStore';
import { REVENUE_TIMELINE_DATA, CHANNEL_REVENUE_PIE } from '../data/revenueData';
import { RevenueKpiCards } from '../components/revenue/RevenueKpiCards';
import { RevenueProfitabilityTable } from '../components/revenue/RevenueProfitabilityTable';
import { RevenueTransactionsStream } from '../components/revenue/RevenueTransactionsStream';
import { useRevenueReportsApi } from '../hooks/useRevenueApi';

export const RevenuePage: React.FC = () => {
  const { displayCurrency, setDisplayCurrency } = useBookingStore();
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month' | 'ytd'>('week');
  const [chartView, setChartView] = useState<'stacked' | 'area'>('stacked');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { data: reportsData, isLoading } = useRevenueReportsApi(timeframe);

  const formatMoney = (amountUSD: number) => {
    if (displayCurrency === 'NGN') {
      return `₦${(amountUSD * 1600).toLocaleString()}`;
    }
    return `$${amountUSD.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const handleExportReport = (format: 'pdf' | 'csv' | 'print') => {
    if (format === 'print') { window.print(); return; }
    setToastMessage(`Generating executive P&L statement (${format.toUpperCase()})...`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const timelineData = reportsData?.data && reportsData.data.length > 0
    ? reportsData.data.map((d: any) => ({
        day: d.day ? new Date(d.day).toLocaleDateString([], { weekday: 'short', month: 'numeric', day: 'numeric' }) : 'Day',
        rooms: Math.round(Number(d.revenue || 0) * 0.7),
        fnb: Math.round(Number(d.revenue || 0) * 0.2),
        spa: Math.round(Number(d.revenue || 0) * 0.06),
        concierge: Math.round(Number(d.revenue || 0) * 0.04),
        total: Math.round(Number(d.revenue || 0)),
        occupancy: 85,
      }))
    : REVENUE_TIMELINE_DATA;

  const totalGrossWeekUSD = timelineData.reduce((sum: number, d: any) => sum + (d.total || 0), 0);

  return (
    <div className="space-y-6 pb-14 font-sans text-zinc-900">
      {isLoading && (
        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 font-semibold flex items-center justify-between">
          <span>Hydrating live financial revenue reports from API backend...</span>
          <span className="w-2 h-2 bg-indigo-600 rounded-full animate-ping" />
        </div>
      )}

      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /><span>{toastMessage}</span></div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-700 hover:text-emerald-900 font-medium underline cursor-pointer">Dismiss</button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-900 border border-indigo-100">
              Executive Financial Intelligence
            </span>
            <span className="text-xs font-normal text-zinc-400">RevPAR, ADR, GOPPAR & Yield Analytics</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight mt-1">Revenue Analytics & Financial Yield</h1>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <div className="p-1 bg-white border border-zinc-200 rounded-xl flex items-center shadow-2xs">
            <button onClick={() => setTimeframe('today')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${timeframe === 'today' ? 'bg-indigo-600 text-white' : 'text-zinc-600'}`}>Today</button>
            <button onClick={() => setTimeframe('week')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${timeframe === 'week' ? 'bg-indigo-600 text-white' : 'text-zinc-600'}`}>Trailing 7D</button>
            <button onClick={() => setTimeframe('month')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${timeframe === 'month' ? 'bg-indigo-600 text-white' : 'text-zinc-600'}`}>Month</button>
            <button onClick={() => setTimeframe('ytd')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${timeframe === 'ytd' ? 'bg-indigo-600 text-white' : 'text-zinc-600'}`}>YTD</button>
          </div>

          <button onClick={() => setDisplayCurrency(displayCurrency === 'USD' ? 'NGN' : 'USD')} className="px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700">
            Currency: <span className="text-indigo-600 font-bold">{displayCurrency}</span>
          </button>

          <button onClick={() => handleExportReport('pdf')} className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs">
            <Download className="w-3.5 h-3.5" />
            <span>Export P&L</span>
          </button>
        </div>
      </div>

      <RevenueKpiCards totalGrossWeekUSD={totalGrossWeekUSD} formatMoney={formatMoney} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <h3 className="text-base font-bold text-zinc-900">Departmental Daily Cashflow Streams</h3>
            </div>
            <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-lg border border-zinc-200/60">
              <button onClick={() => setChartView('stacked')} className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${chartView === 'stacked' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500'}`}>Stacked Bars</button>
              <button onClick={() => setChartView('area')} className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${chartView === 'area' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500'}`}>Area Waves</button>
            </div>
          </div>

          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {chartView === 'stacked' ? (
                <BarChart data={timelineData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                  <XAxis dataKey="day" stroke="#a1a1aa" fontSize={11} tickLine={false} />
                  <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="rooms" name="Rooms Accommodation" stackId="a" fill="#4F46E5" />
                  <Bar dataKey="fnb" name="Dining & Catering" stackId="a" fill="#F97316" />
                  <Bar dataKey="spa" name="Spa Sanctuary" stackId="a" fill="#A855F7" />
                  <Bar dataKey="concierge" name="VIP Charters" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                  <XAxis dataKey="day" stroke="#a1a1aa" fontSize={11} tickLine={false} />
                  <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="total" name="Total Gross Yield" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.2} />
                  <Area type="monotone" dataKey="fnb" name="Dining & Catering" stroke="#F97316" fill="#F97316" fillOpacity={0.2} />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4 flex flex-col justify-between">
          <div className="pb-2 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-orange-600" />
              <h3 className="text-base font-bold text-zinc-900">Revenue by Origin Channel</h3>
            </div>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={CHANNEL_REVENUE_PIE} cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={3} dataKey="value">
                  {CHANNEL_REVENUE_PIE.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
                <RechartsTooltip formatter={(value: any) => [`${formatMoney(Number(value))}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 text-xs divide-y divide-zinc-100 pt-1">
            {CHANNEL_REVENUE_PIE.map((ch, idx) => (
              <div key={idx} className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: ch.color }} />
                  <span className="font-semibold text-zinc-800">{ch.name}</span>
                </div>
                <div className="text-right font-bold text-zinc-900">{formatMoney(ch.value)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <RevenueProfitabilityTable formatMoney={formatMoney} />
      <RevenueTransactionsStream formatMoney={formatMoney} />
    </div>
  );
};
