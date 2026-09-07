import { useEffect } from 'react';
import { useNotificationStore } from '../stores/notificationStore';
import { NotificationDraft, NotificationType } from '../types/notification';

interface InboundTemplate {
  type: NotificationType;
  severity: NotificationDraft['severity'];
  title: string;
  message: string;
  meta?: string;
  navigateTo?: string;
}

const INBOUND_EVENTS: InboundTemplate[] = [
  {
    type: 'booking',
    severity: 'success',
    title: 'New OTA booking received',
    message: 'Alexander Hayes · Executive Suite · 3 nights via Booking.com',
    meta: 'OTA-BKG-4821',
    navigateTo: '/admin/bookings',
  },
  {
    type: 'booking',
    severity: 'urgent',
    title: 'High-priority booking created',
    message: 'Sir Arthur Stirling · Ocean Villa · 5 nights via Expedia',
    meta: 'OTA-BKG-4823',
    navigateTo: '/admin/bookings',
  },
  {
    type: 'payment',
    severity: 'success',
    title: 'Folio payment authorized',
    message: '$3,250.00 received via card for Alexander Hayes',
    meta: 'FOL-2026-8914',
    navigateTo: '/admin/bookings',
  },
  {
    type: 'payment',
    severity: 'info',
    title: 'Partial deposit collected',
    message: '$500.00 deposit taken for David Zhang stay',
    meta: 'FOL-2026-8840',
    navigateTo: '/admin/bookings',
  },
  {
    type: 'housekeeping',
    severity: 'info',
    title: 'Room marked inspected',
    message: 'Room 104 (Chapparal Lodge) cleaned & returned to Available',
    meta: 'RM-104',
  },
  {
    type: 'housekeeping',
    severity: 'info',
    title: 'Housekeeping dispatch',
    message: 'Room 303 requested turndown & linen refresh',
    meta: 'RM-303',
  },
  {
    type: 'keycard',
    severity: 'success',
    title: 'RFID keycard encoded',
    message: 'Key 2 of 2 encoded for Room 201 · David Zhang',
    meta: 'RFID-K201-7742',
    navigateTo: '/admin/bookings',
  },
  {
    type: 'service',
    severity: 'urgent',
    title: 'Urgent room service order',
    message: 'Sir Arthur Stirling ordered late-night dining (Diamond VIP)',
    meta: 'ORD-5890',
    navigateTo: '/admin/services',
  },
  {
    type: 'service',
    severity: 'info',
    title: 'Spa reservation confirmed',
    message: 'Sophia Loren · 60-min Deep Tissue · 04:00 PM',
    meta: 'ORD-5891',
    navigateTo: '/admin/services',
  },
];

export const useRealtimeNotificationFeed = (): void => {
  const liveFeed = useNotificationStore((s) => s.liveFeed);

  useEffect(() => {
    if (!liveFeed) return;
    const push = useNotificationStore.getState().push;

    const firstDelivery = setTimeout(() => {
      const template = INBOUND_EVENTS[Math.floor(Math.random() * INBOUND_EVENTS.length)];
      push({ ...template, source: 'inbound' });
    }, 8000);

    const interval = setInterval(() => {
      const template = INBOUND_EVENTS[Math.floor(Math.random() * INBOUND_EVENTS.length)];
      push({ ...template, source: 'inbound' });
    }, 45000);

    return () => {
      clearTimeout(firstDelivery);
      clearInterval(interval);
    };
  }, [liveFeed]);
};