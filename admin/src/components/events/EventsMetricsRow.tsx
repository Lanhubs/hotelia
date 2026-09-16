import React from 'react';
import { Calendar, Users, Ticket, DollarSign, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { DisplayCurrency } from '../../components/bookings/bookingUtils';

interface EventsMetricsRowProps {
  displayCurrency: DisplayCurrency;
  stats?: {
    totalEvents: number;
    upcomingEvents: number;
    pastEvents: number;
    totalBookings: number;
    totalRevenueUSD: number;
    totalRevenueNaira: number;
  };
}

export const EventsMetricsRow: React.FC<EventsMetricsRowProps> = ({
  displayCurrency,
  stats,
}) => {
  const formatMoney = (amountUSD: number, currency: DisplayCurrency) => {
    if (currency === 'NGN') {
      return `₦${(amountUSD * 1600).toLocaleString()}`;
    }
    return `$${amountUSD.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-4">
      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-zinc-400">Total Events</p>
            <p className="text-xl font-extrabold text-zinc-900">{stats?.totalEvents || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <Loader2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-zinc-400">Upcoming</p>
            <p className="text-xl font-extrabold text-zinc-900">{stats?.upcomingEvents || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-zinc-400">Completed</p>
            <p className="text-xl font-extrabold text-zinc-900">{stats?.pastEvents || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
            <Ticket className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-zinc-400">Total Bookings</p>
            <p className="text-xl font-extrabold text-zinc-900">{stats?.totalBookings || 0}</p>
          </div>
        </div>
      </div>

      <div className=" bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <p className="text-[11px] font-medium text-zinc-400">Revenue (₦)</p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-extrabold text-zinc-900">₦{(stats?.totalRevenueNaira || 0).toLocaleString()}</span>
        </div>
      </div>

    </div>
  );
};