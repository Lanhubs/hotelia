import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Clock, Eye } from 'lucide-react';
import type { Event, EventOccurrence } from '../../stores/eventsTypes';

interface EventsCalendarProps {
  events: Event[];
}

const MONTHS = [
  { name: 'Jan', short: 'J', days: 31 },
  { name: 'Feb', short: 'F', days: 28 },
  { name: 'Mar', short: 'M', days: 31 },
  { name: 'Apr', short: 'A', days: 30 },
  { name: 'May', short: 'M', days: 31 },
  { name: 'Jun', short: 'J', days: 30 },
  { name: 'Jul', short: 'J', days: 31 },
  { name: 'Aug', short: 'A', days: 31 },
  { name: 'Sep', short: 'S', days: 30 },
  { name: 'Oct', short: 'O', days: 31 },
  { name: 'Nov', short: 'N', days: 30 },
  { name: 'Dec', short: 'D', days: 31 },
];

const TYPE_COLORS: Record<string, string> = {
  party: '#a855f7',
  wedding: '#ec4899',
  corporate: '#3b82f6',
  gala: '#f59e0b',
  conference: '#6366f1',
  social: '#22c55e',
  other: '#71717a',
};

const TYPE_LABELS: Record<string, string> = {
  party: 'Party',
  wedding: 'Wedding',
  corporate: 'Corporate',
  gala: 'Gala',
  conference: 'Conference',
  social: 'Social',
  other: 'Other',
};

const STATUS_COLORS: Record<string, string> = {
  scheduled: '#3b82f6',
  ongoing: '#a855f7',
  completed: '#22c55e',
  cancelled: '#ef4444',
};

