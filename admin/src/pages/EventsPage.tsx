import React, { useState, useMemo } from 'react';
import { useEventsApi } from '../hooks/useEventsApi';
import { EventsPageHeader } from '../components/events/EventsPageHeader';
import { EventsFiltersBar, EventsViewMode } from '../components/events/EventsFiltersBar';
import { EventCategoryPills } from '../components/events/EventCategoryPills';
import { EventsMetricsRow } from '../components/events/EventsMetricsRow';
import { EventDisplay } from '../components/events/EventDisplay';
import { CreateEventModal } from '../components/events/CreateEventModal';
import { DeleteEventModal } from '../components/events/DeleteEventModal';
import { EventDetailDrawer } from '../components/events/EventDetailDrawer';
import { EventToast } from '../components/events/EventToast';
import { EventBookingsTable } from '../components/events/EventBookingsTable';
import { EventsCalendar } from '../components/events/EventsCalendar';
import { DisplayCurrency } from '../components/bookings/bookingUtils';
import { useBookingStore } from '../stores/bookingStore';

export const EventsPage: React.FC = () => {
  const {
    events: apiEvents,
    stats,
    isLoadingEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  } = useEventsApi();
  const { displayCurrency, setDisplayCurrency } = useBookingStore();

  const [activeTab, setActiveTab] = useState<'events' | 'calendar' | 'bookings'>('events');
  const [viewMode, setViewMode] = useState<EventsViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'scheduled' | 'ongoing' | 'completed' | 'cancelled'>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'date_asc' | 'date_desc' | 'title' | 'capacity' | 'revenue'>('recommended');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [deletingEvent, setDeletingEvent] = useState<any>(null);
  const [viewingEvent, setViewingEvent] = useState<any>(null);
  const [viewingEventOccurrences, setViewingEventOccurrences] = useState<any[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const filteredEvents = useMemo(() => {
    return apiEvents.filter((event) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!event.title.toLowerCase().includes(q) &&
            !event.venueName?.toLowerCase().includes(q) &&
            !event.category.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (selectedEventType !== 'all' && event.eventType !== selectedEventType) return false;
      if (selectedStatus !== 'all' && event.status !== selectedStatus) return false;
      if (dateFrom && event.startDate < dateFrom) return false;
      if (dateTo && event.startDate > dateTo) return false;
      return true;
    });
  }, [apiEvents, searchQuery, selectedEventType, selectedStatus, dateFrom, dateTo]);

  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) => {
      if (sortBy === 'date_asc') return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      if (sortBy === 'date_desc') return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'capacity') return (b.maxCapacity || 0) - (a.maxCapacity || 0);
      if (sortBy === 'revenue') return (b.ticketTiers?.[0]?.priceUSD || 0) - (a.ticketTiers?.[0]?.priceUSD || 0);
      return 0;
    });
  }, [filteredEvents, sortBy]);

  const handleCreateEvent = async (data: any) => {
    if (data.id) {
      await updateEvent(data.id, data);
      setToastMsg(`Event "${data.title}" updated successfully.`);
    } else {
      await createEvent(data);
      setToastMsg(`Event "${data.title}" created successfully.`);
    }
    setTimeout(() => setToastMsg(null), 4000);
    setIsCreateModalOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (event: any) => {
    setDeletingEvent(event);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteEvent = async () => {
    if (!deletingEvent) return;
    deleteEvent(deletingEvent.id)
      .then(() => {
        setToastMsg(`"${deletingEvent.title}" deleted.`);
        setTimeout(() => setToastMsg(null), 4000);
      })
      .catch(() => {
        setToastMsg('Failed to delete event.');
        setTimeout(() => setToastMsg(null), 4000);
      })
      .finally(() => {
        setIsDeleteModalOpen(false);
        setDeletingEvent(null);
      });
  };

  const handleViewEvent = (event: any) => {
    setViewingEvent(event);
    setViewingEventOccurrences([]);
  };

  const handleViewBookings = (event: any) => {
    setActiveTab('bookings');
    setViewingEvent(event);
  };

  const handleEditFromDrawer = (event: any) => {
    setViewingEvent(null);
    setEditingEvent(event);
    setIsCreateModalOpen(true);
  };

  const handleDeleteFromDrawer = (event: any) => {
    setViewingEvent(null);
    setDeletingEvent(event);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-14 font-sans text-zinc-900">
      {isLoadingEvents && (
        <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl text-xs text-purple-900 font-semibold flex items-center justify-between">
          <span>Fetching events from API...</span>
          <span className="w-2 h-2 bg-purple-600 rounded-full animate-ping" />
        </div>
      )}

      <EventToast message={toastMsg} onDismiss={() => setToastMsg(null)} />
      <EventsPageHeader displayCurrency={displayCurrency} onToggleCurrency={() => setDisplayCurrency(displayCurrency === 'USD' ? 'NGN' : 'USD')} onCreateEvent={() => { setEditingEvent(null); setIsCreateModalOpen(true); }} />

      <div className="flex flex-col">
        <div className="lg:col-span-1">
          <EventsMetricsRow displayCurrency={displayCurrency} stats={stats} />
        </div>

        <div className="lg:col-span-3">
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-zinc-900">{activeTab === 'events' ? 'Events & Parties' : activeTab === 'calendar' ? 'Events Calendar' : 'Event Bookings'}</h2>
              <div className="flex items-center p-1 bg-white border border-zinc-200 rounded-xl shadow-2xs">
                <button
                  onClick={() => setActiveTab('events')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeTab === 'events' ? 'bg-purple-600 text-white shadow-xs' : 'text-zinc-500 hover:text-zinc-900'}`}
                >
                  Events
                </button>
                <button
                  onClick={() => setActiveTab('calendar')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeTab === 'calendar' ? 'bg-purple-600 text-white shadow-xs' : 'text-zinc-500 hover:text-zinc-900'}`}
                >
                  Calendar
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeTab === 'bookings' ? 'bg-purple-600 text-white shadow-xs' : 'text-zinc-500 hover:text-zinc-900'}`}
                >
                  Bookings
                </button>
              </div>
            </div>

            {activeTab === 'events' && (
              <>
                <EventsFiltersBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  totalCount={apiEvents.length}
                  filteredCount={sortedEvents.length}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  statusFilter={selectedStatus}
                  onStatusChange={setSelectedStatus}
                  dateFrom={dateFrom}
                  onDateFromChange={setDateFrom}
                  dateTo={dateTo}
                  onDateToChange={setDateTo}
                  onResetFilters={() => { setSearchQuery(''); setSelectedEventType('all'); setSelectedStatus('all'); setSortBy('recommended'); setDateFrom(''); setDateTo(''); }}
                />
                <EventCategoryPills selectedEventType={selectedEventType} onEventTypeChange={setSelectedEventType} />
                <EventDisplay
                  filteredEvents={sortedEvents}
                  displayCurrency={displayCurrency}
                  viewMode={viewMode}
                  onEdit={handleEditFromDrawer}
                  onDelete={handleDeleteEvent}
                  onViewBookings={handleViewBookings}
                  onResetFilters={() => { setSearchQuery(''); setSelectedEventType('all'); setSelectedStatus('all'); setSortBy('recommended'); setDateFrom(''); setDateTo(''); }}
                />
              </>
            )}

            {activeTab === 'calendar' && (
              <EventsCalendar events={apiEvents} />
            )}

            {activeTab === 'bookings' && (
              <EventBookingsTable events={apiEvents} />
            )}
          </div>
        </div>
      </div>

      {isCreateModalOpen && (
        <CreateEventModal
          editingEvent={editingEvent}
          displayCurrency={displayCurrency}
          onClose={() => { setIsCreateModalOpen(false); setEditingEvent(null); }}
          onSubmit={handleCreateEvent}
        />
      )}

      {isDeleteModalOpen && deletingEvent && (
        <DeleteEventModal
          event={deletingEvent}
          onClose={() => { setIsDeleteModalOpen(false); setDeletingEvent(null); }}
          onConfirm={confirmDeleteEvent}
        />
      )}

      {viewingEvent && (
        <EventDetailDrawer
          event={viewingEvent}
          occurrences={viewingEventOccurrences}
          onClose={() => { setViewingEvent(null); setViewingEventOccurrences([]); }}
          onEdit={handleEditFromDrawer}
          onDelete={handleDeleteFromDrawer}
        />
      )}
    </div>
  );
};