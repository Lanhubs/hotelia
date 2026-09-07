import {
  CalendarCheck2,
  DollarSign,
  KeyRound,
  UtensilsCrossed,
  Sparkles,
  Info,
  AlertTriangle,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react';
import { NotificationType, NotificationSeverity } from '../../types/notification';

export const TYPE_ICON: Record<NotificationType, LucideIcon> = {
  booking: CalendarCheck2,
  payment: DollarSign,
  keycard: KeyRound,
  service: UtensilsCrossed,
  housekeeping: Sparkles,
  system: Info,
};

export const TYPE_LABEL: Record<NotificationType, string> = {
  booking: 'Bookings',
  payment: 'Payments',
  keycard: 'Keycards',
  service: 'Services',
  housekeeping: 'Housekeeping',
  system: 'System',
};

export function severityIcon(severity: NotificationSeverity): LucideIcon {
  if (severity === 'urgent') return AlertTriangle;
  if (severity === 'success') return CheckCircle2;
  return Info;
}

export function severityChip(severity: NotificationSeverity): string {
  if (severity === 'urgent') return 'bg-amber-50 border-amber-200 text-amber-700';
  if (severity === 'success') return 'bg-emerald-50 border-emerald-200 text-emerald-700';
  return 'bg-zinc-100 border-zinc-200 text-zinc-600';
}

export function typeChip(type: NotificationType): string {
  if (type === 'booking') return 'bg-[#EEF2FF] text-ink border-indigo-100';
  if (type === 'payment' || type === 'keycard') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (type === 'service') return 'bg-amber-50 text-amber-700 border-amber-200';
  if (type === 'housekeeping') return 'bg-sky-50 text-sky-700 border-sky-200';
  return 'bg-zinc-100 text-zinc-600 border-zinc-200';
}

export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

export function isToday(timestamp: number): boolean {
  const date = new Date(timestamp);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}