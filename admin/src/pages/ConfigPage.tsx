import React from 'react';
import { Plus } from 'lucide-react';

const ROOM_CATEGORIES = [
  { name: 'Standard Twin', totalKeys: 40, baseRate: '$180', maxOccupancy: '2 Adults', amenities: 'Rain Shower, Work Desk, Smart TV' },
  { name: 'Deluxe King', totalKeys: 60, baseRate: '$240', maxOccupancy: '2 Adults, 1 Child', amenities: 'King Bed, Balcony, Espresso Machine, Rain Shower' },
  { name: 'Executive Suite', totalKeys: 35, baseRate: '$420', maxOccupancy: '3 Adults', amenities: 'Lounge Area, Butler Service, Deep Soaking Tub' },
  { name: 'Ocean Villa', totalKeys: 20, baseRate: '$650', maxOccupancy: '4 Adults', amenities: 'Private Infinity Pool, Sun Deck, Oceanfront' },
  { name: 'Presidential Suite', totalKeys: 5, baseRate: '$1,200', maxOccupancy: '6 Adults', amenities: 'Helipad Access, Private Chef, 24/7 Butler' },
];

export const ConfigPage: React.FC = () => {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-800">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Hotel Inventory & Room Type Configuration</h1>
          <p className="text-xs text-zinc-400 mt-0.5">Define room types, key counts, base pricing, and amenity assignments</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-xs font-medium">
          <Plus className="w-4 h-4" /> Add Room Category
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950/80 text-zinc-400 border-b border-zinc-800 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Room Type</th>
                <th className="py-3 px-4">Total Inventory</th>
                <th className="py-3 px-4">Base BAR Rate</th>
                <th className="py-3 px-4">Max Occupancy</th>
                <th className="py-3 px-4">Included Amenities</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {ROOM_CATEGORIES.map((cat, i) => (
                <tr key={i} className="hover:bg-zinc-800/30">
                  <td className="py-3.5 px-4 font-semibold text-zinc-100">{cat.name}</td>
                  <td className="py-3.5 px-4 text-amber-400 font-bold">{cat.totalKeys} Keys</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-semibold">{cat.baseRate} / nt</td>
                  <td className="py-3.5 px-4 text-zinc-400">{cat.maxOccupancy}</td>
                  <td className="py-3.5 px-4 text-zinc-400">{cat.amenities}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
