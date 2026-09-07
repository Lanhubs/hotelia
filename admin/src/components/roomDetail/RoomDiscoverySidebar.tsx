import React from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';

interface RoomDiscoverySidebarProps {
  searchQuery: string;
  onSearchQueryChange: (val: string) => void;
  budgetMin: string;
  budgetMax: string;
  selectedBedrooms: string;
  onBedroomsChange: (val: string) => void;
  selectedBathrooms: string;
  onBathroomsChange: (val: string) => void;
  selectedMeals: string[];
  onToggleMeal: (meal: string) => void;
  selectedFacilities: string[];
  onToggleFacility: (facility: string) => void;
  showMoreFacilities: boolean;
  onToggleShowMoreFacilities: () => void;
}

export const RoomDiscoverySidebar: React.FC<RoomDiscoverySidebarProps> = ({
  searchQuery,
  onSearchQueryChange,
  budgetMin,
  budgetMax,
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
}) => {
  return (
    <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5">
      <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Hotel Discovery</h2>

      <div className="relative">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-900 focus:ring-2 focus:ring-ink/20 focus:border-ink outline-none"
        />
      </div>

      <div className="space-y-4 pt-1">
        <h3 className="text-sm font-bold text-zinc-900">Filters</h3>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-800">Budget</label>
          <div className="relative py-2 flex items-center">
            <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
              <div className="h-full bg-ink rounded-full" />
            </div>
            <div className="absolute left-0 w-4 h-4 rounded-full bg-ink border-2 border-white shadow-xs" />
            <div className="absolute right-0 w-4 h-4 rounded-full bg-ink border-2 border-white shadow-xs" />
          </div>
          <div className="flex items-center justify-between text-xs font-medium text-zinc-600">
            <span>{budgetMin} USD</span>
            <span>{budgetMax} USD</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-800">Bed Room</label>
          <div className="relative">
            <select
              value={selectedBedrooms}
              onChange={(e) => onBedroomsChange(e.target.value)}
              className="w-full appearance-none px-3.5 py-2 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-800 font-medium focus:ring-2 focus:ring-ink/20 outline-none cursor-pointer"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-800">Bathroom</label>
          <div className="relative">
            <select
              value={selectedBathrooms}
              onChange={(e) => onBathroomsChange(e.target.value)}
              className="w-full appearance-none px-3.5 py-2 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-800 font-medium focus:ring-2 focus:ring-ink/20 outline-none cursor-pointer"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-2.5 pt-2 border-t border-zinc-100">
          <label className="text-xs font-semibold text-zinc-800">Meals</label>
          <div className="space-y-2 text-xs">
            {['Kitchen facilities', 'Breakfast included', 'Buffet dinner'].map((meal) => {
              const isChecked = selectedMeals.includes(meal);
              return (
                <label key={meal} onClick={() => onToggleMeal(meal)} className="flex items-center gap-2.5 cursor-pointer select-none text-zinc-600 hover:text-zinc-900">
                  <div className={`w-4 h-4 rounded flex items-center justify-center ${isChecked ? 'bg-ink text-white' : 'border border-zinc-300 bg-white'}`}>
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{meal}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="space-y-2.5 pt-2 border-t border-zinc-100">
          <label className="text-xs font-semibold text-zinc-800">Facilities</label>
          <div className="space-y-2 text-xs">
            {[
              'Parking',
              'Restaurant',
              'Pet Friendly',
              'Room Service',
              'Workspace',
              'Game Space',
              ...(showMoreFacilities ? ['EV charger', 'Elevator', 'Pool'] : []),
            ].map((facility) => {
              const isChecked = selectedFacilities.includes(facility);
              return (
                <label key={facility} onClick={() => onToggleFacility(facility)} className="flex items-center gap-2.5 cursor-pointer select-none text-zinc-600 hover:text-zinc-900">
                  <div className={`w-4 h-4 rounded flex items-center justify-center ${isChecked ? 'bg-ink text-white' : 'border border-zinc-300 bg-white'}`}>
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{facility}</span>
                </label>
              );
            })}

            <button type="button" onClick={onToggleShowMoreFacilities} className="text-xs font-semibold text-ink hover:underline pt-1 block cursor-pointer">
              {showMoreFacilities ? 'Show less' : 'Show more'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
