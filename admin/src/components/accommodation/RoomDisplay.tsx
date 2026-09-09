import React from 'react';
import { Sparkles } from 'lucide-react';
import { AccommodationRoom } from '../../data/accommodationData';
import { RoomCard } from './RoomCard';
import { useAccommodationStore } from '../../stores/accommodationStore';

interface RoomDisplayProps {
  filteredRooms: AccommodationRoom[];
  onQuickWalkIn: (room: AccommodationRoom) => void;
  onResetFilters: () => void;
  onEdit?: (room: AccommodationRoom) => void;
  onDelete?: (room: AccommodationRoom) => void;
}

export const RoomDisplay: React.FC<RoomDisplayProps> = ({ filteredRooms, onQuickWalkIn, onResetFilters, onEdit, onDelete }) => {
  const { viewMode, setSearchQuery, setSelectedCategory, setStatusFilter } = useAccommodationStore();

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setStatusFilter('all');
  };

  if (filteredRooms.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border border-zinc-200/80">
        <p className="text-sm font-semibold text-zinc-700">No rooms match your filter criteria.</p>
        <button onClick={handleResetFilters} className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer">
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
        <span>Showing <strong className="text-zinc-900 font-bold">{filteredRooms.length}</strong> suites</span>
        <span className="text-emerald-600 font-semibold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Best Available Rate Guaranteed
        </span>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRooms.map((room) => {return (
            <RoomCard key={room.id} room={room} displayCurrency="USD" viewMode="grid" onQuickWalkIn={onQuickWalkIn} onEdit={onEdit} onDelete={onDelete} />
          )})}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} displayCurrency="USD" viewMode="list" onQuickWalkIn={onQuickWalkIn} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </>
  );
};