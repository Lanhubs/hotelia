import { create } from 'zustand';
import { AccommodationRoom } from '../data/accommodationData';

export type ActiveTab = 'rooms' | 'reservations';
export type ViewMode = 'grid' | 'list';
export type DisplayCurrency = 'USD' | 'NGN';
export type StatusFilter = 'all' | 'available' | 'occupied';
export type SortBy = 'recommended' | 'price_asc' | 'price_desc' | 'rating';

interface AccommodationState {
  // UI State
  activeTab: ActiveTab;
  viewMode: ViewMode;
  searchQuery: string;
  selectedCategory: string;
  displayCurrency: DisplayCurrency;
  statusFilter: StatusFilter;
  sortBy: SortBy;
  quickWalkInRoom: AccommodationRoom | null;
  notificationMsg: string | null;
  
  // Actions
  setActiveTab: (tab: ActiveTab) => void;
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setDisplayCurrency: (currency: DisplayCurrency) => void;
  setStatusFilter: (filter: StatusFilter) => void;
  setSortBy: (sort: SortBy) => void;
  setQuickWalkInRoom: (room: AccommodationRoom | null) => void;
  setNotificationMsg: (msg: string | null) => void;
  clearNotification: () => void;
}

export const useAccommodationStore = create<AccommodationState>((set) => ({
  activeTab: 'rooms',
  viewMode: 'grid',
  searchQuery: '',
  selectedCategory: 'All',
  displayCurrency: 'USD',
  statusFilter: 'all',
  sortBy: 'recommended',
  quickWalkInRoom: null,
  notificationMsg: null,
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setDisplayCurrency: (currency) => set({ displayCurrency: currency }),
  setStatusFilter: (filter) => set({ statusFilter: filter }),
  setSortBy: (sort) => set({ sortBy: sort }),
  setQuickWalkInRoom: (room) => set({ quickWalkInRoom: room }),
  setNotificationMsg: (msg) => set({ notificationMsg: msg }),
  clearNotification: () => set({ notificationMsg: null }),
}));