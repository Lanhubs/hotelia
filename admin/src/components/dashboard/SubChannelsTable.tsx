import React from 'react';
import { Globe, Store } from 'lucide-react';
import { SubChannelData } from '../../data/dashboardData';
import { useBookingStore } from '../../stores/bookingStore';

interface SubChannelsTableProps {
  data: SubChannelData[];
}

export const SubChannelsTable: React.FC<SubChannelsTableProps> = ({ data }) => {
  const { displayCurrency } = useBookingStore();

  const formatMoney = (amountUSD: number) => {
    if (displayCurrency === 'NGN') {
      return `₦${(amountUSD * 1600).toLocaleString()}`;
    }
    return `$${amountUSD.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-zinc-600">
        <thead className="bg-[#FAFBFD] text-zinc-400 text-[10px] font-semibold uppercase border-b border-zinc-100">
          <tr>
            <th className="py-2.5 px-3">Channel Type</th>
            <th className="py-2.5 px-3">Category</th>
            <th className="py-2.5 px-3">Bookings</th>
            <th className="py-2.5 px-3">Gross Revenue</th>
            <th className="py-2.5 px-3">Avg Ticket</th>
            <th className="py-2.5 px-3">Commission Drag</th>
            <th className="py-2.5 px-3 text-right">Net Margin</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-zinc-50/70">
              <td className="py-2.5 px-3 font-semibold text-zinc-900 flex items-center gap-1.5">
                {row.channelIcon === 'store' && <Store className="w-3.5 h-3.5 text-amber-600" />}
                {row.channelIcon === 'globe' && <Globe className="w-3.5 h-3.5 text-indigo-600" />}
                {row.channelIcon === 'globeBlue' && <Globe className="w-3.5 h-3.5 text-blue-600" />}
                {row.channelType}
              </td>
              <td className="py-2.5 px-3">
                <span className={`px-2 py-0.5 ${row.categoryClass} rounded font-semibold text-[10px]`}>
                  {row.category}
                </span>
              </td>
              <td className="py-2.5 px-3 font-bold text-zinc-900">{row.bookings}</td>
              <td className="py-2.5 px-3 font-bold text-zinc-900">{formatMoney(row.grossRevenue)}</td>
              <td className={`py-2.5 px-3 font-semibold ${row.isPositive ? 'text-emerald-700' : 'text-zinc-700'}`}>
                {formatMoney(row.avgTicket)}
              </td>
              <td className={`py-2.5 px-3 font-semibold ${row.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {row.commissionDrag}
              </td>
              <td className={`py-2.5 px-3 text-right font-bold ${row.isPositive ? 'text-emerald-600' : 'text-zinc-700'}`}>
                {row.netMargin}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};