import React from 'react';
import { LifeBuoy } from 'lucide-react';

export const HelpSupportPageHeader: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-600 border border-zinc-200">
            Help & Support Center
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight mt-1.5">
          How can we help you?
        </h2>
        <p className="text-xs text-zinc-400 font-medium mt-0.5">
          Self-service documentation, operational guides, and direct staff support.
        </p>
      </div>
      <div className="flex items-center gap-2.5 sm:mt-0.5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
          <LifeBuoy className="w-3.5 h-3.5" /> Support Available
        </span>
      </div>
    </div>
  );
};