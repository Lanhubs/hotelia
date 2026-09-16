import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  CheckCircle2,
  Edit3,
  Trash2,
  MoreVertical,
  Eye,
  X,
  Sparkles,
} from 'lucide-react';
import type { Event, EventBooking, EventOccurrence } from '../../stores/eventsStore';
import { formatMoney } from '../../components/bookings/bookingUtils';
import { EventBookingsTable } from './EventBookingsTable';

interface EventDetailDrawerProps {
  event: Event;
  occurrences: EventOccurrence[];
  onClose: () => void;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
}

const TYPE_LABELS: Record<string, string> = {
  party: 'Party',
  wedding: 'Wedding',
  corporate: 'Corporate',
  gala: 'Gala',
  conference: 'Conference',
  social: 'Social',
  other: 'Other',
};

const STATUS_BADGES: Record<string, string> = {
  scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
  ongoing: 'bg-purple-50 text-purple-700 border-purple-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

export const EventDetailDrawer: React.FC<EventDetailDrawerProps> = ({
  event,
  occurrences,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'occurrences' | 'bookings'>('overview');

  return (
    <div className="fixed inset-0 z-60 flex items-end justify-center sm:items-center sm:justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full sm:w-4xl lg:w-5xl bg-white rounded-t-2xl sm:rounded-tl-2xl sm:rounded-bl-2xl shadow-2xl max-h-[90vh] overflow-hidden z-10 animate-in slide-in-from-right">
        <div className="p-4 border-b border-zinc-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400"><X className="w-5 h-5" /></button>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700">
                {TYPE_LABELS[event.eventType] || event.eventType}
              </span>
              <h3 className="text-lg font-bold text-zinc-900 truncate max-w-md">{event.title}</h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onEdit(event)} className="px-3 py-1.5 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-lg cursor-pointer">Edit</button>
            <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="flex border-b border-zinc-200 overflow-x-auto">
          {(['overview', 'occurrences', 'bookings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-xs font-bold whitespace-nowrap transition-all cursor-pointer border-b-2 ${
                activeTab === tab
                  ? 'border-purple-600 text-purple-600'
                  : 'text-zinc-400 hover:text-zinc-700 hover:border-zinc-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${TYPE_LABELS[event.eventType] ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-zinc-50 text-zinc-700 border-zinc-200'}`}>
                  {TYPE_LABELS[event.eventType] || event.eventType}
                </span>
                {event.isRecurring && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    Recurring
                  </span>
                )}
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${STATUS_BADGES[event.status] || 'bg-zinc-50 text-zinc-700 border-zinc-200'}`}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
                {event.isFeatured && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Featured</span>
                )}
                {event.isPublished && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Published</span>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium text-zinc-900">Event Details</h4>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-zinc-500">Category</dt>
                      <dd className="font-medium text-zinc-900">{event.category}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-zinc-500">Description</dt>
                      <dd className="font-medium text-zinc-900 max-w-xs truncate">{event.description || '—'}</dd>
                    </div>
                    {event.tags && event.tags.length > 0 && (
                      <div className="flex justify-between">
                        <dt className="text-zinc-500">Tags</dt>
                        <dd className="font-medium text-zinc-900">{event.tags.join(', ')}</dd>
                      </div>
                    )}
                  </dl>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-zinc-900">Schedule</h4>
                  <dl className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 justify-between">
                      <dt className="text-zinc-500 flex items-center gap-2"><Calendar className="h-4 w-4" /> Date</dt>
                      <dd className="font-medium text-zinc-900">
                        {new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        {event.endDate !== event.startDate && (
                          <span className="ml-2 text-zinc-500">– {new Date(event.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        )}
                      </dd>
                    </div>
                    <div className="flex items-center gap-2 justify-between">
                      <dt className="text-zinc-500 flex items-center gap-2"><Clock className="h-4 w-4" /> Time</dt>
                      <dd className="font-medium text-zinc-900">{event.startTime} – {event.endTime} ({event.timezone})</dd>
                    </div>
                    {event.isRecurring && event.recurrenceRule && (
                      <div className="flex justify-between">
                        <dt className="text-zinc-500">Recurrence</dt>
                        <dd className="font-medium text-zinc-900 font-mono text-xs">{event.recurrenceRule}</dd>
                      </div>
                    )}
                    {event.recurrenceEndDate && (
                      <div className="flex justify-between">
                        <dt className="text-zinc-500">Recurrence Ends</dt>
                        <dd className="font-medium text-zinc-900">{new Date(event.recurrenceEndDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</dd>
                      </div>
                    )}
                    {event.recurrenceExceptions && event.recurrenceExceptions.length > 0 && (
                      <div className="flex justify-between">
                        <dt className="text-zinc-500">Exceptions</dt>
                        <dd className="font-medium text-zinc-900 text-xs">{event.recurrenceExceptions.join(', ')}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium text-zinc-900">Venue</h4>
                  <dl className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 justify-between">
                      <dt className="text-zinc-500 flex items-center gap-2"><MapPin className="h-4 w-4" /> Name</dt>
                      <dd className="font-medium text-zinc-900">{event.venueName || '—'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-zinc-500">Description</dt>
                      <dd className="font-medium text-zinc-900">{event.venueDescription || '—'}</dd>
                    </div>
                    <div className="flex items-center gap-2 justify-between">
                      <dt className="text-zinc-500 flex items-center gap-2"><Users className="h-4 w-4" /> Capacity</dt>
                      <dd className="font-medium text-zinc-900">{event.maxCapacity || 'Unlimited'}</dd>
                    </div>
                  </dl>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-zinc-900">Tickets & Booking</h4>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-zinc-500">Paid Tickets</dt>
                      <dd className="font-medium text-zinc-900">{event.hasTickets ? 'Yes' : 'No (Free RSVP)'}</dd>
                    </div>
                    {event.hasTickets && (
                      <>
                        <div className="flex justify-between">
                          <dt className="text-zinc-500">Ticket Tiers</dt>
                          <dd className="font-medium text-zinc-900">{event.ticketTiers?.length || 0}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-zinc-500">Pricing</dt>
                          <dd className="font-medium text-zinc-900">
                            {event.ticketTiers?.map(t => `${t.name}: ${formatMoney(t.priceUSD, 'USD')} / ₦${t.priceNaira ? formatMoney(t.priceNaira / 1600, 'NGN') : 'N/A'}`).join(' | ')}
                          </dd>
                        </div>
                      </>
                    )}
                    {!event.hasTickets && (
                      <div className="flex justify-between">
                        <dt className="text-zinc-500">RSVP Limit</dt>
                        <dd className="font-medium text-zinc-900">{event.rsvpLimit || 'Unlimited'}</dd>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <dt className="text-zinc-500">Requires Approval</dt>
                      <dd className="font-medium text-zinc-900">{event.requiresApproval ? 'Yes' : 'No'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-zinc-500">Booking Opens</dt>
                      <dd className="font-medium text-zinc-900">{event.bookingOpensAt ? new Date(event.bookingOpensAt).toLocaleString() : 'Immediately'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-zinc-500">Booking Closes</dt>
                      <dd className="font-medium text-zinc-900">{event.bookingClosesAt ? new Date(event.bookingClosesAt).toLocaleString() : 'Event start'}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200 space-y-4">
                <h4 className="font-medium text-zinc-900">Media & Contact</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between"><dt className="text-zinc-500">Hero Image</dt><dd className="font-medium text-zinc-900">{event.heroImage ? 'Uploaded' : 'None'}</dd></div>
                    <div className="flex justify-between"><dt className="text-zinc-500">Gallery Images</dt><dd className="font-medium text-zinc-900">{event.gallery?.length || 0}</dd></div>
                  </dl>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between"><dt className="text-zinc-500">Contact Email</dt><dd className="font-medium text-zinc-900">{event.contactEmail || '—'}</dd></div>
                    <div className="flex justify-between"><dt className="text-zinc-500">Contact Phone</dt><dd className="font-medium text-zinc-900">{event.contactPhone || '—'}</dd></div>
                    <div className="flex justify-between"><dt className="text-zinc-500">External URL</dt><dd className="font-medium text-zinc-900">{event.externalRegistrationUrl || '—'}</dd></div>
                  </dl>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'occurrences' && (
            <div className="space-y-4">
              <h4 className="font-medium text-zinc-900 mb-2">Event Occurrences ({occurrences.length})</h4>
              {occurrences.length === 0 ? (
                <p className="text-zinc-500 text-center py-8">No occurrences in the selected date range</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-zinc-50 border-b border-zinc-200">
                        <th className="p-3 w-36 text-zinc-500 font-bold text-[10px] uppercase tracking-wider">Date</th>
                        <th className="p-3 w-24 text-zinc-500 font-bold text-[10px] uppercase tracking-wider">Day</th>
                        <th className="p-3 w-24 text-zinc-500 font-bold text-[10px] uppercase tracking-wider">Time</th>
                        <th className="p-3 w-20 text-zinc-500 font-bold text-[10px] uppercase tracking-wider">Type</th>
                        <th className="p-3 w-24 text-zinc-500 font-bold text-[10px] uppercase tracking-wider">Capacity</th>
                        <th className="p-3 text-zinc-500 font-bold text-[10px] uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {occurrences.map((occ) => (
                        <tr key={occ.occurrenceDate} className="hover:bg-zinc-50/70">
                          <td className="p-3 w-36 font-medium text-zinc-900">{new Date(occ.occurrenceDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</td>
                          <td className="p-3 w-24 text-zinc-700">{new Date(occ.occurrenceDate).toLocaleDateString('en-US', { weekday: 'long' })}</td>
                          <td className="p-3 w-24 text-zinc-700">{occ.startTime} – {occ.endTime}</td>
                          <td className="p-3 w-20">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                              {TYPE_LABELS[occ.eventType] || occ.eventType}
                            </span>
                          </td>
                          <td className="p-3 w-24 text-right font-semibold text-zinc-900">{occ.maxCapacity || '∞'}</td>
                          <td className="p-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${occ.isRecurrenceInstance ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                              {occ.isRecurrenceInstance ? 'Recurring Instance' : 'Original Event'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'bookings' && (
            <EventBookingsTable events={[event]} />
          )}
        </div>
      </div>
    </div>
  );
};
