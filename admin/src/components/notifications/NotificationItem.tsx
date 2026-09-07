import React from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppNotification } from '../../types/notification';
import { useNotificationStore } from '../../stores/notificationStore';
import {
  TYPE_ICON,
  TYPE_LABEL,
  typeChip,
  formatRelativeTime,
} from './notificationUtils';

interface NotificationItemProps {
  notification: AppNotification;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const navigate = useNavigate();
  const { markRead, removeNotification } = useNotificationStore();

  const Icon = TYPE_ICON[notification.type];

  const handleClick = () => {
    if (!notification.read) markRead(notification.id);
    if (notification.navigateTo) navigate(notification.navigateTo);
  };

  return (
    <div
      className={`group relative flex items-start gap-3 p-3.5 rounded-2xl border transition-colors cursor-pointer ${
        notification.read
          ? 'bg-white border-zinc-200/70 hover:bg-zinc-50'
          : 'bg-[#F8F9FF] border-indigo-100 hover:bg-[#EEF2FF]'
      }`}
      onClick={handleClick}
    >
      <span
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
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
        <Icon className="w-4 h-4" />
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-zinc-900 truncate">{notification.title}</span>
          {!notification.read && (
            <span className="w-1.5 h-1.5 rounded-full bg-ink shrink-0" />
          )}
        </div>
        <p className="text-[11px] text-zinc-500 font-medium leading-relaxed mt-0.5 line-clamp-2">
          {notification.message}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] font-mono text-zinc-400">
            {formatRelativeTime(notification.timestamp)}
          </span>
          {notification.meta && (
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border ${typeChip(notification.type)}`}>
              {notification.meta}
            </span>
          )}
          {notification.navigateTo && (
            <span className="text-[10px] font-bold text-ink opacity-0 group-hover:opacity-100 transition-opacity">
              Open {TYPE_LABEL[notification.type]}
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          removeNotification(notification.id);
        }}
        className="absolute top-2.5 right-2.5 p-1 rounded-lg text-zinc-300 hover:text-zinc-500 hover:bg-zinc-100 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};