import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { INITIAL_ROOMS } from '../data/mockHotelData';

const DATES = [
  { day: '18', name: 'Tue', dateStr: '2026-08-18', isToday: true },
  { day: '19', name: 'Wed', dateStr: '2026-08-19' },
  { day: '20', name: 'Thu', dateStr: '2026-08-20' },
  { day: '21', name: 'Fri', dateStr: '2026-08-21' },
  { day: '22', name: 'Sat', dateStr: '2026-08-22' },
  { day: '23', name: 'Sun', dateStr: '2026-08-23' },
  { day: '24', name: 'Mon', dateStr: '2026-08-24' },
];

export const CalendarPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-12 font-sans text-zinc-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-900 border border-indigo-100">
              Occupancy Matrix & Length-of-Stay Tape Chart
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight mt-1">Tape Chart Calendar</h1>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 cursor-pointer">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-zinc-900 px-2">Aug 18 – Aug 24, 2026</span>
          <button className="p-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 cursor-pointer">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="p-3.5 w-44 text-zinc-500 font-bold border-r border-zinc-200 text-[10px] uppercase tracking-wider">
                  Room & Key
                </th>
                {DATES.map((d) => (
                  <th
                    key={d.day}
                    className={`p-3 text-center border-r border-zinc-200 min-w-[130px] ${
                      d.isToday ? 'bg-indigo-50 text-indigo-900 font-bold' : 'text-zinc-700'
                    }`}
                  >
                    <div className="text-[10px] uppercase text-zinc-400 font-bold">{d.name}</div>
                    <div className="text-sm font-bold mt-0.5">{d.day}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {INITIAL_ROOMS.map((room) => (
                <tr key={room.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="p-3.5 border-r border-zinc-200 bg-zinc-50/40">
                    <div className="font-bold text-zinc-900 font-mono">Room #{room.number}</div>
                    <div className="text-[11px] text-zinc-500 font-medium truncate">{room.type}</div>
                  </td>
                  {DATES.map((d, index) => {
                    const hasBooking =
                      (room.status === 'occupied' && index < 4) ||
                      (room.status === 'reserved' && index >= 0 && index <= 3);

                    return (
                      <td key={d.day} className="p-1.5 border-r border-zinc-100 relative">
                        {hasBooking ? (
                          <div
                            className={`h-8 rounded-lg px-2 flex items-center text-[10px] font-bold truncate border shadow-2xs ${
                              room.status === 'occupied'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                : 'bg-amber-50 border-amber-200 text-amber-800'
                            }`}
                          >
                            {room.guestName || 'Reserved'}
                          </div>
                        ) : (
                          <div className="h-8 flex items-center justify-center text-zinc-300 hover:bg-zinc-100 hover:text-zinc-600 rounded-lg transition-colors cursor-pointer text-xs font-bold">
                            +
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
