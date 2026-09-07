# Accommodation List Page Refactoring Tasks

## Phase 1: Store and Data Setup

### Task 1: Create accommodationStore.ts
**Description**: Create Zustand store for accommodation page UI state  
**Status**: not_started  
**Location**: `src/stores/accommodationStore.ts`

### Task 2: Create accommodationCategories.ts
**Description**: Extract static categories array to data file  
**Status**: not_started  
**Location**: `src/data/accommodationCategories.ts`

## Phase 2: Extract Components

### Task 3: Create AccommodationMetricsRow component
**Description**: Extract top 4 KPI cards row  
**Status**: not_started  
**Location**: `src/components/accommodation/AccommodationMetricsRow.tsx`

### Task 4: Create AccommodationFiltersBar component
**Description**: Extract search, sort, filter, view mode controls  
**Status**: not_started  
**Location**: `src/components/accommodation/AccommodationFiltersBar.tsx`

### Task 5: Create CategoryFilterPills component
**Status**: not_started  
**Location**: `src/components/accommodation/CategoryFilterPills.tsx`

### Task 6: Create RoomDisplay component
**Status**: not_started  
**Location**: `src/components/accommodation/RoomDisplay.tsx`

### Task 7: Create ReservationsTable component (DIV-BASED)
**Description**: Replace table with div elements - CRITICAL  
**Status**: not_started  
**Location**: `src/components/accommodation/ReservationsTable.tsx`

### Task 8: Create barrel export index.ts
**Status**: not_started  
**Location**: `src/components/accommodation/index.ts`

## Phase 3: Refactor Page

### Task 9: Refactor AccommodationListPage.tsx
**Description**: Refactor to use extracted components and Zustand store  
**Status**: not_started  
**Location**: `src/pages/AccommodationListPage.tsx`

## Phase 4: Verification

### Task 10: Verify TypeScript compilation
**Status**: not_started

### Task 11: Verify production build
**Status**: not_started