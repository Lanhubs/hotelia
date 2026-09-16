import React from 'react';
import { GripVertical } from 'lucide-react';
import { RoomStatusItem } from '../../data/dashboardData';

interface RoomStatusDonutProps {
  statusItems: RoomStatusItem[];
}

export const RoomStatusDonut: React.FC<RoomStatusDonutProps> = ({ statusItems }) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center gap-1.5 mb-3">
        <GripVertical className="w-4 h-4 text-zinc-400 cursor-grab" />
        <h3 className="text-sm font-bold text-zinc-900">Room Status & Walk-Ins</h3>
      </div>

      {/* Center Donut Gauge */}
      <div className="relative w-32 h-32 mx-auto my-1 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          {/* Gauge Background track */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#F1F5F9"
            strokeWidth="8"
          />
          {/* Colored Segments */}
          {/* Occupied (280/500 = 56%) */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#4F46E5"
            strokeWidth="8"
            strokeDasharray="140.7 251.2"
            strokeDashoffset="0"
            strokeLinecap="round"
          />
          {/* Cleaning (120/500 = 24%) */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#F97316"
            strokeWidth="8"
            strokeDasharray="60.3 251.2"
            strokeDashoffset="-140.7"
            strokeLinecap="round"
          />
          {/* Vacant (50/500 = 10%) */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#10B981"
            strokeWidth="8"
            strokeDasharray="25.1 251.2"
            strokeDashoffset="-201"
            strokeLinecap="round"
          />
          {/* In-House & others */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="8"
            strokeDasharray="25.1 251.2"
            strokeDashoffset="-226.1"
            strokeLinecap="round"
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl font-bold text-zinc-900 leading-tight">500</span>
          <span className="text-[10px] text-zinc-400 font-medium">Total Rooms</span>
        </div>
      </div>

      {/* Status List Breakdown */}
      <div className="space-y-1.5 pt-1 text-xs">
        {statusItems.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-zinc-600 text-xs font-normal">{item.label}</span>
            </div>
            <span className="font-bold text-zinc-900 text-xs">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};