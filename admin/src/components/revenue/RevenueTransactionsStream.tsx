import React from 'react';
import { RECENT_TRANSACTIONS } from '../../data/revenueData';

interface RevenueTransactionsStreamProps {
  formatMoney: (val: number) => string;
}

export const RevenueTransactionsStream: React.FC<RevenueTransactionsStreamProps> = ({ formatMoney }) => {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-2">
      <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <h3 className="text-base font-bold text-zinc-900">Live Cash Book & Folio Settlement Stream</h3>
            <p className="text-xs text-zinc-400 font-normal">Audited transaction records posted across terminals today</p>
          </div>
        </div>
        <span className="text-xs font-normal text-zinc-400">Real-Time Gateway Sync</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-600">
          <thead className="bg-[#FAFBFD] text-zinc-400 border-b border-zinc-100 uppercase text-[10px] font-semibold tracking-wider">
            <tr>
              <th className="py-3 px-4">Transaction ID</th>
              <th className="py-3 px-4">Folio #</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Settlement Method</th>
              <th className="py-3 px-4">Time</th>
              <th className="py-3 px-4 text-right">Amount Settled</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {RECENT_TRANSACTIONS.map((tx) => (
              <tr key={tx.id} className="hover:bg-zinc-50/80 transition-colors">
                <td className="py-3.5 px-4 font-mono font-semibold text-zinc-900">
                  <span className="text-ink">{tx.id}</span>
                </td>
                <td className="py-3.5 px-4 font-mono text-zinc-600 font-medium">{tx.folio}</td>
                <td className="py-3.5 px-4 font-medium text-zinc-800">{tx.desc}</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-zinc-100 text-zinc-700">
                    {tx.category}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-zinc-700 font-medium">{tx.method}</td>
                <td className="py-3.5 px-4 text-zinc-400 text-[11px] font-normal">{tx.time}</td>
                <td className="py-3.5 px-4 text-right font-bold text-zinc-900 text-sm">{formatMoney(tx.amountUSD)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
