import React from 'react';
import { Plus } from 'lucide-react';
import { DisplayCurrency } from '../bookings/bookingUtils';

interface ServicesPageHeaderProps {
  displayCurrency: DisplayCurrency;
  onToggleCurrency: () => void;
  onCreateOrder: () => void;
}

export const ServicesPageHeader: React.FC<ServicesPageHeaderProps> = ({
  displayCurrency,
  onToggleCurrency,
  onCreateOrder,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#EEF2FF] text-ink border border-indigo-100">
            Hospitality Services & Culinary
          </span>
          <span className="text-xs font-semibold text-zinc-400">
            In-Room Dining, Event Catering, Spa & Concierge
          </span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight mt-1">
          Services & Catering Operations
        </h1>
      </div>

      {/* Global Header Actions */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        <button
          type="button"
          onClick={onToggleCurrency}
          className="px-3 py-2 bg-white border border-zinc-200/90 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-zinc-50 shadow-2xs transition-colors cursor-pointer"
        >
          Currency: <span className="text-ink font-bold">{displayCurrency}</span>
        </button>

        <button
          type="button"
          onClick={onCreateOrder}
          className="px-4 py-2 bg-ink hover:bg-[#4338CA] text-white rounded-xl text-xs font-bold shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>+ Book Service / Order Dining</span>
        </button>
      </div>
    </div>
  );
};