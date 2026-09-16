import React from 'react';
import { Filter } from 'lucide-react';

const EVENT_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'party', label: 'Party' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'gala', label: 'Gala' },
  { value: 'conference', label: 'Conference' },
  { value: 'social', label: 'Social' },
  { value: 'other', label: 'Other' },
];

const TYPE_COLORS: Record<string, string> = {
  all: 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100',
  party: 'bg-purple-50 text-purple-700 border-purple-200',
  wedding: 'bg-pink-50 text-pink-700 border-pink-200',
  corporate: 'bg-blue-50 text-blue-700 border-blue-200',
  gala: 'bg-amber-50 text-amber-700 border-amber-200',
  conference: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  social: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  other: 'bg-zinc-50 text-zinc-700 border-zinc-200',
};

interface EventCategoryPillsProps {
  selectedEventType: string;
  onEventTypeChange: (type: string) => void;
}

export const EventCategoryPills: React.FC<EventCategoryPillsProps> = ({
  selectedEventType,
  onEventTypeChange,
}) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 custom-scrollbar pt-1 border-t border-zinc-100">
      <span className="text-xs text-zinc-400 font-medium mr-1 flex items-center gap-1 shrink-0">
        <Filter className="w-3.5 h-3.5" /> Type:
      </span>
      {EVENT_TYPES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onEventTypeChange(cat.value)}
          className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedEventType === cat.value
              ? 'bg-purple-50 text-purple-700 border border-purple-200 font-bold shadow-2xs'
              : TYPE_COLORS[cat.value] || TYPE_COLORS.all
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
};