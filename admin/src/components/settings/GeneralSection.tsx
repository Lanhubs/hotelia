import React from 'react';
import { MapPin, Globe, Hash } from 'lucide-react';
import { SettingsPanel } from './SettingsPanel';

export const GeneralSection: React.FC = () => {
  return (
    <SettingsPanel title="Property Profile" meta="Section 01 · General">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 text-xs">
        <div>
          <span className="block text-zinc-500 font-medium mb-1.5">Property Name</span>
          <span className="block font-bold text-zinc-900">KEO Experience Hotel &amp; Suites</span>
        </div>

        <div>
          <span className="block text-zinc-500 font-medium mb-1.5">Operational Status</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live · Accepting Walk-Ins
          </span>
        </div>

        <div>
          <span className="block text-zinc-500 font-medium mb-1.5 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Location
          </span>
          <span className="block font-semibold text-zinc-800">Victoria Island, Lagos, Nigeria</span>
        </div>

        <div>
          <span className="block text-zinc-500 font-medium mb-1.5 flex items-center gap-1">
            <Globe className="w-3 h-3" /> Timezone
          </span>
          <span className="block font-semibold text-zinc-800">West Africa Time (UTC+1)</span>
        </div>

        <div>
          <span className="block text-zinc-500 font-medium mb-1.5 flex items-center gap-1">
            <Hash className="w-3 h-3" /> Tax Registration
          </span>
          <span className="block font-mono font-semibold text-zinc-800">VAT-RG-2026-88421</span>
        </div>
      </div>
    </SettingsPanel>
  );
};