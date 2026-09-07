import React from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Globe,
  Store,
  Phone,
  Plane,
  Briefcase,
} from 'lucide-react';
import { BookingStatus } from '../../types/booking';

export type DisplayCurrency = 'USD' | 'NGN';

export const formatMoney = (amountUSD: number, currency: DisplayCurrency) => {
  if (currency === 'NGN') {
    return `₦${(amountUSD * 1600).toLocaleString()}`;
  }
  return `$${amountUSD.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

export const getChannelBadge = (channel: string, label: string, category: string) => {
  switch (channel) {
    case 'front_desk_walkin':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-orange-50 text-orange-800 border border-orange-200/70">
          <Store className="w-3.5 h-3.5 text-orange-600 shrink-0" />
          <span>{label}</span>
        </span>
      );
    case 'online_direct':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200/70">
          <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>{label}</span>
        </span>
      );
    case 'phone_concierge':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200/70">
          <Phone className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <span>{label}</span>
        </span>
      );
    case 'corporate_direct':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-zinc-100 text-zinc-800 border border-zinc-200">
          <Briefcase className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
          <span>{label}</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200/70">
          <Plane className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span>{label}</span>
        </span>
      );
  }
};

export const getStatusBadge = (status: BookingStatus) => {
  switch (status) {
    case 'Checked In':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Checked In</span>
        </span>
      );
    case 'Confirmed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
          <Clock className="w-3 h-3 text-indigo-600" />
          <span>Confirmed</span>
        </span>
      );
    case 'Checked Out':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-zinc-100 text-zinc-700 border border-zinc-200">
          <CheckCircle2 className="w-3 h-3 text-zinc-500" />
          <span>Checked Out</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
          <AlertCircle className="w-3 h-3 text-amber-600" />
          <span>{status}</span>
        </span>
      );
  }
};
