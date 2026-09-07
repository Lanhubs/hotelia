# Accommodation List Page Refactoring Design

## Store Design

**File**: `src/stores/accommodationStore.ts`

```typescript
import { create } from 'zustand';
import { AccommodationRoom } from '../data/accommodationData';

type ActiveTab = 'rooms' | 'reservations';
type ViewMode = 'grid' | 'list';
type DisplayCurrency = 'USD' | 'NGN';
type StatusFilter = 'all' | 'available' | 'occupied';
type SortBy = 'recommended' | 'price_asc' | 'price_desc' | 'rating';

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
```

## Component Architecture

### 1. AccommodationMetricsRow.tsx
Top 4 KPI cards: Total Capacity, Walk-In Ready, Occupancy Rate, Walk-In Revenue

### 2. AccommodationFiltersBar.tsx
Search input, sort dropdown, status dropdown, grid/list toggle

### 3. CategoryFilterPills.tsx
Category filter button pills

### 4. RoomDisplay.tsx
Grid/List view of rooms using RoomCard component

### 5. ReservationsTable.tsx (DIV-BASED)
**Critical**: Must use `<div>` elements instead of `<table>`:
- Main container: `div` with overflow-x-auto
- Table structure: `div` with flex or grid
- Headers row: `div` with same classes as `<thead>`
- Body: `div` with same classes as `<tbody>`
- Each row: `div` with same classes as `<tr>`
- Each cell: `div` with same classes as `<td>`

## Data Files

Move static data to `src/data/accommodationStoreData.ts`:
- categories array

## Implementation Order

1. Create accommodationStore.ts
2. Create static data file (categories)
3. Create extracted components
4. Create barrel export
5. Refactor AccommodationListPage.tsx
6. Verify build