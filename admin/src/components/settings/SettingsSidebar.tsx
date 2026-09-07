import React from 'react';
import { Building2, Clock, BadgeDollarSign, KeyRound, Bell, CreditCard, Users } from 'lucide-react';

export type SettingsSectionId = 'general' | 'timings' | 'billing' | 'hardware' | 'automation' | 'gateways' | 'staff';

interface SettingsSidebarProps {
  active: SettingsSectionId;
  onSelect: (section: SettingsSectionId) => void;
}

const NAV_ITEMS: { id: SettingsSectionId; label: string; sub: string; icon: typeof Clock }[] = [
  { id: 'general', label: 'Hotel Property Profile', sub: 'Brand & registration info', icon: Building2 },
  { id: 'timings', label: 'Operational Policies', sub: 'Check-in/out & fees', icon: Clock },
  { id: 'billing', label: 'Billing, Taxes & Currency', sub: 'Rates & tourism levies', icon: BadgeDollarSign },
  { id: 'hardware', label: 'RFID Keycard Encoders', sub: 'Lock hardware & IP', icon: KeyRound },
  { id: 'automation', label: 'Automation & Triggers', sub: 'SMS, receipts & audits', icon: Bell },
  { id: 'gateways', label: 'Payment & OTA Gateways', sub: 'Stripe, Paystack & OTA', icon: CreditCard },
  { id: 'staff', label: 'Staff Credentials', sub: 'Login details & PINs', icon: Users },
];

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ active, onSelect }) => {
  return (
    <aside className="lg:sticky lg:top-6">
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-2 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="px-3 pt-2.5 pb-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
            Hotel Settings · Sections
          </span>
        </div>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                  isActive ? 'bg-indigo-50/80 text-indigo-950 border border-indigo-100 font-bold shadow-2xs' : 'hover:bg-zinc-50 text-zinc-600'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-indigo-600 text-white' : 'bg-zinc-100 text-zinc-500'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className={`block text-xs font-bold truncate ${isActive ? 'text-indigo-900' : 'text-zinc-700'}`}>
                    {item.label}
                  </span>
                  <span className="block text-[10px] text-zinc-400 truncate">{item.sub}</span>
                </span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};