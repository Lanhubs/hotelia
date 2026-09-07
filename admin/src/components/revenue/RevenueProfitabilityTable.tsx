import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { DEPARTMENT_PROFITABILITY } from '../../data/revenueData';

interface RevenueProfitabilityTableProps {
  formatMoney: (val: number) => string;
}

export const RevenueProfitabilityTable: React.FC<RevenueProfitabilityTableProps> = ({ formatMoney }) => {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="p-4 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-zinc-900">Departmental P&L & Profitability Matrix</h2>
          <p className="text-xs text-zinc-400 font-normal">
            Itemized Gross Operating Profit (GOP) and operating margin efficiencies by division.
          </p>
        </div>
        <span className="px-3 py-1 bg-indigo-50 text-ink border border-indigo-100 rounded-xl text-xs font-semibold">
          Average Hotel GOP Margin: 72.8%
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-600">
          <thead className="bg-[#FAFBFD] text-zinc-400 border-b border-zinc-100 uppercase text-[10px] font-semibold tracking-wider">
            <tr>
              <th className="py-3 px-4">Hospitality Division</th>
              <th className="py-3 px-4">Gross Revenue</th>
              <th className="py-3 px-4">Direct Operating Cost</th>
              <th className="py-3 px-4">Gross Operating Profit (GOP)</th>
              <th className="py-3 px-4">Net Margin %</th>
              <th className="py-3 px-4 text-right">Performance Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {DEPARTMENT_PROFITABILITY.map((dept, idx) => (
              <tr key={idx} className="hover:bg-zinc-50/80 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-zinc-900">{dept.department}</td>
                <td className="py-3.5 px-4 font-bold text-zinc-900">{formatMoney(dept.grossRevenueUSD)}</td>
                <td className="py-3.5 px-4 text-zinc-500 font-medium">{formatMoney(dept.operatingCostUSD)}</td>
                <td className="py-3.5 px-4 font-bold text-ink">{formatMoney(dept.gopUSD)}</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-md font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {dept.marginPct}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-indigo-50 text-ink">
                    <CheckCircle2 className="w-3 h-3 text-ink" />
                    <span>{dept.status}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
