import React from 'react';
import { useNotificationStore } from '../../stores/notificationStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const GlobalToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotificationStore();
  const activeToasts = notifications.filter((n) => !n.read).slice(0, 5);

  if (activeToasts.length === 0) return null;

  return (
    <div className="no-print fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {activeToasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start p-3 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl text-zinc-100 text-sm animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="mr-3 mt-0.5 shrink-0">
            {toast.severity === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {toast.severity === 'urgent' && <AlertCircle className="w-4 h-4 text-rose-400" />}
            {toast.severity === 'info' && <Info className="w-4 h-4 text-amber-400" />}
          </div>
          <div className="flex-1 pr-2">
            <h4 className="font-semibold text-xs text-zinc-300">{toast.title}</h4>
            <p className="text-zinc-400 text-xs mt-0.5">{toast.message}</p>
          </div>
          <button
            onClick={() => removeNotification(toast.id)}
            className="text-zinc-500 hover:text-zinc-300 p-1 transition-colors"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default GlobalToastContainer;
