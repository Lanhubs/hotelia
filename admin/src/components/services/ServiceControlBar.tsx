import React from 'react';
import { Search, Filter, Utensils, ChefHat, Sparkles, Ship } from 'lucide-react';

export type ServiceTab = 'board' | 'menu' | 'ledger';

interface ServiceControlBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeTab: ServiceTab;
  onTabChange: (tab: ServiceTab) => void;
  menuCount: number;
  ordersCount: number;
  selectedDepartment: string;
  onDepartmentChange: (department: string) => void;
  filteredCount: number;
}

export const ServiceControlBar: React.FC<ServiceControlBarProps> = ({
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  menuCount,
  ordersCount,
  selectedDepartment,
  onDepartmentChange,
  filteredCount,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3.5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by guest, room # (e.g. 301), menu item, or ticket #..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink transition-all"
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

        {/* Tab Views Switcher */}
        <div className="flex items-center p-1 bg-zinc-100/80 rounded-xl border border-zinc-200/60">
          <button
            onClick={() => onTabChange('board')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'board'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Operations Board
          </button>
          <button
            onClick={() => onTabChange('menu')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'menu'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Menu & Catalog ({menuCount})
          </button>
          <button
            onClick={() => onTabChange('ledger')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ledger'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Services Ledger ({ordersCount})
          </button>
        </div>
      </div>

      {/* Department Origin Tabs */}
      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between gap-2 overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-1.5 flex-nowrap">
          <span className="text-xs text-zinc-400 font-semibold mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Department:
          </span>

          <button
            onClick={() => onDepartmentChange('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedDepartment === 'all'
                ? 'bg-ink text-white shadow-xs'
                : 'bg-zinc-50 text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            All Departments
          </button>

          <button
            onClick={() => onDepartmentChange('culinary')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedDepartment === 'culinary'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-orange-50/70 text-orange-800 border border-orange-200/60 hover:bg-orange-100'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Fine Dining & Room Service</span>
          </button>

          <button
            onClick={() => onDepartmentChange('catering')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedDepartment === 'catering'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50/70 text-emerald-800 border border-emerald-200/60 hover:bg-emerald-100'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Event & Villa Catering</span>
          </button>

          <button
            onClick={() => onDepartmentChange('spa')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedDepartment === 'spa'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-purple-50/70 text-purple-800 border border-purple-200/60 hover:bg-purple-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Spa & Wellness</span>
          </button>

          <button
            onClick={() => onDepartmentChange('concierge')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedDepartment === 'concierge'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-indigo-50/70 text-indigo-800 border border-indigo-200/60 hover:bg-indigo-100'
            }`}
          >
            <Ship className="w-3.5 h-3.5" />
            <span>VIP Concierge & Yacht</span>
          </button>
        </div>

        <div className="text-xs text-zinc-400 font-medium whitespace-nowrap shrink-0">
          Filtered: <strong className="text-zinc-900 font-bold">{filteredCount}</strong> orders
        </div>
      </div>
    </div>
  );
};