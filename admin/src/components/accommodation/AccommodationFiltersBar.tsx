import React from 'react';
import { Search, ArrowUpDown, LayoutGrid, List } from 'lucide-react';
import { useAccommodationStore, SortBy, StatusFilter } from '../../stores/accommodationStore';
import { AccommodationRoom } from '../../data/accommodationData';

interface AccommodationFiltersBarProps {
  rooms: AccommodationRoom[];
}

export const AccommodationFiltersBar: React.FC<AccommodationFiltersBarProps> = ({ rooms }) => {
  const {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    statusFilter,
    setStatusFilter,
  } = useAccommodationStore();

  return (
    <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full lg:max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search suite name, location, or amenities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-zinc-50 border border-zinc-200/80 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
          />
        </div>

        {/* Right Toolbar Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap sm:flex-nowrap w-full lg:w-auto justify-between sm:justify-end">
          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-zinc-50 px-2.5 py-1.5 border border-zinc-200/80 rounded-xl flex-1 sm:flex-none">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="text-[11px] text-zinc-400 font-medium hidden xs:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value as SortBy)}
              className="text-xs bg-transparent font-semibold text-zinc-800 outline-none cursor-pointer w-full sm:w-auto"
            >
              <option value="recommended">Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>

          {/* Status Quick Filter */}
          <div className="flex items-center gap-1.5 bg-zinc-50 px-2.5 py-1.5 border border-zinc-200/80 rounded-xl flex-1 sm:flex-none">
            <span className="text-[11px] text-zinc-400 font-medium hidden xs:inline">Status:</span>
            <select
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value as StatusFilter)}
              className="text-xs bg-transparent font-semibold text-zinc-800 outline-none cursor-pointer w-full sm:w-auto"
            >
              <option value="all">All ({rooms.length})</option>
              <option value="available">Walk-In (50)</option>
              <option value="occupied">Occupied</option>
            </select>
          </div>

          {/* Grid / List View Toggle */}
          <div className="flex items-center p-0.5 bg-zinc-100 rounded-xl border border-zinc-200/80 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};