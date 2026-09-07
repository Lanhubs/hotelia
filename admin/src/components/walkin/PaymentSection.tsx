import React from 'react';
import { CreditCard, Building, Banknote } from 'lucide-react';

export type WalkInPaymentMethod = 'card' | 'pos' | 'transfer' | 'cash';

interface PaymentSectionProps {
  currency: 'USD' | 'NGN';
  onCurrencyChange: (currency: 'USD' | 'NGN') => void;
  paymentMethod: WalkInPaymentMethod;
  onPaymentMethodChange: (method: WalkInPaymentMethod) => void;
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({
  currency,
  onCurrencyChange,
  paymentMethod,
  onPaymentMethodChange,
}) => {
  const methods: { id: WalkInPaymentMethod; label: string; icon: typeof CreditCard }[] = [
    { id: 'card', label: 'Direct Card', icon: CreditCard },
    { id: 'pos', label: 'POS Terminal', icon: CreditCard },
    { id: 'transfer', label: 'Bank Wire', icon: Building },
    { id: 'cash', label: 'Cash at Desk', icon: Banknote },
  ];

  return (
    <div className="bg-white rounded-xl p-5 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[#EEF2FF] text-ink flex items-center justify-center text-xs font-black">
            4
          </div>
          <h2 className="text-sm font-bold text-zinc-900">Payment Collection Method</h2>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onCurrencyChange('NGN')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              currency === 'NGN' ? 'bg-ink text-white shadow-xs' : 'bg-zinc-100 text-zinc-600'
            }`}
          >
            ₦ NGN
          </button>
          <button
            type="button"
            onClick={() => onCurrencyChange('USD')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              currency === 'USD' ? 'bg-ink text-white shadow-xs' : 'bg-zinc-100 text-zinc-600'
            }`}
          >
            $ USD
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {methods.map((item) => {
          const Icon = item.icon;
          const isSelected = paymentMethod === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onPaymentMethodChange(item.id)}
              className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer ${
                isSelected
                  ? 'border-ink bg-[#EEF2FF]/60 text-ink font-bold shadow-xs'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              <Icon className="w-4 h-4 mb-2" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};