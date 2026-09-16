import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type EventsViewMode = 'grid' | 'list';
export type EventsActiveTab = 'events' | 'calendar' | 'bookings';
export type EventsSortBy = 'recommended' | 'date_asc' | 'date_desc' | 'title' | 'capacity' | 'revenue';
export type EventsStatusFilter = 'all' | 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
export type EventsEventType = 'all' | 'party' | 'wedding' | 'corporate' | 'gala' | 'conference' | 'social' | 'other';

export type { Event, TicketTier, EventBooking, EventOccurrence, EventFilters, BookingFilters, EventStats } from './eventsTypes';

interface EventsState {
  // View
  viewMode: EventsViewMode;
  activeTab: EventsActiveTab;
  
  // Filters
  searchQuery: string;
  selectedEventType: EventsEventType;
  statusFilter: EventsStatusFilter;
  sortBy: EventsSortBy;
  dateFrom: string;
  dateTo: string;
  
  // Calendar
  calendarViewYear: number;
  
  // Actions
  setViewMode: (mode: EventsViewMode) => void;
  setActiveTab: (tab: EventsActiveTab) => void;
  setSearchQuery: (query: string) => void;
  setSelectedEventType: (type: EventsEventType) => void;
  setStatusFilter: (filter: EventsStatusFilter) => void;
  setSortBy: (sort: EventsSortBy) => void;
  setDateFrom: (date: string) => void;
  setDateTo: (date: string) => void;
  setCalendarViewYear: (year: number) => void;
  resetFilters: () => void;
}

const initialState = {
  viewMode: 'grid' as EventsViewMode,
  activeTab: 'events' as EventsActiveTab,
  searchQuery: '',
  selectedEventType: 'all' as EventsEventType,
  statusFilter: 'all' as EventsStatusFilter,
  sortBy: 'recommended' as EventsSortBy,
  dateFrom: '',
  dateTo: '',
  calendarViewYear: new Date().getFullYear(),
};

export const useEventsStore = create<EventsState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setViewMode: (mode) => set({ viewMode: mode }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedEventType: (type) => set({ selectedEventType: type }),
      setStatusFilter: (filter) => set({ statusFilter: filter }),
      setSortBy: (sort) => set({ sortBy: sort }),
      setDateFrom: (date) => set({ dateFrom: date }),
      setDateTo: (date) => set({ dateTo: date }),
      setCalendarViewYear: (year) => set({ calendarViewYear: year }),
      
      resetFilters: () => set({
        searchQuery: '',
        selectedEventType: 'all',
        statusFilter: 'all',
        sortBy: 'recommended',
        dateFrom: '',
        dateTo: '',
      }),
    }),
    {
      name: 'events-store',
    }
  )
);