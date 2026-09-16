import React from 'react';
import { Search, Filter, Calendar, ToggleLeft } from 'lucide-react';

export type EventsViewMode = 'table' | 'calendar';

interface EventsControlBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  viewMode: EventsViewMode;
  onViewModeChange: (mode: EventsViewMode) => void;
  totalCount: number;
  filteredCount: number;
  selectedEventType: string;
  onEventTypeChange: (type: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  dateFrom: string;
  onDateFromChange: (date: string) => void;
  dateTo: string;
  onDateToChange: (date: string) => void;
}

const EVENT_TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'party', label: 'Party' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'gala', label: 'Gala' },
  { value: 'conference', label: 'Conference' },
  { value: 'social', label: 'Social' },
  { value: 'other', label: 'Other' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const EventsControlBar: React.FC<EventsControlBarProps> = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  totalCount,
  filteredCount,
  selectedEventType,
  onEventTypeChange,
  selectedStatus,
  onStatusChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3.5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events by title, venue, category..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400 hover:text-zinc-700"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center p-1 bg-zinc-100/80 rounded-xl border border-zinc-200/60">
          <button
            onClick={() => onViewModeChange('table')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Table
          </button>
          <button
            onClick={() => onViewModeChange('calendar')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'calendar'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Calendar
          </button>
        </div>
      </div>

      <div className="pt-2 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 overflow-x-auto custom-scrollbar">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-zinc-400 font-semibold mr-1 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Filters:
            </span>

            <select
              value={selectedEventType}
              onChange={(e) => onEventTypeChange(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap bg-white border border-zinc-200 text-zinc-700"
            >
              {EVENT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap bg-white border border-zinc-200 text-zinc-700"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-zinc-400">From</span>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => onDateFromChange(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-white border border-zinc-200 text-zinc-700 w-36"
              />
              <span className="text-xs text-zinc-400">To</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => onDateToChange(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-white border border-zinc-200 text-zinc-700 w-36"
              />
            </div>
          </div>
        </div>

        <div className="text-xs text-zinc-400 font-medium whitespace-nowrap shrink-0">
          Showing <strong className="text-zinc-900 font-bold">{filteredCount}</strong> of <strong className="text-zinc-900 font-bold">{totalCount}</strong> events
        </div>
      </div>
    </div>
  );
};