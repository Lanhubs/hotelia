import React from 'react';
import { Search, Filter, ArrowUpDown, LayoutGrid, List } from 'lucide-react';

export type EventsViewMode = 'grid' | 'list';

interface EventsFiltersBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  viewMode: EventsViewMode;
  onViewModeChange: (mode: EventsViewMode) => void;
  totalCount: number;
  filteredCount: number;
  sortBy: 'recommended' | 'date_asc' | 'date_desc' | 'title' | 'capacity' | 'revenue';
  onSortChange: (sortBy: 'recommended' | 'date_asc' | 'date_desc' | 'title' | 'capacity' | 'revenue') => void;
  statusFilter: 'all' | 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  onStatusChange: (status: 'all' | 'scheduled' | 'ongoing' | 'completed' | 'cancelled') => void;
  dateFrom: string;
  onDateFromChange: (date: string) => void;
  dateTo: string;
  onDateToChange: (date: string) => void;
  onResetFilters?: () => void;
}

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'date_asc', label: 'Date: Earliest First' },
  { value: 'date_desc', label: 'Date: Latest First' },
  { value: 'title', label: 'Title A-Z' },
  { value: 'capacity', label: 'Capacity' },
  { value: 'revenue', label: 'Revenue' },
] as const;

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
] as const;

export const EventsFiltersBar: React.FC<EventsFiltersBarProps> = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  totalCount,
  filteredCount,
  sortBy,
  onSortChange,
  statusFilter,
  onStatusChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  onResetFilters,
}) => {
  return (
    <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="relative flex-1 w-full lg:max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search event title, venue, category..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-zinc-50 border border-zinc-200/80 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 font-medium"
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

        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap sm:flex-nowrap w-full lg:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 bg-zinc-50 px-2.5 py-1.5 border border-zinc-200/80 rounded-xl flex-1 sm:flex-none">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="text-[11px] text-zinc-400 font-medium hidden xs:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e: any) => onSortChange(e.target.value)}
              className="text-xs bg-transparent font-semibold text-zinc-800 outline-none cursor-pointer w-full sm:w-auto"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-zinc-50 px-2.5 py-1.5 border border-zinc-200/80 rounded-xl flex-1 sm:flex-none">
            <span className="text-[11px] text-zinc-400 font-medium hidden xs:inline">Status:</span>
            <select
              value={statusFilter}
              onChange={(e: any) => onStatusChange(e.target.value)}
              className="text-xs bg-transparent font-semibold text-zinc-800 outline-none cursor-pointer w-full sm:w-auto"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-zinc-50 px-2.5 py-1.5 border border-zinc-200/80 rounded-xl flex-1 sm:flex-none">
            <span className="text-[11px] text-zinc-400 font-medium hidden xs:inline">From:</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-white border border-zinc-200 text-zinc-700 w-36"
            />
            <span className="text-[11px] text-zinc-400">To</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-white border border-zinc-200 text-zinc-700 w-36"
            />
          </div>

          <div className="flex items-center p-0.5 bg-zinc-100 rounded-xl border border-zinc-200/80 shrink-0">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-purple-600 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-purple-600 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {onResetFilters && (
            <button
              onClick={onResetFilters}
              className="px-3 py-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-zinc-400 font-medium">
          <span>Showing <strong className="text-zinc-900 font-bold">{filteredCount}</strong> of <strong className="text-zinc-900 font-bold">{totalCount}</strong> events</span>
        </div>
      </div>
    </div>
  );
};