# Dashboard Page Refactoring Design

## Component Architecture

### Store Design

**File**: `src/stores/dashboardStore.ts`

The Zustand store will handle all UI state that was previously managed with `useState` in DashboardPage.tsx.

```typescript
import { create } from 'zustand';

type RoomCategory = 'Suites' | 'Deluxe' | 'Single' | 'Double';
type ChannelViewMode = 'overview' | 'profitability' | 'channels';

interface DashboardState {
  // UI State
  selectedRoomCategory: RoomCategory;
  selectedBar: number | null;
  timeRange: string;
  calendarWeek: string;
  channelViewMode: ChannelViewMode;
  
  // Dropdown visibility
  showTimeRangeDropdown: boolean;
  showWeekDropdown: boolean;
  
  // Actions
  setSelectedRoomCategory: (category: RoomCategory) => void;
  setSelectedBar: (index: number | null) => void;
  setTimeRange: (range: string) => void;
  setCalendarWeek: (week: string) => void;
  setChannelViewMode: (mode: ChannelViewMode) => void;
  setShowTimeRangeDropdown: (show: boolean) => void;
  setShowWeekDropdown: (show: boolean) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  // Initial state matching DashboardPage defaults
  selectedRoomCategory: 'Deluxe',
  selectedBar: 2,
  timeRange: 'Last 7 days',
  calendarWeek: 'Week 4',
  channelViewMode: 'overview',
  showTimeRangeDropdown: false,
  showWeekDropdown: false,
  
  // Actions
  setSelectedRoomCategory: (category) => set({ selectedRoomCategory: category }),
  setSelectedBar: (index) => set({ selectedBar: index }),
  setTimeRange: (range) => set({ timeRange: range, showTimeRangeDropdown: false }),
  setCalendarWeek: (week) => set({ calendarWeek: week, showWeekDropdown: false }),
  setChannelViewMode: (mode) => set({ channelViewMode: mode }),
  setShowTimeRangeDropdown: (show) => set({ showTimeRangeDropdown: show }),
  setShowWeekDropdown: (show) => set({ showWeekDropdown: show }),
}));
```

## Component Breakdown

### 1. KPICard.tsx
**Purpose**: Reusable KPI card for Occupancy, Travel, and Culinary metrics
**Location**: `src/components/dashboard/KPICard.tsx`

Props:
- `title`: string - Card header title
- `icon`: ReactNode - Icon component
- `mainValue`: string | number - Primary display value
- `subtitle`: string - Secondary text
- `stats`: Array<{ label: string; value: string | number; icon?: ReactNode }> - Stats list
- `linkText`: string - Link button text
- `linkTo`: string - React Router path
- `highlightText`?: string - Optional highlighted text with icon
- `highlightColor`?: string - Highlight text color class

### 2. ChannelPerformanceCard.tsx
**Purpose**: Container for online vs offline performance comparison
**Location**: `src/components/dashboard/ChannelPerformanceCard.tsx`

Uses Zustand store for `channelViewMode`
Renders:
- Header with badges
- View mode toggle
- Progress bar
- Tab content based on `channelViewMode`

### 3. OnlineChannelsCard.tsx
**Purpose**: Online channels detailed metrics
**Location**: `src/components/dashboard/OnlineChannelsCard.tsx`

Props:
- `stats`: Online channel statistics object

### 4. OfflineChannelsCard.tsx
**Purpose**: Offline/Walk-in detailed metrics
**Location**: `src/components/dashboard/OfflineChannelsCard.tsx`

Props:
- `stats`: Offline channel statistics object

### 5. ProfitabilityTab.tsx
**Purpose**: Yield & Margins tab content
**Location**: `src/components/dashboard/ProfitabilityTab.tsx`

Props:
- `onlineStats`, `offlineStats`: Channel stats

### 6. SubChannelsTable.tsx
**Purpose**: Sub-channels performance table
**Location**: `src/components/dashboard/SubChannelsTable.tsx`

Props:
- `data`: Sub-channel data array

### 7. BookingTimelineChart.tsx
**Purpose**: Bar chart showing booking yield over time
**Location**: `src/components/dashboard/BookingTimelineChart.tsx`

Uses Zustand store for `selectedBar`, `timeRange`, `showTimeRangeDropdown`
Renders:
- Header with dropdown
- Y-axis labels
- Interactive bar chart

### 8. RoomStatusDonut.tsx
**Purpose**: Donut gauge showing room status breakdown
**Location**: `src/components/dashboard/RoomStatusDonut.tsx`

Props:
- `statusItems`: Array of room status items with counts and colors

### 9. LatestBookingsTable.tsx
**Purpose**: Table showing latest booking stream
**Location**: `src/components/dashboard/LatestBookingsTable.tsx`

Props:
- `bookings`: Array of booking records

### 10. DashboardCalendar.tsx
**Purpose**: Calendar with room category tabs
**Location**: `src/components/dashboard/DashboardCalendar.tsx`

Uses Zustand store for `selectedRoomCategory`, `calendarWeek`, `showWeekDropdown`
Renders:
- Week dropdown
- Room category tabs
- Daily schedule stack

### 11. WalkInQuickAction.tsx
**Purpose**: Front desk walk-in yield boost card
**Location**: `src/components/dashboard/WalkInQuickAction.tsx`

No external props needed - self-contained

### 12. InventoryTracking.tsx
**Purpose**: Inventory tracking with segmented progress
**Location**: `src/components/dashboard/InventoryTracking.tsx`

Props:
- `inventoryData`: Inventory items data

## Data Files

Static/mock data will be extracted to separate files in `src/data/`:

### dashboardData.ts (new)
Contains:
- BOOKING_BARS
- ROOM_STATUS_ITEMS
- LATEST_BOOKINGS
- CALENDAR_DAYS
- Online/offline stats objects
- Inventory tracking data

## DashboardPage Composition

The refactored DashboardPage.tsx will:

```typescript
import React from 'react';
import { useDashboardStore } from '../stores/dashboardStore';
import { useBookingStore } from '../stores/bookingStore';
import { KPICard } from '../components/dashboard/KPICard';
import { ChannelPerformanceCard } from '../components/dashboard/ChannelPerformanceCard';
// ... other imports

export const DashboardPage: React.FC = () => {
  const { formatMoney } = useBookingStore();
  
  // Render extracted components with data
  return (
    <div className="space-y-5 pb-8 font-sans text-zinc-900">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Left Column */}
        <div className="xl:col-span-8 space-y-5">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KPICard {...occupancyProps} />
            <KPICard {...travelProps} />
            <KPICard {...cateringProps} />
          </div>
          
          <ChannelPerformanceCard />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <BookingTimelineChart />
            <RoomStatusDonut />
          </div>
          
          <LatestBookingsTable />
        </div>
        
        {/* Right Column */}
        <div className="xl:col-span-4 space-y-5">
          <DashboardCalendar />
          <WalkInQuickAction />
          <InventoryTracking />
        </div>
      </div>
    </div>
  );
};
```

## Implementation Order

1. Create `dashboardStore.ts`
2. Create `src/data/dashboardData.ts` with all static data
3. Create individual component files in `src/components/dashboard/`
4. Create `src/components/dashboard/index.ts` barrel export
5. Refactor `DashboardPage.tsx` to use components
6. Update imports in App.tsx or routing if needed