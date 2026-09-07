# Persistent Notification System

## Overview
A complete persistent notification system for the KEO Hotel admin interface that stores notifications in the database, displays interactive toast notifications, and maintains state across page reloads.

## Features Implemented

### ✅ Database Persistence
- **Schema**: `CREATE_NOTIFICATIONS_TABLE` added to `api/src/dbSchema.ts`
- **Fields**: id, user_id, type, severity, title, message, meta, read, timestamp, source, navigate_to
- **Constraints**: 
  - Type: 'booking', 'payment', 'keycard', 'service', 'housekeeping', 'system'
  - Severity: 'info', 'success', 'urgent' 
  - Source: 'action', 'inbound'
- **Initialization**: Automatically created on database init

### ✅ API Layer
- **Repository**: `api/src/repositories/notificationRepository.ts` - CRUD operations with pagination
- **Service**: `api/src/services/notificationService.ts` - Business logic and validation
- **Controller**: `api/src/controllers/notificationController.ts` - 7 REST endpoints
- **Routes**: `api/src/routes/notifications.ts` - Registered at `/api/notifications`

### ✅ API Endpoints
```
GET    /api/notifications                 # List notifications (limit, offset)
GET    /api/notifications/unread-count    # Get unread count
POST   /api/notifications                 # Create notification
PATCH  /api/notifications/:id/read        # Mark as read
PATCH  /api/notifications/read-all        # Mark all as read
DELETE /api/notifications/:id             # Delete notification
DELETE /api/notifications                 # Delete all notifications
```

### ✅ Admin Frontend Integration
- **Store**: `admin/src/stores/notificationStore.ts` - Syncs with API + offline fallback
- **API Client**: `admin/src/lib/api.ts` - notificationApi methods
- **Toast Container**: `admin/src/components/notifications/ToastContainer.tsx`
- **App Integration**: `admin/src/App.tsx` - Loads on mount

### ✅ Interactive Toast Features
- **Auto-close**: 3 seconds (configurable)
- **Hover pause**: Auto-close pauses on hover
- **Manual dismiss**: X button to close
- **Navigation**: Click toast to navigate (if navigateTo set)
- **No layout shift**: Fixed positioning, z-index: 1000
- **Styling**: Severity-based colors, type-based badges

## Usage Examples

### Backend (API Controller)
```typescript
import { createNotification } from '../services/notificationService';

// Create a booking notification
await createNotification({
  userId: 'staff-mgr-001',
  type: 'booking',
  severity: 'success',
  title: 'New walk-in booking',
  message: 'John Doe checked into Room 101',
  meta: 'FOL-2026-8824',
  source: 'action',
  navigateTo: '/admin/bookings'
});
```

### Frontend (Admin Interface)
```typescript
import { useNotificationStore } from '../stores/notificationStore';

const pushNotification = useNotificationStore(state => state.push);

// Trigger a notification
pushNotification({
  type: 'payment',
  severity: 'success',
  title: 'Payment received',
  message: '$450.00 processed for Room 203',
  meta: 'PAY-2026-1245',
  source: 'inbound',
  navigateTo: '/admin/bookings'
});
```

## Key Benefits

1. **Persistent**: Notifications survive page reloads and browser restarts
2. **Interactive**: Hover to pause, click to navigate, manual dismiss
3. **Real-time**: Immediate display with auto-close behavior
4. **Offline-ready**: Local fallback when API is unavailable
5. **Scalable**: Pagination support for large notification volumes
6. **Type-safe**: Full TypeScript integration with validation

## Toast Behavior

- **Display**: Top-right corner, stacked vertically
- **Auto-close**: 3 seconds after appearing
- **Hover behavior**: Pause timer while hovering
- **Click behavior**: Navigate to navigateTo URL if provided
- **Manual dismiss**: Click X to close immediately
- **Styling**: Severity colors (urgent: amber, success: emerald, info: gray)

## Database Schema

```sql
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('booking', 'payment', 'keycard', 'service', 'housekeeping', 'system')),
  severity TEXT NOT NULL CHECK(severity IN ('info', 'success', 'urgent')),
  title TEXT NOT NULL CHECK(length(title) <= 100),
  message TEXT NOT NULL CHECK(length(message) <= 500),
  meta TEXT,
  read INTEGER DEFAULT 0,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  source TEXT NOT NULL CHECK(source IN ('action', 'inbound')),
  navigate_to TEXT
);
```

## Testing Checklist

- [x] Database schema created successfully
- [x] API server starts without errors
- [x] Admin build completes successfully
- [x] API endpoints respond correctly (with auth)
- [ ] Create notification via API
- [ ] Verify toast appears in admin interface
- [ ] Test auto-close after 3 seconds
- [ ] Test hover pause functionality
- [ ] Test manual dismiss
- [ ] Test navigation on click
- [ ] Test notification persistence after page reload
- [ ] Test offline fallback behavior

## File Structure

```
api/
├── src/
│   ├── controllers/notificationController.ts    # API endpoints
│   ├── repositories/notificationRepository.ts   # Database operations  
│   ├── services/notificationService.ts         # Business logic
│   ├── routes/notifications.ts                 # Route definitions
│   ├── schemas/notifications.ts                # Zod validation schemas
│   └── dbSchema.ts                            # Database schema (updated)

admin/
├── src/
│   ├── components/notifications/
│   │   ├── ToastContainer.tsx                 # Toast notification UI
│   │   └── notificationUtils.ts              # Styling utilities
│   ├── stores/notificationStore.ts            # State management
│   ├── types/notification.ts                  # TypeScript types
│   ├── lib/api.ts                            # API client (updated)
│   └── App.tsx                               # App integration (updated)
```

## Next Steps

1. Test the complete notification flow end-to-end
2. Add notification triggers to existing booking/payment workflows  
3. Implement notification preferences per user
4. Add email alerts for urgent notifications
5. Consider adding notification categories/filtering in UI