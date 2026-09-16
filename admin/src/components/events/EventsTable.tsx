import React from 'react';
import { Calendar, MapPin, Clock, Users, Ticket, CheckCircle2, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { Event } from '../../stores/eventsStore';
import { formatMoney, DisplayCurrency } from '../../components/bookings/bookingUtils';

interface EventsTableProps {
  events: Event[];
  displayCurrency: DisplayCurrency;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
  onView: (event: Event) => void;
  onViewBookings: (event: Event) => void;
}

const STATUS_BADGES: Record<string, string> = {
  scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
  ongoing: 'bg-purple-50 text-purple-700 border-purple-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
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

export const EventsTable: React.FC<EventsTableProps> = ({
  events,
  displayCurrency,
  onEdit,
  onDelete,
  onView,
  onViewBookings,
}) => {
  return (
    <div className="bg-white border border-zinc-200/80 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200">
              <th className="p-3.5 w-36 text-zinc-500 font-bold text-[10px] uppercase tracking-wider">Event</th>
              <th className="p-3.5 w-24 text-zinc-500 font-bold text-[10px] uppercase tracking-wider">Type</th>
              <th className="p-3.5 w-28 text-zinc-500 font-bold text-[10px] uppercase tracking-wider">Date</th>
              <th className="p-3.5 w-28 text-zinc-500 font-bold text-[10px] uppercase tracking-wider">Time</th>
              <th className="p-3.5 w-24 text-zinc-500 font-bold text-[10px] uppercase tracking-wider">Venue</th>
              <th className="p-3.5 w-20 text-zinc-500 font-bold text-[10px] uppercase tracking-wider">Capacity</th>
              <th className="p-3.5 w-24 text-zinc-500 font-bold text-[10px] uppercase tracking-wider">Status</th>
              <th className="p-3.5 w-24 text-zinc-500 font-bold text-[10px] uppercase tracking-wider">Bookings</th>
              <th className="p-3.5 w-32 text-right text-zinc-500 font-bold text-[10px] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {events.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-zinc-400">
                  No events found
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.id} className="hover:bg-zinc-50/70 transition-colors">
                  <td className="p-3.5 w-36 font-mono font-bold text-zinc-900">
                    <div className="font-semibold text-zinc-900 truncate">{event.title}</div>
                    <div className="text-[10px] text-zinc-400 truncate">{event.category}</div>
                  </td>
                  <td className="p-3.5 w-24">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      {TYPE_LABELS[event.eventType] || event.eventType}
                    </span>
                  </td>
                  <td className="p-3.5 w-28">
                    <div className="flex items-center gap-1.5 text-zinc-700 font-medium">
                      <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                      <span>{new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    {event.endDate !== event.startDate && (
                      <div className="text-[10px] text-zinc-400">Ends {new Date(event.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                    )}
                  </td>
                  <td className="p-3.5 w-28">
                    <div className="flex items-center gap-1.5 text-zinc-700 font-medium">
                      <Clock className="h-3.5 h-3.5 text-zinc-400" />
                      <span>{event.startTime} – {event.endTime}</span>
                    </div>
                  </td>
                  <td className="p-3.5 w-24 truncate">
                    <div className="flex items-center gap-1.5 text-zinc-700">
                      <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                      <span className="truncate">{event.venueName || 'TBA'}</span>
                    </div>
                  </td>
                  <td className="p-3.5 w-20 text-right">
                    <div className="flex items-center gap-1.5 text-zinc-700 justify-end">
                      <Users className="h-3.5 w-3.5 text-zinc-400" />
                      <span className="font-semibold">{event.maxCapacity || '∞'}</span>
                    </div>
                  </td>
                  <td className="p-3.5 w-24">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_BADGES[event.status] || 'bg-zinc-50 text-zinc-700 border-zinc-200'}`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                    {event.isRecurring && (
                      <span className="ml-1 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Recurring
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 w-24">
                    <div className="flex items-center gap-1.5 text-zinc-700">
                      <Ticket className="h-3.5 w-3.5 text-zinc-400" />
                      <span className="font-semibold">0</span>
                    </div>
                    <div className="text-[10px] text-zinc-400">No bookings yet</div>
                  </td>
                  <td className="p-3.5 w-32 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onView(event)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onViewBookings(event)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                        title="View Bookings"
                      >
                        <Ticket className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(event)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(event)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};