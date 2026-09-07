import React from 'react';

interface AddOnsSectionProps {
  currency: 'USD' | 'NGN';
  includeBreakfast: boolean;
  onToggleBreakfast: () => void;
  includeAirportTransfer: boolean;
  onToggleAirportTransfer: () => void;
  includeLateCheckout: boolean;
  onToggleLateCheckout: () => void;
  specialRequests: string;
  onSpecialRequestsChange: (value: string) => void;
}

export const AddOnsSection: React.FC<AddOnsSectionProps> = ({
  currency,
  includeBreakfast,
  onToggleBreakfast,
  includeAirportTransfer,
  onToggleAirportTransfer,
  includeLateCheckout,
  onToggleLateCheckout,
  specialRequests,
  onSpecialRequestsChange,
}) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[#EEF2FF] text-ink flex items-center justify-center text-xs font-black">
            3
          </div>
          <h2 className="text-sm font-bold text-zinc-900">Add-On Amenities & Preferences</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <label
          onClick={onToggleBreakfast}
          className={`p-3 rounded-lg border cursor-pointer flex flex-col justify-between transition-all select-none ${
            includeBreakfast
              ? 'border-ink bg-[#EEF2FF]/60 text-ink font-bold'
              : 'border-zinc-200 bg-white text-zinc-600'
          }`}
        >
          <span className="font-bold">Buffet Breakfast</span>
          <span className="text-[11px] opacity-80 mt-0.5">Included in Rate</span>
        </label>

        <label
          onClick={onToggleAirportTransfer}
          className={`p-3 rounded-lg border cursor-pointer flex flex-col justify-between transition-all select-none ${
            includeAirportTransfer
              ? 'border-ink bg-[#EEF2FF]/60 text-ink font-bold'
              : 'border-zinc-200 bg-white text-zinc-600'
          }`}
        >
          <span className="font-bold">Chauffeured Pickup</span>
          <span className="text-[11px] opacity-80 mt-0.5">
            {currency === 'NGN' ? '+₦95,000' : '+$60'}
          </span>
        </label>

        <label
          onClick={onToggleLateCheckout}
          className={`p-3 rounded-lg border cursor-pointer flex flex-col justify-between transition-all select-none ${
            includeLateCheckout
              ? 'border-ink bg-[#EEF2FF]/60 text-ink font-bold'
              : 'border-zinc-200 bg-white text-zinc-600'
          }`}
        >
          <span className="font-bold">Late Checkout (4 PM)</span>
          <span className="text-[11px] opacity-80 mt-0.5">
            {currency === 'NGN' ? '+₦65,000' : '+$40'}
          </span>
        </label>
      </div>

      <div>
        <label className="block text-xs font-semibold text-zinc-700 mb-1">Reception / Butler Notes</label>
        <textarea
          rows={2}
          value={specialRequests}
          onChange={(e) => onSpecialRequestsChange(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200/80 rounded-lg text-zinc-900 focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink"
        />
      </div>
    </div>
  );
};