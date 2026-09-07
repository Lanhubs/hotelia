import React from 'react';
import { Filter } from 'lucide-react';
import { useAccommodationStore } from '../../stores/accommodationStore';

const CATEGORIES = ['All', 'Cabin & Lodge', 'Penthouse', 'Ocean Villa', 'Grand Suite', 'Deluxe King'];

interface CategoryFilterPillsProps {
  roomCount: number;
}

export const CategoryFilterPills: React.FC<CategoryFilterPillsProps> = ({ roomCount }) => {
  const { selectedCategory, setSelectedCategory } = useAccommodationStore();

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 custom-scrollbar pt-1 border-t border-zinc-100">
      <span className="text-xs text-zinc-400 font-medium mr-1 flex items-center gap-1">
        <Filter className="w-3.5 h-3.5" /> Category:
      </span>
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => setSelectedCategory(cat)}
          className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === cat
              ? 'bg-[#EEF2FF] text-ink border border-indigo-100 font-bold shadow-2xs'
              : 'bg-zinc-50 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};