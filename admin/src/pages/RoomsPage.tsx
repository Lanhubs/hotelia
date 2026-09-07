import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { INITIAL_ROOMS } from '../data/mockHotelData';
import { RoomStatus } from '../types';

export const RoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<RoomStatus[]>(INITIAL_ROOMS);
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');

  const toggleCleanliness = (id: string) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const nextClean: RoomStatus['cleanliness'] =
          r.cleanliness === 'dirty' ? 'in_progress' : r.cleanliness === 'in_progress' ? 'inspected' : 'cleaned';
        return { ...r, cleanliness: nextClean };
      })
    );
  };

  const filteredRooms = rooms.filter(
    (room) => selectedFloor === 'all' || room.floor === selectedFloor
  );

  return (
    <div className="space-y-6 pb-12 font-sans text-zinc-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-900 border border-indigo-100">
              Housekeeping & Physical Rack Matrix
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight mt-1">Room Inventory & Readiness</h1>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-white border border-zinc-200 rounded-xl shadow-2xs">
          <span className="text-xs text-zinc-400 px-2 font-semibold">Floor:</span>
          {(['all', 1, 2, 3] as const).map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFloor(f)}
              className={`px-3 py-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                selectedFloor === f ? 'bg-indigo-600 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {f === 'all' ? 'All Floors' : `Level ${f}`}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs bg-white p-3.5 rounded-2xl border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <span className="text-zinc-500 font-bold">Status Key:</span>
        <span className="flex items-center gap-1.5 text-zinc-700 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Occupied
        </span>
        <span className="flex items-center gap-1.5 text-zinc-700 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Vacant Clean
        </span>
        <span className="flex items-center gap-1.5 text-zinc-700 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Reserved / Due
        </span>
        <span className="flex items-center gap-1.5 text-zinc-700 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Vacant Dirty
        </span>
        <span className="flex items-center gap-1.5 text-zinc-700 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Maintenance
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {filteredRooms.map((room) => {
          const getStatusStyle = () => {
            switch (room.status) {
              case 'occupied': return 'border-emerald-200 bg-emerald-50/40 text-emerald-900';
              case 'vacant_clean': return 'border-indigo-200 bg-indigo-50/40 text-indigo-900';
              case 'vacant_dirty': return 'border-orange-200 bg-orange-50/40 text-orange-900';
              case 'reserved': return 'border-amber-200 bg-amber-50/40 text-amber-900';
              case 'maintenance': return 'border-rose-200 bg-rose-50/40 text-rose-900';
              default: return 'border-zinc-200 bg-white text-zinc-900';
            }
          };

          return (
            <div key={room.id} className={`p-4 rounded-2xl border flex flex-col justify-between transition-all hover:shadow-md bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] ${getStatusStyle()}`}>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-base font-extrabold text-zinc-900 font-mono">#{room.number}</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-white text-zinc-700 border border-zinc-200 shadow-2xs">
                    Fl {room.floor}
                  </span>
                </div>
                <p className="text-xs font-bold text-indigo-600 truncate">{room.type}</p>
                <p className="text-[11px] text-zinc-500 mt-1 font-medium truncate">
                  {room.guestName ? room.guestName : 'No active folio'}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-zinc-200/60 flex items-center justify-between text-[11px]">
                <button type="button" onClick={() => toggleCleanliness(room.id)} className="flex items-center gap-1 text-zinc-600 hover:text-indigo-600 transition-colors font-semibold cursor-pointer" title="Click to cycle housekeeping status">
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  <span className="capitalize">{room.cleanliness}</span>
                </button>
                <span className="font-extrabold text-zinc-900">${room.ratePerNight}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
