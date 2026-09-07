import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppNotification, NotificationDraft } from '../types/notification';

const MAX_NOTIFICATIONS = 60;

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  isDrawerOpen: boolean;
  liveFeed: boolean;

  push: (draft: NotificationDraft) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
  removeNotification: (id: string) => void;
  setDrawerOpen: (open: boolean) => void;
  toggleDrawer: () => void;
  setLiveFeed: (on: boolean) => void;
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
    navigateTo: '/admin/bookings',
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
    navigateTo: '/admin/bookings',
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

      push: (draft) =>
        set((state) => {
          const notification: AppNotification = {
            ...draft,
            id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            timestamp: Date.now(),
            read: false,
          };
          const notifications = [notification, ...state.notifications].slice(0, MAX_NOTIFICATIONS);
          return { notifications, unreadCount: state.unreadCount + 1 };
        }),

      markRead: (id) =>
        set((state) => {
          const target = state.notifications.find((n) => n.id === id);
          if (!target || target.read) return state;
          return {
            notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
            unreadCount: Math.max(0, state.unreadCount - 1),
          };
        }),

      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),

      clearAll: () => set({ notifications: [], unreadCount: 0 }),

      removeNotification: (id) =>
        set((state) => {
          const target = state.notifications.find((n) => n.id === id);
          return {
            notifications: state.notifications.filter((n) => n.id !== id),
            unreadCount: target && !target.read ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
          };
        }),

      setDrawerOpen: (open) => set({ isDrawerOpen: open }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
      setLiveFeed: (on) => set({ liveFeed: on }),
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