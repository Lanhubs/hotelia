import React from 'react';
import { Download, FileText } from 'lucide-react';

const REPORTS = [
  { title: 'Night Audit Flash Report', description: 'End-of-day trial balance, room ledger reconciliations, and tax distributions.', updated: 'Today, 04:00 AM' },
  { title: 'Occupancy & RevPAR Forecast (30 Days)', description: 'Pacing against budget, channel pickup curves, and cancellation rates.', updated: 'Yesterday' },
  { title: 'Housekeeping Productivity & Room Turnaround', description: 'Cleaning duration per room category, inspection pass rate, linen count.', updated: '2 days ago' },
  { title: 'Guest Satisfaction Index (CSAT & NPS)', description: 'Feedback scores by department: Front Desk, Housekeeping, Dining, Spa.', updated: 'Weekly' },
];

export const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-800">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Operational & Financial Reports</h1>
          <p className="text-xs text-zinc-400 mt-0.5">Automated Night Audit summaries, Pace analysis, and P&L exports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REPORTS.map((rpt, i) => (
          <div key={i} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-semibold text-zinc-100">{rpt.title}</h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{rpt.description}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-zinc-500 text-[11px]">Generated: {rpt.updated}</span>
              <button className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium">
                <Download className="w-3.5 h-3.5" /> Export PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
