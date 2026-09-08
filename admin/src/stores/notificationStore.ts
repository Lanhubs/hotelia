import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppNotification, NotificationDraft } from '../types/notification';
import { notificationApi } from '../lib/api';

const MAX_NOTIFICATIONS = 60;

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  isDrawerOpen: boolean;
  liveFeed: boolean;
  isLoading: boolean;

  push: (draft: NotificationDraft) => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  clearAll: () => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
  setDrawerOpen: (open: boolean) => void;
  toggleDrawer: () => void;
  setLiveFeed: (on: boolean) => void;
  loadFromApi: () => Promise<void>;
  syncUnreadCount: () => Promise<void>;
}

const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-seed-1',
    type: 'booking',
    severity: 'success',
    title: 'New walk-in booking created',
    message: 'Elena Rostova checked in Sophia Loren · Room 104 (Chapparal Lodge)',
    meta: 'FOL-2026-8824',
    timestamp: Date.now() - 45 * 60 * 1000,
    read: false,
    source: 'action',
    navigateTo: '/bookings',
  },
  {
    id: 'notif-seed-2',
    type: 'payment',
    severity: 'success',
    title: 'Folio payment authorized',
    message: '$3,250.00 received via POS Terminal for Alexander Hayes',
    meta: 'FOL-2026-8914',
    timestamp: Date.now() - 3 * 60 * 60 * 1000,
    read: false,
    source: 'inbound',
    navigateTo: '/bookings',
  },
  {
    id: 'notif-seed-3',
    type: 'housekeeping',
    severity: 'info',
    title: 'Room marked inspected',
    message: 'Room 301 (Ocean Villa) cleaned & returned to Available',
    meta: 'RM-301',
    timestamp: Date.now() - 6 * 60 * 60 * 1000,
    read: true,
    source: 'inbound',
  },
  {
    id: 'notif-seed-4',
    type: 'system',
    severity: 'info',
    title: 'Terminal secured',
    message: 'EXEC-STATION-01 locked after idle session',
    meta: 'SYSTEM',
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    read: true,
    source: 'action',
  },
];

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: SEED_NOTIFICATIONS,
      unreadCount: SEED_NOTIFICATIONS.filter((n) => !n.read).length,
      isDrawerOpen: false,
      liveFeed: false,
      isLoading: false,

      push: async (draft) => {
        try {
          // Sync to API
          await notificationApi.createNotification({
            type: draft.type,
            severity: draft.severity,
            title: draft.title,
            message: draft.message,
            meta: draft.meta,
            source: draft.source,
            navigateTo: draft.navigateTo,
          });
          
          // Update local state
          set((state) => {
            const notification: AppNotification = {
              ...draft,
              id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              timestamp: Date.now(),
              read: false,
            };
            const notifications = [notification, ...state.notifications].slice(0, MAX_NOTIFICATIONS);
            return { notifications, unreadCount: state.unreadCount + 1 };
          });
        } catch (error) {
          console.error('Failed to create notification:', error);
          // Fall back to local push if API fails
          set((state) => {
            const notification: AppNotification = {
              ...draft,
              id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              timestamp: Date.now(),
              read: false,
            };
            const notifications = [notification, ...state.notifications].slice(0, MAX_NOTIFICATIONS);
            return { notifications, unreadCount: state.unreadCount + 1 };
          });
        }
      },

      markRead: async (id) => {
        try {
          await notificationApi.markAsRead(id);
          set((state) => {
            const target = state.notifications.find((n) => n.id === id);
            if (!target || target.read) return state;
            return {
              notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
              unreadCount: Math.max(0, state.unreadCount - 1),
            };
          });
        } catch (error) {
          console.error('Failed to mark notification as read:', error);
          // Fall back to local update if API fails
          set((state) => {
            const target = state.notifications.find((n) => n.id === id);
            if (!target || target.read) return state;
            return {
              notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
              unreadCount: Math.max(0, state.unreadCount - 1),
            };
          });
        }
      },

      markAllRead: async () => {
        try {
          await notificationApi.markAllAsRead();
          set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
            unreadCount: 0,
          }));
        } catch (error) {
          console.error('Failed to mark all notifications as read:', error);
          // Fall back to local update if API fails
          set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
            unreadCount: 0,
          }));
        }
      },

      clearAll: async () => {
        try {
          await notificationApi.deleteAll();
          set({ notifications: [], unreadCount: 0 });
        } catch (error) {
          console.error('Failed to clear all notifications:', error);
          // Fall back to local clear if API fails
          set({ notifications: [], unreadCount: 0 });
        }
      },

      removeNotification: async (id) => {
        try {
          await notificationApi.deleteNotification(id);
          set((state) => {
            const target = state.notifications.find((n) => n.id === id);
            return {
              notifications: state.notifications.filter((n) => n.id !== id),
              unreadCount: target && !target.read ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
            };
          });
        } catch (error) {
          console.error('Failed to remove notification:', error);
          // Fall back to local remove if API fails
          set((state) => {
            const target = state.notifications.find((n) => n.id === id);
            return {
              notifications: state.notifications.filter((n) => n.id !== id),
              unreadCount: target && !target.read ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
            };
          });
        }
      },

      setDrawerOpen: (open) => set({ isDrawerOpen: open }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
      setLiveFeed: (on) => set({ liveFeed: on }),
      loadFromApi: async () => {
        set({ isLoading: true });
        try {
          const response = await notificationApi.getNotifications(60, 0);
          set({ notifications: response.notifications || [], isLoading: false });
          get().syncUnreadCount();
        } catch (error) {
          console.error('Failed to load notifications from API:', error);
          set({ isLoading: false });
        }
      },
      syncUnreadCount: async () => {
        try {
          const response = await notificationApi.getUnreadCount();
          set({ unreadCount: response.unreadCount });
        } catch (error) {
          console.error('Failed to sync unread count:', error);
          // Fallback to local calculation
          const notifications = get().notifications;
          const unreadCount = notifications.filter((n) => !n.read).length;
          set({ unreadCount });
        }
      },
    }),
    {
      name: 'KeoExperience-pms-notifications-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
      }),
    }
  )
);

export const notificationStore = () => useNotificationStore.getState();
