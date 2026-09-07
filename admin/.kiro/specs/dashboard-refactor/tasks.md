# Dashboard Page Refactoring Tasks

## Phase 1: Store and Data Setup

### Task 1: Create dashboardStore.ts
**Description**: Create Zustand store for dashboard UI state  
**Status**: not_started  
**Location**: `src/stores/dashboardStore.ts`

### Task 2: Create dashboardData.ts
**Description**: Extract all static/mock data from DashboardPage.tsx to a separate data file  
**Status**: not_started  
**Location**: `src/data/dashboardData.ts`

## Phase 2: Extract Components

### Task 3: Create KPICard component
**Description**: Extract reusable KPI card component  
**Status**: not_started  
**Location**: `src/components/dashboard/KPICard.tsx`

### Task 4: Create ChannelPerformanceCard component
**Description**: Extract online vs offline performance section  
**Status**: not_started  
**Location**: `src/components/dashboard/ChannelPerformanceCard.tsx`

### Task 5: Create OnlineChannelsCard component
**Status**: not_started  
**Location**: `src/components/dashboard/OnlineChannelsCard.tsx`

### Task 6: Create OfflineChannelsCard component
**Status**: not_started  
**Location**: `src/components/dashboard/OfflineChannelsCard.tsx`

### Task 7: Create ProfitabilityTab component
**Status**: not_started  
**Location**: `src/components/dashboard/ProfitabilityTab.tsx`

### Task 8: Create SubChannelsTable component
**Status**: not_started  
**Location**: `src/components/dashboard/SubChannelsTable.tsx`

### Task 9: Create BookingTimelineChart component
**Status**: not_started  
**Location**: `src/components/dashboard/BookingTimelineChart.tsx`

### Task 10: Create RoomStatusDonut component
**Status**: not_started  
**Location**: `src/components/dashboard/RoomStatusDonut.tsx`

### Task 11: Create LatestBookingsTable component
**Status**: not_started  
**Location**: `src/components/dashboard/LatestBookingsTable.tsx`

### Task 12: Create DashboardCalendar component
**Status**: not_started  
**Location**: `src/components/dashboard/DashboardCalendar.tsx`

### Task 13: Create WalkInQuickAction component
**Status**: not_started  
**Location**: `src/components/dashboard/WalkInQuickAction.tsx`

### Task 14: Create InventoryTracking component
**Status**: not_started  
**Location**: `src/components/dashboard/InventoryTracking.tsx`

### Task 15: Create barrel export index.ts
**Description**: Create index.ts to export all dashboard components  
**Status**: not_started  
**Location**: `src/components/dashboard/index.ts`

## Phase 3: Refactor DashboardPage

### Task 16: Refactor DashboardPage.tsx
**Description**: Refactor to use extracted components and Zustand store  
**Status**: not_started  
**Location**: `src/pages/DashboardPage.tsx`

## Phase 4: Verification

### Task 17: Verify build compiles
**Description**: Run TypeScript build to ensure no compilation errors  
**Status**: not_started

### Task 18: Verify application runs
**Description**: Start dev server and verify no runtime errors  
**Status**: not_started