import React from 'react';
import { X, ChefHat } from 'lucide-react';
import { ServiceMenuItem, SERVICE_MENU_CATALOG } from '../../data/servicesData';
import { DisplayCurrency, formatMoney } from '../bookings/bookingUtils';

interface CreateServiceOrderModalProps {
  items: { item: ServiceMenuItem; qty: number }[];
  onAddItem: (item: ServiceMenuItem) => void;
  room: string;
  onRoomChange: (value: string) => void;
  vipTier: 'Diamond' | 'Gold' | 'Silver' | 'Standard';
  onVipTierChange: (value: 'Diamond' | 'Gold' | 'Silver' | 'Standard') => void;
  scheduledTime: string;
  onScheduledTimeChange: (value: string) => void;
  allergens: string;
  onAllergensChange: (value: string) => void;
  displayCurrency: DisplayCurrency;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const CreateServiceOrderModal: React.FC<CreateServiceOrderModalProps> = ({
  items,
  onAddItem,
  room,
  onRoomChange,
  vipTier,
  onVipTierChange,
  scheduledTime,
  onScheduledTimeChange,
  allergens,
  onAllergensChange,
  displayCurrency,
  onSubmit,
  onClose,
}) => {
  const totalUSD = items.reduce((sum, i) => sum + i.item.priceUSD * i.qty, 0);

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-zinc-200 animate-in zoom-in-95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-ink flex items-center justify-center font-bold">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">Book In-Room Service / Catering</h3>
              <p className="text-xs text-zinc-400">Post charges directly to resident suite folio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Room & Guest Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Resident Suite #</label>
              <select
                value={room}
                onChange={(e) => onRoomChange(e.target.value)}
                className="w-full p-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-zinc-900"
              >
                <option value="301">Room #301 (Alexander Hayes)</option>
                <option value="104">Room #104 (Sophia Loren)</option>
                <option value="201">Room #201 (David Zhang)</option>
                <option value="303">Room #303 (Sir Arthur Stirling)</option>
                <option value="102">Room #102 (Elena Vane)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">VIP Tier</label>
              <select
                value={vipTier}
                onChange={(e) => onVipTierChange(e.target.value as any)}
                className="w-full p-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-zinc-900"
              >
                <option value="Diamond">Diamond VIP</option>
                <option value="Gold">Gold VIP</option>
                <option value="Silver">Silver Tier</option>
                <option value="Standard">Standard</option>
              </select>
            </div>
          </div>

          {/* Items Selected */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-700 flex items-center justify-between">
              <span>Selected Service Items</span>
              <span className="text-[11px] text-zinc-400">Click below to add more</span>
            </label>

            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2 max-h-36 overflow-y-auto">
              {items.map((entry, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-900">{entry.item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500">Qty: {entry.qty}</span>
                    <strong className="text-zinc-900 font-bold">
                      {formatMoney(entry.item.priceUSD * entry.qty, displayCurrency)}
                    </strong>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Add Buttons */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {SERVICE_MENU_CATALOG.slice(0, 4).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onAddItem(m)}
                  className="px-2.5 py-1 bg-white border border-zinc-200 rounded-lg text-[11px] font-semibold hover:border-indigo-300 hover:text-ink transition-colors cursor-pointer"
                >
                  + {m.name.split(' ')[0]} ({formatMoney(m.priceUSD, displayCurrency)})
                </button>
              ))}
            </div>
          </div>

          {/* Scheduled Time & Allergens */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Scheduled Delivery</label>
              <input
                type="text"
                value={scheduledTime}
                onChange={(e) => onScheduledTimeChange(e.target.value)}
                placeholder="e.g. 08:30 PM Tonight"
                className="w-full p-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Allergen / Special Note</label>
              <input
                type="text"
                value={allergens}
                onChange={(e) => onAllergensChange(e.target.value)}
                placeholder="e.g. Gluten free, extra ice"
                className="w-full p-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl"
              />
            </div>
          </div>

          {/* Total & Submit */}
          <div className="pt-3 border-t border-zinc-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-400 block">Total Folio Charge</span>
              <strong className="text-lg font-black text-ink">
                {formatMoney(totalUSD, displayCurrency)}
              </strong>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-ink hover:bg-[#4338CA] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              Confirm & Post to Room Folio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};