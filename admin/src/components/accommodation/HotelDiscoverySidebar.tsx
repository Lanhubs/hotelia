import React from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';

interface HotelDiscoverySidebarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  budgetMax: number;
  onBudgetChange: (value: number) => void;
  selectedBedrooms: string;
  onBedroomsChange: (value: string) => void;
  selectedBathrooms: string;
  onBathroomsChange: (value: string) => void;
  selectedMeals: string[];
  onToggleMeal: (meal: string) => void;
  selectedFacilities: string[];
  onToggleFacility: (facility: string) => void;
  showMoreFacilities: boolean;
  onToggleShowMoreFacilities: () => void;
  displayCurrency: 'USD' | 'NGN';
}

const MEAL_OPTIONS = ['Kitchen facilities', 'Breakfast included', 'Buffet dinner'];

const BASE_FACILITIES = ['Parking', 'Restaurant', 'Pet Friendly', 'Room Service', 'Workspace', 'Game Space'];

const EXTRA_FACILITIES = ['EV charger', 'Elevator', 'Private Pool', 'Sauna'];

export const HotelDiscoverySidebar: React.FC<HotelDiscoverySidebarProps> = ({
  searchQuery,
  onSearchChange,
  budgetMax,
  onBudgetChange,
  selectedBedrooms,
  onBedroomsChange,
  selectedBathrooms,
  onBathroomsChange,
  selectedMeals,
  onToggleMeal,
  selectedFacilities,
  onToggleFacility,
  showMoreFacilities,
  onToggleShowMoreFacilities,
  displayCurrency,
}) => {
  return (
    <div className="lg:col-span-3 bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
      {/* Sidebar Title & Search */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-zinc-900 tracking-tight">Hotel Discovery</h2>

        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-200/80 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#E86E15]/20 focus:border-[#E86E15]"
          />
        </div>
      </div>

      {/* Filters Header */}
      <div className="space-y-4 pt-1">
        <h3 className="text-sm font-bold text-zinc-900">Filters</h3>

        {/* Budget Slider */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-700">Budget</label>

          {/* Custom Gradient Slider Bar */}
          <div className="relative pt-1 pb-1">
            <input
              type="range"
              min="50"
              max="2000"
              step="50"
              value={budgetMax}
              onChange={(e) => onBudgetChange(Number(e.target.value))}
              className="w-full accent-[#E86E15] cursor-pointer h-2 bg-gradient-to-r from-[#E86E15] to-[#f97316] rounded-lg"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-600">
            <span>{displayCurrency === 'USD' ? '20 USD' : '₦30,000'}</span>
            <span>{displayCurrency === 'USD' ? `${budgetMax}+ USD` : `₦${(budgetMax * 1600).toLocaleString()}+`}</span>
          </div>
        </div>

        {/* Bed Room Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700">Bed Room</label>
          <div className="relative">
            <select
              value={selectedBedrooms}
              onChange={(e) => onBedroomsChange(e.target.value)}
              className="w-full appearance-none px-3.5 py-2 text-xs bg-white border border-zinc-200/80 rounded-xl text-zinc-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#E86E15]/20 focus:border-[#E86E15]"
            >
              <option value="all">All Bed Configurations</option>
              <option value="1">1 Bedroom Suite</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="4">4 Bedrooms Penthouse / Cabin</option>
              <option value="5">5+ Bedrooms Sovereign Villa</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Bathroom Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700">Bathroom</label>
          <div className="relative">
            <select
              value={selectedBathrooms}
              onChange={(e) => onBathroomsChange(e.target.value)}
              className="w-full appearance-none px-3.5 py-2 text-xs bg-white border border-zinc-200/80 rounded-xl text-zinc-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#E86E15]/20 focus:border-[#E86E15]"
            >
              <option value="all">Any Bathrooms</option>
              <option value="1">1 Bathroom</option>
              <option value="2">2 Bathrooms</option>
              <option value="3">3 Bathrooms</option>
              <option value="4">4 Bathrooms</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Meals Checkboxes */}
        <div className="space-y-2.5 pt-2 border-t border-zinc-100">
          <label className="text-xs font-semibold text-zinc-700">Meals</label>
          <div className="space-y-2 text-xs">
            {MEAL_OPTIONS.map((meal) => {
              const isChecked = selectedMeals.includes(meal);
              return (
                <label
                  key={meal}
                  onClick={() => onToggleMeal(meal)}
                  className="flex items-center gap-2.5 cursor-pointer select-none text-zinc-600 hover:text-zinc-900"
                >
                  <div
                    className={`w-4 h-4 rounded-md flex items-center justify-center transition-all ${
                      isChecked
                        ? 'bg-[#E86E15] text-white'
                        : 'border border-zinc-300 bg-white'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{meal}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Facilities Checkboxes */}
        <div className="space-y-2.5 pt-2 border-t border-zinc-100">
          <label className="text-xs font-semibold text-zinc-700">Facilities</label>
          <div className="space-y-2 text-xs">
            {[...BASE_FACILITIES, ...(showMoreFacilities ? EXTRA_FACILITIES : [])].map((facility) => {
              const isChecked = selectedFacilities.includes(facility);
              return (
                <label
                  key={facility}
                  onClick={() => onToggleFacility(facility)}
                  className="flex items-center gap-2.5 cursor-pointer select-none text-zinc-600 hover:text-zinc-900"
                >
                  <div
                    className={`w-4 h-4 rounded-md flex items-center justify-center transition-all ${
                      isChecked
                        ? 'bg-[#E86E15] text-white'
                        : 'border border-zinc-300 bg-white'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{facility}</span>
                </label>
              );
            })}

            <button
              type="button"
              onClick={onToggleShowMoreFacilities}
              className="text-xs font-semibold text-[#E86E15] hover:underline pt-1 block"
            >
              {showMoreFacilities ? 'Show less' : 'Show more'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};