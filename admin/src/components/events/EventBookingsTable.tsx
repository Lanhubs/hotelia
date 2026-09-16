import React from 'react';
import { Calendar, CheckCircle2, Clock, User, CreditCard, MoreVertical, Check, X, Eye } from 'lucide-react';
import type { Event, EventBooking } from '../../stores/eventsStore';
import { formatMoney } from '../../components/bookings/bookingUtils';

interface EventBookingsTableProps {
  events: Event[];
}

const STATUS_BADGES: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  waitlisted: 'bg-blue-50 text-blue-700 border-blue-200',
  attended: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const PAYMENT_STATUS_BADGES: Record<string, string> = {
  free: 'bg-gray-50 text-gray-700 border-gray-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  refunded: 'bg-blue-50 text-blue-700 border-blue-200',
};

export const EventBookingsTable: React.FC<EventBookingsTableProps> = ({ events }) => {
  const eventsWithBookings = events.filter(e => e.bookings && e.bookings.length > 0);

  if (eventsWithBookings.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500">
        <p className="font-medium">No bookings yet for any event</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {eventsWithBookings.map((event) => (
        <div key={event.id} className="space-y-4">
          <div className="flex items-center justify-between mb-4 p-4 bg-white rounded-xl border border-zinc-200">
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${({
                party: 'bg-purple-50 text-purple-700 border-purple-200',
                wedding: 'bg-pink-50 text-pink-700 border-pink-200',
                corporate: 'bg-blue-50 text-blue-700 border-blue-200',
                gala: 'bg-amber-50 text-amber-700 border-amber-200',
                conference: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                social: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                other: 'bg-zinc-50 text-zinc-700 border-zinc-200',
              })[event.eventType] || 'bg-zinc-50 text-zinc-700 border-zinc-200'}`}>
                {({
                  party: 'Party',
                  wedding: 'Wedding',
                  corporate: 'Corporate',
                  gala: 'Gala',
                  conference: 'Conference',
                  social: 'Social',
                  other: 'Other',
                })[event.eventType] || event.eventType}
              </span>
              <h4 className="font-medium text-zinc-900 truncate max-w-md">{event.title}</h4>
              <span className="text-sm text-zinc-500">{event.bookings?.length || 0} bookings</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-zinc-500">Revenue:</span>
              <span className="font-bold text-zinc-900">
                {event.hasTickets 
                  ? `$${(event.bookings?.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.amountUSD, 0) || 0).toLocaleString()}`
                  : 'Free Event'}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="p-3 w-36 text-zinc-500 font-bold text-[10px] uppercase tracking-wider">Guest</th>
                  <th className="p-3 w-24 text-zinc-500 font-bold text-[10px] uppercase tracking-wider">Date</th>
                  <th className="p-3 w-20 text-zinc-500 font-bold text-[10px] uppercase tracking-wider">Guests</th>
                  <th className="p-3 w-24 text-zinc-500 font-bold text-[10px] uppercase tracking-wider">Tier</th>
                  <th className="p-3 w-28 text-zinc-500 font-bold text-[10px] uppercase tracking-wider">Amount</th>
                  <th className="p-3 w-24 text-zinc-500 font-bold text-[10px] uppercase tracking-wider">Status</th>
                  <th className="p-3 w-28 text-zinc-500 font-bold text-[10px] uppercase tracking-wider">Payment</th>
                  <th className="p-3 w-24 text-right text-zinc-500 font-bold text-[10px] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {event.bookings.map((booking: any) => (
                  <tr key={booking.id} className="hover:bg-zinc-50/70">
                    <td className="p-3 w-36">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs">
                          {booking.guestName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-900 truncate">{booking.guestName}</div>
                          <div className="text-[10px] text-zinc-400 truncate">{booking.guestEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 w-24">
                      <div className="flex items-center gap-1.5 text-zinc-700">
                        <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                        <span>{new Date(booking.occurrenceDate || event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </td>
                    <td className="p-3 w-20">
                      <div className="flex items-center gap-1.5 text-zinc-700">
                        <User className="h-3.5 w-3.5 text-zinc-400" />
                        <span className="font-semibold">{booking.guestCount}</span>
                      </div>
                    </td>
                    <td className="p-3 w-24">
                      {event.hasTickets && booking.ticketTierId ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          {booking.ticketTierId}
                        </span>
                      ) : (
                        <span className="text-[10px] text-zinc-500">Free RSVP</span>
                      )}
                    </td>
                    <td className="p-3 w-28">
                      <div className="text-right">
                        <div className="font-semibold text-zinc-900">
                          {booking.currency === 'USD' 
                            ? `$${booking.amountUSD.toLocaleString()}` 
                            : `₦${booking.amountNaira.toLocaleString()}`}
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          {booking.currency === 'USD' 
                            ? `₦${booking.amountNaira.toLocaleString()}` 
                            : `$${booking.amountUSD.toLocaleString()}`}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 w-24">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${({
                        pending: 'bg-amber-50 text-amber-700 border-amber-200',
                        confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                        cancelled: 'bg-red-50 text-red-700 border-red-200',
                        waitlisted: 'bg-blue-50 text-blue-700 border-blue-200',
                        attended: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                      })[booking.status] || 'bg-zinc-50 text-zinc-700 border-zinc-200'}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-3 w-28">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${({
                        free: 'bg-gray-50 text-gray-700 border-gray-200',
                        pending: 'bg-amber-50 text-amber-700 border-amber-200',
                        paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                        refunded: 'bg-blue-50 text-blue-700 border-blue-200',
                      })[booking.paymentStatus] || 'bg-zinc-50 text-zinc-700 border-zinc-200'}`}>
                        {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                        {booking.paymentMethod && (
                          <span className="ml-1 text-[9px] opacity-75">({booking.paymentMethod})</span>
                        )}
                      </span>
                    </td>
                    <td className="p-3 w-24 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer" title="View Details"><Eye className="w-4 h-4" /></button>
                        {booking.status === 'pending' && (
                          <>
                            <button className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 cursor-pointer" title="Approve"><CheckCircle2 className="w-4 h-4" /></button>
                            <button className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer" title="Reject"><X className="w-4 h-4" /></button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <button className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 cursor-pointer" title="Check In"><CheckCircle2 className="w-4 h-4" /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};