import React from 'react';

export const SettingsPageHeader: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-600 border border-zinc-200">
            Configuration Center
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight mt-1.5">
          Property Settings
        </h2>
        <p className="text-xs text-zinc-400 font-medium mt-0.5">
          Hotel timings, operational rules, currencies, and account configurations.
        </p>
      </div>
    </div>
  );
};