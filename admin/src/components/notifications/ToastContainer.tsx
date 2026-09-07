
import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppNotification } from '../../types/notification';
import { useNotificationStore } from '../../stores/notificationStore';
import {
  TYPE_ICON,
  TYPE_LABEL,
  typeChip,
  formatRelativeTime,
  severityChip,
  severityIcon,
} from './notificationUtils';

interface ToastContainerProps {
  autoClose?: number;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ autoClose = 3000 }) => {
  const navigate = useNavigate();
  const { notifications, markRead, removeNotification } = useNotificationStore();
  
  // Get unread notifications, sorted by timestamp (most recent first)
  const unreadNotifications = notifications
    .filter((n) => !n.read)
    .sort((a, b) => b.timestamp - a.timestamp);

  const [visibleToasts, setVisibleToasts] = useState<Map<string, boolean>>(new Map());

  // Show all unread notifications when component mounts
  useEffect(() => {
    const map = new Map<string, boolean>();
    unreadNotifications.forEach((n) => map.set(n.id, true));
    setVisibleToasts(map);
  }, [unreadNotifications]);

  // Handle toast visibility with auto-close
  useEffect(() => {
    const timerMap = new Map<string, NodeJS.Timeout>();

    unreadNotifications.forEach((notification) => {
      if (!visibleToasts.get(notification.id)) return;

      const timer = setTimeout(() => {
        setVisibleToasts((prev) => {
          const next = new Map(prev);
          next.set(notification.id, false);
          return next;
        });
      }, autoClose);

      timerMap.set(notification.id, timer);
    });

    return () => {
      timerMap.forEach((timer) => clearTimeout(timer));
    };
  }, [unreadNotifications, autoClose]);

  // Clear toast after animation
  useEffect(() => {
    const cleanupTimers = new Map<string, NodeJS.Timeout>();

    visibleToasts.forEach((visible, id) => {
      if (!visible) {
        const timer = setTimeout(() => {
          removeNotification(id);
        }, 300); // Match CSS transition duration
        cleanupTimers.set(id, timer);
      }
    });

    return () => {
      cleanupTimers.forEach((timer) => clearTimeout(timer));
    };
  }, [visibleToasts, removeNotification]);

  // Handle toast interactions
  const handleToastClick = useCallback(
    (notification: AppNotification) => {
      if (!notification.read) {
        markRead(notification.id);
      }
      if (notification.navigateTo) {
        navigate(notification.navigateTo);
      }
    },
    [navigate, markRead]
  );

  const handleDismiss = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      removeNotification(id);
    },
    [removeNotification]
  );

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-96 max-w-full pointer-events-none">
      {unreadNotifications.map((notification) => {
        const Icon = TYPE_ICON[notification.type];
        const SeverityIcon = severityIcon(notification.severity);
        const isVisible = visibleToasts.get(notification.id);

        return (
          <div
            key={notification.id}
            className={`pointer-events-auto bg-white rounded-2xl border shadow-xl overflow-hidden transition-all duration-300 ease-out transform ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
            onClick={() => handleToastClick(notification)}
          >
            <div className="flex items-start gap-3 p-3.5">
              {/* Icon container */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  notification.type === 'booking'
                    ? 'bg-[#EEF2FF] text-ink'
                    : notification.type === 'payment' || notification.type === 'keycard'
                    ? 'bg-emerald-50 text-emerald-600'
                    : notification.type === 'service'
                    ? 'bg-amber-50 text-amber-600'
                    : notification.type === 'housekeeping'
                    ? 'bg-sky-50 text-sky-600'
                    : 'bg-zinc-100 text-zinc-500'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`text-sm font-semibold text-zinc-900 truncate ${
                        notification.read ? 'text-zinc-600' : ''
                      }`}
                    >
                      {notification.title}
                    </h4>
                    <button
                      type="button"
                      onClick={(e) => handleDismiss(e, notification.id)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
                      aria-label="Dismiss notification"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 font-medium leading-relaxed mt-1 line-clamp-2">
                  {notification.message}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${typeChip(notification.type)}`}>
                    {TYPE_LABEL[notification.type]}
                  </span>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    notification.severity === 'urgent'
                      ? 'bg-amber-500'
                      : notification.severity === 'success'
                      ? 'bg-emerald-500'
                      : 'bg-zinc-400'
                  }`} />
                  <span className="text-[10px] font-mono text-zinc-400 ml-auto">
                    {formatRelativeTime(notification.timestamp)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom border indicator based on severity */}
            <div
              className={`h-1 w-full ${
                notification.severity === 'urgent'
                  ? 'bg-amber-500'
                  : notification.severity === 'success'
                  ? 'bg-emerald-500'
                  : 'bg-zinc-200'
              }`} 
            />
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
