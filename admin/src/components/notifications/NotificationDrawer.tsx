import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Trash2, Activity, X } from 'lucide-react';
import { useNotificationStore } from '../../stores/notificationStore';
import { NotificationType } from '../../types/notification';
import { NotificationItem } from './NotificationItem';
import { TYPE_LABEL, isToday } from './notificationUtils';

type FilterKey = 'all' | NotificationType;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'booking', label: 'Bookings' },
  { key: 'payment', label: 'Payments' },
  { key: 'service', label: 'Services' },
  { key: 'housekeeping', label: 'Housekeeping' },
  { key: 'system', label: 'System' },
];

export const NotificationDrawer: React.FC = () => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    isDrawerOpen,
    setDrawerOpen,
    markAllRead,
    clearAll,
  } = useNotificationStore();

  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  useEffect(() => {
    if (!isDrawerOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, setDrawerOpen]);

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  const filtered = notifications.filter((n) => activeFilter === 'all' || n.type === activeFilter);
  const todayItems = filtered.filter((n) => isToday(n.timestamp));
  const earlierItems = filtered.filter((n) => !isToday(n.timestamp));

  return (
    <div
      id="notifications-drawer-root"
      className="fixed inset-0 z-50 overflow-hidden flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Notifications"
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-zinc-200 flex flex-col animate-in slide-in-from-right duration-300 z-10">
        {/* ================= DRAWER HEADER ================= */}
        <div className="p-5 border-b border-zinc-200/80 bg-zinc-50/70 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-ink text-white flex items-center justify-center relative">
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </span>
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Notifications</h3>
                <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mt-0.5">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={markAllRead}
                title="Mark all as read"
                className="p-2 rounded-xl text-zinc-500 hover:text-ink hover:bg-indigo-50 transition-colors cursor-pointer"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={clearAll}
                title="Clear all notifications"
                className="p-2 rounded-xl text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-xl text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ================= FILTER CHIPS ================= */}
        <div className="flex items-center gap-1.5 px-5 py-3 border-b border-zinc-200/70 overflow-x-auto custom-scrollbar shrink-0">
          {FILTERS.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => setActiveFilter(filter.key)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === filter.key
                  ? 'bg-ink text-white'
                  : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200/70'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* ================= NOTIFICATION LIST ================= */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center py-16">
              <span className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center mb-3">
                <Bell className="w-5 h-5" />
              </span>
              <p className="text-xs font-bold text-zinc-700">No {activeFilter !== 'all' ? TYPE_LABEL[activeFilter as NotificationType].toLowerCase() : ''} notifications</p>
              <p className="text-[11px] text-zinc-400 mt-1">New updates will appear here in real time.</p>
            </div>
          )}

          {todayItems.length > 0 && (
            <div className="space-y-2.5">
              <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                Today
              </span>
              {todayItems.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </div>
          )}

          {earlierItems.length > 0 && (
            <div className="space-y-2.5">
              <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                Earlier
              </span>
              {earlierItems.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </div>
          )}
        </div>

        {/* ================= DRAWER FOOTER ================= */}
        <div className="p-4 border-t border-zinc-200 bg-zinc-50 shrink-0">
          <button
            type="button"
            onClick={() => {
              setDrawerOpen(false);
              navigate('/admin/activity');
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5" />
            View Full Activity Log
          </button>
        </div>
      </div>
    </div>
  );
};