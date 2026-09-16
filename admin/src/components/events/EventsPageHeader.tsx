import React from 'react';
import { Plus, Calendar } from 'lucide-react';
import { DisplayCurrency } from '../../components/bookings/bookingUtils';

interface EventsPageHeaderProps {
  displayCurrency: DisplayCurrency;
  onToggleCurrency: () => void;
  onCreateEvent: () => void;
}

export const EventsPageHeader: React.FC<EventsPageHeaderProps> = ({
  displayCurrency,
  onToggleCurrency,
  onCreateEvent,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-900 border border-purple-100">
            Events Center
          </span>
          <span className="text-xs font-semibold text-zinc-400">{0} Events & Parties</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight mt-1">
          Events & Parties Management
        </h1>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        <button
          onClick={onToggleCurrency}
          className="px-3 py-2 bg-white border border-zinc-200/90 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-zinc-50 shadow-2xs transition-colors cursor-pointer"
        >
          Currency: <span className="text-purple-600 font-bold">{displayCurrency}</span>
        </button>

        <button
          type="button"
          onClick={onCreateEvent}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Event / Party</span>
        </button>
      </div>
    </div>
  );
};