export const EventsCalendar: React.FC<EventsCalendarProps> = ({ events }) => {
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [selectedEvent, setSelectedEvent] = useState<EventOccurrence | null>(null);
  
  const handleEventClick = (occurrence: EventOccurrence) => {
    setSelectedEvent(occurrence);
  };
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const pastEvents = events.filter(e => new Date(e.endDate) < new Date());
  const upcomingEvents = events.filter(e => new Date(e.startDate) >= new Date());
  const allEvents = [...upcomingEvents, ...pastEvents];

  const eventOccurrences = allEvents.flatMap(event => {
    if (event.isRecurring && event.recurrenceRule) {
      return expandRecurringEvent(event, `${viewYear}-01-01`, `${viewYear}-12-31`).map(occ => ({ ...occ, sourceEvent: event } as EventOccurrence));
    }
    const eventYear = new Date(event.startDate).getFullYear();
    if (eventYear === viewYear) {
      return [{ ...event, occurrenceDate: event.startDate, isRecurrenceInstance: false, sourceEvent: event } as EventOccurrence];
    }
    return [];
  });

  const eventsByDate: Record<string, EventOccurrence[]> = eventOccurrences.reduce((acc, occ) => {
    if (!acc[occ.occurrenceDate]) acc[occ.occurrenceDate] = [];
    acc[occ.occurrenceDate].push(occ);
    return acc;
  }, {} as Record<string, EventOccurrence[]>);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY !== 0 && containerRef.current) {
      e.preventDefault();
      containerRef.current.scrollLeft += e.deltaY;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX - scrollLeft);
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const newScroll = e.clientX - dragStart;
    setScrollLeft(newScroll);
    containerRef.current.scrollLeft = newScroll;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab';
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove as any);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove as any);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  const scrollToYear = (year: number) => {
    setViewYear(year);
    setScrollLeft(0);
  };

  const getDayPosition = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth();
    const day = date.getDate();
    let dayOfYear = 0;
    for (let i = 0; i < month; i++) {
      dayOfYear += MONTHS[i].days;
    }
    dayOfYear += day - 1;
    return dayOfYear;
  };

  const totalDays = 365;
  const dayWidth = 3;
  const totalWidth = totalDays * dayWidth;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-4">
        <button
          onClick={() => scrollToYear(viewYear - 1)}
          className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
          aria-label="Previous year"
        >
          <ChevronLeft className="h-5 w-5 text-zinc-600" />
        </button>
        <h3 className="text-xl font-light text-zinc-900">{viewYear}</h3>
        <button
          onClick={() => scrollToYear(viewYear + 1)}
          className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
          aria-label="Next year"
        >
          <ChevronRight className="h-5 w-5 text-zinc-600" />
        </button>
      </div>

      <div className="flex overflow-x-auto px-4 pb-2 border-b border-zinc-200" style={{ minWidth: totalWidth + 80 }}>
        {MONTHS.map((month) => (
          <div
            key={month.name}
            className="shrink-0 flex flex-col items-center"
            style={{ width: month.days * dayWidth }}
          >
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide mb-1">
              {month.short}
            </span>
            <div className="w-full h-px bg-zinc-200" />
          </div>
        ))}
      </div>

      <div
        ref={containerRef}
        className="relative overflow-x-auto px-4 py-4"
        style={{ 
          minWidth: totalWidth + 80,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
      >
        <div className="relative" style={{ width: totalWidth, height: 120 }}>
          <div className="absolute left-0 right-0 top-1/2 h-px bg-zinc-200 -translate-y-1/2" />
          
          {MONTHS.map((month, monthIdx) => {
            let daysBefore = 0;
            for (let i = 0; i < monthIdx; i++) daysBefore += MONTHS[i].days;
            return (
              <div
                key={month.name}
                className="absolute top-0 bottom-0 w-px bg-zinc-100"
                style={{ left: daysBefore * dayWidth }}
              />
            )
          })}

          {viewYear === new Date().getFullYear() && (
            <div className="absolute top-0 bottom-0 w-px bg-purple-600 animate-pulse" style={{ left: getDayPosition(new Date().toISOString().split('T')[0]) * dayWidth }} />
          )}

          {Object.entries(eventsByDate).map(([dateStr, dayEvents]) => {
            const x = getDayPosition(dateStr) * dayWidth;
            const color = dayEvents[0] ? TYPE_COLORS[dayEvents[0].eventType] || TYPE_COLORS.other : TYPE_COLORS.other;
            const maxCapacity = Math.max(...dayEvents.map(e => e.maxCapacity || 100));
            const bookedCount = dayEvents.reduce((sum, e) => sum + (e.bookedCount || 0), 0);
            const capacityPct = maxCapacity > 0 ? Math.min((bookedCount / maxCapacity) * 100, 100) : 0;
            const barHeight = Math.max(20, 20 + capacityPct * 0.8);

            const occurrence = dayEvents[0];

            return (
              <div
                key={dateStr}
                className="absolute bottom-0 rounded-t cursor-pointer transition-all hover:z-10"
                style={{
                  left: x + 1,
                  width: dayWidth - 2,
                  height: barHeight,
                  backgroundColor: color,
                  opacity: 0.85,
                }}
                onClick={() => handleEventClick(occurrence)}
                onMouseEnter={() => handleEventClick(occurrence)}
                onMouseLeave={() => setSelectedEvent(null)}
                title={`${dayEvents.length} event(s) on ${dateStr}`}
              >
                {capacityPct > 80 && (
                  <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" title="Nearly full" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 px-4 text-sm text-zinc-600">
        <span className="font-medium text-zinc-900">Event Types:</span>
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <span key={type} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
            {TYPE_LABELS[type]}
          </span>
        ))}
        <span className="ml-auto flex items-center gap-1.5 text-[11px]">
          <span className="w-3 h-3 rounded bg-purple-600 animate-pulse" title="Today" />
          Today
        </span>
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedEvent(null)} />
          <div className="relative w-full sm:w-96 bg-white rounded-t-2xl sm:rounded-tl-2xl sm:rounded-bl-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto z-10 animate-in slide-in-from-right">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-zinc-100 text-zinc-500"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="space-y-4">
              <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${TYPE_COLORS[selectedEvent.eventType] ? `bg-${Object.keys(TYPE_COLORS).find(k => TYPE_COLORS[k] === TYPE_COLORS[selectedEvent.eventType])}-100 text-${Object.keys(TYPE_COLORS).find(k => TYPE_COLORS[k] === TYPE_COLORS[selectedEvent.eventType])}-700` : 'bg-zinc-100 text-zinc-700'}`}>
                {TYPE_LABELS[selectedEvent.eventType] || selectedEvent.eventType}
              </span>
              <h4 className="text-lg font-medium text-zinc-900">{selectedEvent.title}</h4>
              <p className="text-sm text-zinc-500">{selectedEvent.description}</p>
              <div className="flex flex-col gap-2 text-sm text-zinc-500 pt-2 border-t border-zinc-200">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(selectedEvent.occurrenceDate || selectedEvent.startDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </span>
                {selectedEvent.venueName && (
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedEvent.venueName}</span>
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{selectedEvent.startTime} – {selectedEvent.endTime}</span>
                </span>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="block mt-4 text-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
              >
                View Event Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function expandRecurringEvent(event: Event, rangeStart: string, rangeEnd: string): EventOccurrence[] {
  if (!event.isRecurring || !event.recurrenceRule) return [];
  
  const occurrences: EventOccurrence[] = [];
  const rule = parseRRule(event.recurrenceRule);
  if (!rule) return [];

  const startDate = new Date(event.startDate);
  const endDate = event.recurrenceEndDate ? new Date(event.recurrenceEndDate) : new Date(rangeEnd);
  const actualEnd = endDate < new Date(rangeEnd) ? endDate : new Date(rangeEnd);
  const exceptions = new Set(event.recurrenceExceptions);

  let current = new Date(startDate);
  current.setHours(0, 0, 0, 0);

  while (current <= actualEnd) {
    const currentStr = current.toISOString().split('T')[0];
    
    if (matchesRule(current, rule) && !exceptions.has(currentStr)) {
      if (current >= new Date(rangeStart) && current <= new Date(rangeEnd)) {
        occurrences.push({
          ...event,
          occurrenceDate: currentStr,
          isRecurrenceInstance: currentStr !== event.startDate,
          bookedCount: 0,
          maxCapacity: event.maxCapacity,
        } as EventOccurrence);
      }
    }
    current.setDate(current.getDate() + 1);
  }

  return occurrences;
}

function parseRRule(ruleStr: string) {
  const parts = ruleStr.split(';');
  const rule: any = { freq: '', interval: 1 };
  for (const part of parts) {
    const [key, value] = part.split('=');
    if (key === 'FREQ') rule.freq = value;
    else if (key === 'INTERVAL') rule.interval = parseInt(value, 10);
    else if (key === 'BYDAY') rule.byDay = value.split(',').map((d: string) => dayToNum(d));
    else if (key === 'BYMONTHDAY') rule.byMonthDay = parseInt(value, 10);
  }
  return rule.freq ? rule : null;
}

function dayToNum(day: string) {
  const days: Record<string, number> = { MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6, SU: 0 };
  return days[day.toUpperCase()] ?? 0;
}

function matchesRule(date: Date, rule: any) {
  if (rule.freq === 'WEEKLY') {
    return date.getDay() === (rule.byDay?.[0] ?? date.getDay());
  }
  if (rule.freq === 'MONTHLY') {
    if (rule.byMonthDay) return date.getDate() === rule.byMonthDay;
    if (rule.byDay) {
      const weekOfMonth = Math.ceil(date.getDate() / 7);
      return date.getDay() === rule.byDay[0] && weekOfMonth === (rule.byWeekNo || 1);
    }
  }
  return false;
}

