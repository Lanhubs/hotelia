import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface EventToastProps {
  message: string | null;
  onDismiss: () => void;
}

export const EventToast: React.FC<EventToastProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold flex items-center justify-between shadow-sm animate-in slide-in-from-top duration-200">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-purple-600" />
        <span>{message}</span>
      </div>
      <button
        onClick={onDismiss}
        className="text-purple-700 hover:text-purple-900 underline cursor-pointer"
      >
        Dismiss
      </button>
    </div>
  );
};