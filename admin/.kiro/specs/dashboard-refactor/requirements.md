# Dashboard Page Refactoring Requirements

## 1. Project Overview

- **Project Name**: Dashboard Page Component Refactor
- **Project Type**: Code Refactoring
- **Core Functionality**: Refactor the monolithic DashboardPage.tsx into reusable component files and move local state management to a Zustand store
- **Target Users**: Development team maintaining the admin dashboard

## 2. UI/UX Specification

### Layout Structure

Maintain existing layout structure exactly as-is:
- 2-column responsive bento layout (8 cols left, 4 cols right)
- 3 KPI cards row at top
- Channel Performance Intelligence section with 3 tabs
- Booking Timeline Yield + Room Status side-by-side
- Latest Bookings table at bottom
- Right panel: Calendar, Walk-in Quick Action, Inventory Tracking

### Visual Design

- **Preserve all existing styles exactly** - no CSS changes
- **Preserve all Tailwind class names** - no class name modifications
- **Keep all inline styles** - maintain exact visual behavior

### Components to Extract

| Component Name | Description |
|----------------|-------------|
| `KPICard` | Single KPI card (reusable for Occupancy, Travel, Catering) |
| `ChannelPerformanceCard` | Online vs Offline performance section with tabs |
| `OnlineChannelsCard` | Online channels detailed metrics card |
| `OfflineChannelsCard` | Offline/Walk-in detailed metrics card |
| `ProfitabilityTab` | Yield & Margins tab content |
| `SubChannelsTable` | Sub-channels performance table |
| `BookingTimelineChart` | Bar chart with booking yield data |
| `RoomStatusDonut` | Donut gauge showing room status breakdown |
| `LatestBookingsTable` | Table showing latest booking stream |
| `DashboardCalendar` | Calendar with room category tabs |
| `WalkInQuickAction` | Front desk walk-in yield boost card |
| `InventoryTracking` | Inventory tracking with segmented progress |

### Data Handling

- All mock/static data stays within components or moves to separate data files
- Data structures remain unchanged

## 3. Functionality Specification

### State Management (Zustand Store)

Create `src/stores/dashboardStore.ts` with:

```typescript
interface DashboardState {
  // UI State
  selectedRoomCategory: 'Suites' | 'Deluxe' | 'Single' | 'Double';
  selectedBar: number | null;
  timeRange: string;
  calendarWeek: string;
  channelViewMode: 'overview' | 'profitability' | 'channels';
  
  // Dropdown visibility
  showTimeRangeDropdown: boolean;
  showWeekDropdown: boolean;
  
  // Actions
  setSelectedRoomCategory: (category: 'Suites' | 'Deluxe' | 'Single' | 'Double') => void;
  setSelectedBar: (index: number | null) => void;
  setTimeRange: (range: string) => void;
  setCalendarWeek: (week: string) => void;
  setChannelViewMode: (mode: 'overview' | 'profitability' | 'channels') => void;
  setShowTimeRangeDropdown: (show: boolean) => void;
  setShowWeekDropdown: (show: boolean) => void;
}
```

### Component Architecture

```
src/
  components/
    dashboard/
      KPICard.tsx
      ChannelPerformanceCard.tsx
      OnlineChannelsCard.tsx
      OfflineChannelsCard.tsx
      ProfitabilityTab.tsx
      SubChannelsTable.tsx
      BookingTimelineChart.tsx
      RoomStatusDonut.tsx
      LatestBookingsTable.tsx
      DashboardCalendar.tsx
      WalkInQuickAction.tsx
      InventoryTracking.tsx
      index.ts (barrel export)
  stores/
    dashboardStore.ts
  pages/
    DashboardPage.tsx (composed of above components)
```

### Component Props

Each extracted component should:
- Accept relevant props for dynamic data
- Use Zustand store for UI state
- Maintain all existing styling and class names

## 4. Acceptance Criteria

- [ ] All components extracted to `src/components/dashboard/`
- [ ] All local useState hooks moved to Zustand store
- [ ] DashboardPage.tsx imports and composes all extracted components
- [ ] All existing styles and class names preserved exactly
- [ ] No breaking changes to existing functionality
- [ ] TypeScript types properly defined
- [ ] Component barrel export created