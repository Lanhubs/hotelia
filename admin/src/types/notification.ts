export type NotificationType =
  | 'booking'
  | 'payment'
  | 'keycard'
  | 'service'
  | 'housekeeping'
  | 'system';

export type NotificationSeverity = 'info' | 'success' | 'urgent';

export type NotificationSource = 'action' | 'inbound';

export interface AppNotification {
  id: string;
  type: NotificationType;
  severity: NotificationSeverity;
  title: string;
  message: string;
  meta?: string;
  timestamp: number;
  read: boolean;
  source: NotificationSource;
  navigateTo?: string;
}

export interface NotificationDraft {
  type: NotificationType;
  severity: NotificationSeverity;
  title: string;
  message: string;
  meta?: string;
  source: NotificationSource;
  navigateTo?: string;
}