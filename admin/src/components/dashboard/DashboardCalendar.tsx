import React from 'react';
import { GripVertical, ChevronDown, Plus } from 'lucide-react';
import { useDashboardStore, RoomCategory } from '../../stores/dashboardStore';
import { CalendarDay, ROOM_CATEGORIES, WEEK_OPTIONS } from '../../data/dashboardData';

interface DashboardCalendarProps {
  calendarDays: CalendarDay[];
}

export const DashboardCalendar: React.FC<DashboardCalendarProps> = ({ calendarDays }) => {
  const { 
    selectedRoomCategory, 
    setSelectedRoomCategory, 
    calendarWeek, 
    setCalendarWeek, 
    showWeekDropdown, 
    setShowWeekDropdown 
  } = useDashboardStore();

  return (
    <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <GripVertical className="w-4 h-4 text-zinc-400 cursor-grab" />
          <h3 className="text-sm font-bold text-zinc-900">Calendar</h3>
        </div>

        {/* Week Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowWeekDropdown(!showWeekDropdown)}
            className="flex items-center gap-1 text-xs font-semibold text-ink hover:text-indigo-700 cursor-pointer"
          >
            <span>{calendarWeek}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {showWeekDropdown && (
            <div className="absolute right-0 mt-1 w-28 bg-white border border-zinc-200 rounded-xl shadow-lg py-1 z-30 text-xs">
              {WEEK_OPTIONS.map((week) => (
                <button
                  key={week}
                  type="button"
                  onClick={() => setCalendarWeek(week)}
                  className={`w-full text-left px-3 py-1.5 hover:bg-zinc-50 font-medium cursor-pointer ${
                    calendarWeek === week ? 'text-ink font-bold' : 'text-zinc-700'
                  }`}
                >
                  {week}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Room Category Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-zinc-100/70 rounded-xl text-xs font-medium">
        {ROOM_CATEGORIES.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setSelectedRoomCategory(tab as RoomCategory)}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
              selectedRoomCategory === tab
                ? 'bg-white text-zinc-900 font-bold shadow-xs border border-zinc-200/60'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Daily Schedule Stack */}
      <div className="space-y-2 pt-1">
        {calendarDays.map((day) => (
          <div key={`${day.dateNum}-${day.dayName}`} className="flex items-center gap-3">
            {/* Date Column */}
            <div className="w-7 text-center flex-shrink-0">
              <div className="text-xs font-bold text-zinc-900 leading-none">{day.dateNum}</div>
              <div className="text-[10px] text-zinc-400 font-medium">{day.dayName}</div>
            </div>

            {/* Day Content Pill */}
            {day.type === 'booked' ? (
              <div className={`flex-1 flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold ${day.bgClass}`}>
                <span>{day.bookingsCount} Bookings</span>

                {/* Avatars cluster */}
                <div className="flex items-center -space-x-1.5">
                  {day.avatars?.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="Guest"
                      referrerPolicy="no-referrer"
                      className="w-5 h-5 rounded-full object-cover ring-1 ring-white"
                    />
                  ))}
                  {day.remaining && (
                    <span className="w-5 h-5 rounded-full bg-white text-[9px] font-bold text-zinc-600 flex items-center justify-center ring-1 ring-zinc-200">
                      {day.remaining}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center gap-1 px-3 py-2 rounded-xl border border-dashed border-zinc-200 text-[11px] text-zinc-400 font-medium hover:border-zinc-300 hover:text-zinc-600 cursor-pointer transition-colors">
                <Plus className="w-3 h-3" />
                <span>Available for booking</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};