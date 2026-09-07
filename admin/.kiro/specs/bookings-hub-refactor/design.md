# Bookings Hub Page Refactoring Design

## Store Design

**File**: `src/stores/bookingsHubStore.ts`

```typescript
import { create } from 'zustand';

type ViewMode = 'table' | 'cards' | 'inhouse';

interface BookingsHubState {
  viewMode: ViewMode;
  isWalkInModalOpen: boolean;
  toastMsg: string | null;
  
  setViewMode: (mode: ViewMode) => void;
  setIsWalkInModalOpen: (open: boolean) => void;
  setToastMsg: (msg: string | null) => void;
  clearToast: () => void;
}

export const useBookingsHubStore = create<BookingsHubState>((set) => ({
  viewMode: 'table',
  isWalkInModalOpen: false,
  toastMsg: null,
  
  setViewMode: (mode) => set({ viewMode: mode }),
  setIsWalkInModalOpen: (open) => set({ isWalkInModalOpen: open }),
  setToastMsg: (msg) => set({ toastMsg: msg }),
  clearToast: () => set({ toastMsg: null }),
}));
```

## Helper Functions

**File**: `src/utils/bookingHelpers.ts`

Contains:
- `formatMoney(amountUSD: number, displayCurrency: 'USD' | 'NGN'): string`
- `getChannelBadge(channel: string, label: string, category: string): JSX.Element`
- `getStatusBadge(status: BookingStatus): JSX.Element`

## Components

### 1. BookingsHeader.tsx
Top header with title, currency toggle, walk-in button

### 2. BookingsToast.tsx
Toast notification banner

### 3. BookingsTableView.tsx
Master table ledger (div-based like previous tasks)

### 4. BookingsCardsView.tsx
Room stay cards (kanban/grid) view

### 5. BookingsInhouseView.tsx
Currently in-house guest roster

## Implementation Order

1. Create bookingsHubStore.ts
2. Create bookingHelpers.ts
3. Create extracted components
4. Create barrel export
5. Refactor BookingsHubPage.tsx
6. Verify build