import React from 'react';
import {
  Search,
  ArrowUpDown,
  RotateCcw,
  LayoutGrid,
  ListFilter,
  Users,
} from 'lucide-react';
import { BookingFilters } from '../../types/booking';
import { BookingChannelFilterPills } from './BookingChannelFilterPills';

interface BookingFilterBarProps {
  filters: BookingFilters;
  onFilterChange: (newFilters: Partial<BookingFilters>) => void;
  onReset: () => void;
  totalFilteredCount: number;
  totalCount: number;
  viewMode: 'table' | 'cards' | 'inhouse';
  onViewModeChange: (mode: 'table' | 'cards' | 'inhouse') => void;
}

export const BookingFilterBar: React.FC<BookingFilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  totalFilteredCount,
  totalCount,
  viewMode,
  onViewModeChange,
}) => {
  const isFiltered =
    filters.searchQuery !== '' ||
    filters.channelCategory !== 'all' ||
    filters.channelSpecific !== 'all' ||
    filters.status !== 'all' ||
    filters.timeframe !== 'all';

  return (
    <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3.5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by guest name, folio code (e.g. BK-9821), room #, or email..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full pl-10 pr-14 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-zinc-400 hover:text-zinc-700 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center p-1 bg-zinc-100/80 rounded-xl border border-zinc-200/60">
            <button
              onClick={() => onViewModeChange('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Ledger</span>
            </button>
            <button
              onClick={() => onViewModeChange('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'cards' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Stay Cards</span>
            </button>
            <button
              onClick={() => onViewModeChange('inhouse')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'inhouse' ? 'bg-white text-emerald-700 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>In-House</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-zinc-50 px-3 py-2 border border-zinc-200 rounded-xl text-xs">
            <span className="text-zinc-400 font-medium">Status:</span>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange({ status: e.target.value as any })}
              className="bg-transparent font-bold text-zinc-800 outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Checked In">Checked In</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Checked Out">Checked Out</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-zinc-50 px-3 py-2 border border-zinc-200 rounded-xl text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
              className="bg-transparent font-bold text-zinc-800 outline-none cursor-pointer"
            >
              <option value="latest_booked">Latest Booked</option>
              <option value="check_in_asc">Check-In (Earliest)</option>
              <option value="check_in_desc">Check-In (Latest)</option>
              <option value="amount_desc">Highest Amount</option>
              <option value="guest_name">Guest Name (A-Z)</option>
            </select>
          </div>

          {isFiltered && (
            <button
              onClick={onReset}
              className="px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      <BookingChannelFilterPills
        filters={filters}
        onFilterChange={onFilterChange}
        totalFilteredCount={totalFilteredCount}
        totalCount={totalCount}
      />
    </div>
  );
};
