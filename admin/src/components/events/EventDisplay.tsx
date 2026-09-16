import React from 'react';
import { EventCard } from './EventCard';
import { Sparkles } from 'lucide-react';
import type { Event } from '../../stores/eventsStore';
import { EventsViewMode } from './EventsFiltersBar';

interface EventDisplayProps {
  filteredEvents: Event[];
  displayCurrency: 'USD' | 'NGN';
  viewMode: EventsViewMode;
  onEdit?: (event: Event) => void;
  onDelete?: (event: Event) => void;
  onViewBookings?: (event: Event) => void;
  onResetFilters?: () => void;
}

export const EventDisplay: React.FC<EventDisplayProps> = ({
  filteredEvents,
  displayCurrency,
  viewMode,
  onEdit,
  onDelete,
  onViewBookings,
  onResetFilters,
}) => {
  if (filteredEvents.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border border-zinc-200/80">
        <div className="w-16 h-16 mx-auto rounded-full bg-zinc-100 flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-zinc-400" />
        </div>
        <p className="text-sm font-semibold text-zinc-700">No events match your filter criteria.</p>
        {onResetFilters && (
          <button onClick={onResetFilters} className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer">
            Reset Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between text-xs text-zinc-500 px-1 mb-4">
        <span>Showing <strong className="text-zinc-900 font-bold">{filteredEvents.length}</strong> events</span>
        <span className="text-purple-600 font-semibold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Best Available Rate Guaranteed
        </span>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              displayCurrency="USD"
              viewMode="grid"
              onEdit={onEdit}
              onDelete={onDelete}
              onViewBookings={onViewBookings}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              displayCurrency="USD"
              viewMode="list"
              onEdit={onEdit}
              onDelete={onDelete}
              onViewBookings={onViewBookings}
            />
          ))}
        </div>
      )}
    </>
  );
};