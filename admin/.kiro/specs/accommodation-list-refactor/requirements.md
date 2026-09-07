# Accommodation List Page Refactoring Requirements

## 1. Project Overview

- **Project Name**: AccommodationListPage Component Refactor
- **Project Type**: Code Refactoring
- **Core Functionality**: Refactor the monolithic AccommodationListPage.tsx into reusable component files and move local state management to a Zustand store
- **Target Users**: Development team maintaining the admin dashboard

## 2. UI/UX Specification

### Layout Structure

Maintain existing layout structure exactly as-is:
- Top metrics row (4 KPI cards)
- Suites Directory tab / Active Bookings tab
- Search, filter, sort, view mode controls
- Room cards grid/list view
- Reservations table

### Visual Design

- **Preserve all existing styles exactly** - no CSS changes
- **Preserve all Tailwind class names** - no class name modifications
- **Keep all inline styles** - maintain exact visual behavior

### Key Constraint: Table to Div Migration

The reservations table **MUST** be replaced with `<div>` elements while maintaining identical visual appearance:
- Use flexbox or grid layout to replicate table structure
- All table rows → div rows with same classes
- All table cells → div cells with same classes
- No visual difference allowed

## 3. Functionality Specification

### State Management (Zustand Store)

Create `src/stores/accommodationStore.ts` with all UI state:
- `activeTab`: 'rooms' | 'reservations'
- `viewMode`: 'grid' | 'list'
- `searchQuery`: string
- `selectedCategory`: string
- `displayCurrency`: 'USD' | 'NGN'
- `statusFilter`: 'all' | 'available' | 'occupied'
- `sortBy`: 'recommended' | 'price_asc' | 'price_desc' | 'rating'
- `quickWalkInRoom`: AccommodationRoom | null
- `notificationMsg`: string | null

Actions for all state mutations.

### Components to Extract

| Component | Description |
|-----------|-------------|
| AccommodationMetricsRow | Top 4 KPI cards row |
| AccommodationFiltersBar | Search, sort, filter, view mode controls |
| CategoryFilterPills | Category filter buttons |
| RoomGrid/List | Room cards display |
| ReservationsTable | Bookings table (div-based, not table) |
| BookingDetailDrawerWrapper | Drawer integration |
| QuickWalkInModalWrapper | Modal integration |

## 4. Acceptance Criteria

- [ ] All components extracted to `src/components/accommodation/`
- [ ] All local useState hooks moved to Zustand store
- [ ] AccommodationListPage.tsx imports and composes components
- [ ] Table element replaced with div elements in reservations view
- [ ] No visual differences - identical styling preserved
- [ ] TypeScript compilation passes
- [ ] Production build succeeds