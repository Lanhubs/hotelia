import { useEffect } from 'react';
import { useNotificationStore } from '../stores/notificationStore';

export function useGlobalToast() {
  const { push } = useNotificationStore();

  useEffect(() => {
    return () => {
      // cleanup on unmount
    };
  }, [push]);

  const toast = (message: string, options?: {
    type?: string;
    severity?: string;
    duration?: number;
  }) => {
    const toastType = options?.type || 'info';
    const toastSeverity = options?.severity || 'info';
    const duration = options?.duration ?? 5000;

    push({
      type: toastType as never,
      severity: toastSeverity as 'info' | 'success' | 'urgent',
      title: 'Notification',
      message,
      source: 'action',
    });
  };

  return { toast };
}