import React from 'react';
import { CreditCard, Globe, Lock, ShieldAlert } from 'lucide-react';
import { HotelSettingsData } from '../../hooks/useSettingsApi';

interface GatewaysIntegrationsSectionProps {
  settings: Partial<HotelSettingsData>;
  onChange: (fields: Partial<HotelSettingsData>) => void;
}

export const GatewaysIntegrationsSection: React.FC<GatewaysIntegrationsSectionProps> = ({
  settings,
  onChange,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
          <CreditCard className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-zinc-900">Payment Gateways & OTA Channel Integrations</h3>
          <p className="text-xs text-zinc-500 font-medium">Manage API tokens for online payment processors, POS terminals, and Booking.com channel manager</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-emerald-600" /> Paystack Live Public API Key
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={settings.paystackPublicKey || ''}
              onChange={(e) => onChange({ paystackPublicKey: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-indigo-600" /> Stripe Live Publishable Key
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={settings.stripePublicKey || ''}
              onChange={(e) => onChange({ stripePublicKey: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-blue-600" /> OTA Channel Manager Sync Secret Token
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={settings.otaChannelManagerToken || ''}
              onChange={(e) => onChange({ otaChannelManagerToken: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 font-mono"
            />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>API Tokens are encrypted in PostgreSQL using AES-256 and stored securely for automated folio settlement.</span>
        </div>
      </div>
    </div>
  );
};
