# Bookings Hub Page Refactoring Requirements

## 1. Project Overview

- **Project Name**: BookingsHubPage Component Refactor
- **Project Type**: Code Refactoring  
- **Core Functionality**: Refactor the monolithic BookingsHubPage.tsx into reusable component files and move local state management to a Zustand store
- **Target Users**: Development team maintaining the admin dashboard

## 2. UI/UX Specification

### Layout Structure

Maintain existing layout structure exactly as-is:
- Toast notification banner
- Top header with currency toggle and walk-in button
- BookingStatsRow metrics bar
- BookingFilterBar with filters and view switcher
- Three view modes: table, cards, inhouse

### Visual Design

- **Preserve all existing styles exactly** - no CSS changes
- **Preserve all Tailwind class names** - no class name modifications

## 3. Functionality Specification

### State Management (Zustand Store)

Create `src/stores/bookingsHubStore.ts`:
- `viewMode`: 'table' | 'cards' | 'inhouse'
- `isWalkInModalOpen`: boolean
- `toastMsg`: string | null
- Actions for all state mutations

### Helper Functions

Extract to `src/utils/bookingHelpers.ts`:
- `getChannelBadge()` - returns channel badge JSX
- `getStatusBadge()` - returns status badge JSX
- `formatMoney()` - currency formatting

### Components to Extract

| Component | Description |
|-----------|-------------|
| BookingsHeader | Top header with title, currency, walk-in button |
| BookingsToast | Toast notification banner |
| BookingsTableView | Master table ledger view |
| BookingsCardsView | Room stay cards (kanban/grid) |
| BookingsInhouseView | Currently in-house guest roster |

## 4. Acceptance Criteria

- [ ] UI state moved to Zustand store
- [ ] Helper functions extracted to utils
- [ ] Each view mode extracted to separate component
- [ ] Page composition uses extracted components
- [ ] TypeScript compilation passes
- [ ] Production build succeeds