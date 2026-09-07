import React from 'react';
import { SettingsPanel } from './SettingsPanel';

interface BillingTaxSectionProps {
  currency: string;
  onCurrencyChange: (value: string) => void;
}

export const BillingTaxSection: React.FC<BillingTaxSectionProps> = ({
  currency,
  onCurrencyChange,
}) => {
  return (
    <SettingsPanel title="Financial & Currency Configuration" meta="Section 03 · Billing & Tax">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block text-zinc-500 font-medium mb-1.5">Base Folio Currency</label>
          <select
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#05C168]/20 focus:border-[#05C168]"
          >
            <option>USD ($)</option>
            <option>EUR (€)</option>
            <option>GBP (£)</option>
            <option>IDR (Rp)</option>
            <option>SGD (S$)</option>
          </select>
        </div>
        <div>
          <label className="block text-zinc-500 font-medium mb-1.5">Municipal & Hospitality Tax (%)</label>
          <input
            type="number"
            defaultValue={11}
            className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#05C168]/20 focus:border-[#05C168]"
          />
        </div>
      </div>
    </SettingsPanel>
  );
};