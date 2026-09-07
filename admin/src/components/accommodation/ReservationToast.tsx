import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ReservationToastProps {
  message: string | null;
  onDismiss: () => void;
}

export const ReservationToast: React.FC<ReservationToastProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-xs animate-in slide-in-from-top duration-200">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        <span>{message}</span>
      </div>
      <button
        onClick={onDismiss}
        className="text-emerald-600 hover:text-emerald-900 font-normal underline"
      >
        Dismiss
      </button>
    </div>
  );
};