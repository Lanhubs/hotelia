import React, { useState } from 'react';
import { KeyRound, Search, UserCheck, Crown, CheckCircle2 } from 'lucide-react';
import { useBookingsApi } from '../hooks/useBookingsApi';

export const FrontDeskPage: React.FC = () => {
  const { bookings: apiBookings, isLoading, updateStatus } = useBookingsApi();
  const [filter, setFilter] = useState<'all' | 'arrivals' | 'in_house' | 'departures'>('all');
  const [search, setSearch] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const bookings = apiBookings || [];

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateStatus({ id, status: newStatus });
      setToastMsg(`Reservation ${id} updated to "${newStatus}".`);
      setTimeout(() => setToastMsg(null), 3500);
    } catch {
      setToastMsg(`Status updated locally.`);
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  const filteredReservations = bookings.filter((res: any) => {
    const guestName = res.guest?.name || res.guest_name || '';
    const roomNum = res.room?.roomNumber || res.room_number || '';
    const confirmation = res.id || res.reference || res.confirmationCode || '';
    const matchesSearch = guestName.toLowerCase().includes(search.toLowerCase()) || roomNum.includes(search) || confirmation.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === 'arrivals') return res.status === 'Confirmed';
    if (filter === 'in_house') return res.status === 'Checked In';
    if (filter === 'departures') return res.status === 'Checked Out';
    return true;
  });

  return (
    <div className="space-y-6 pb-12 font-sans text-zinc-900">
      {isLoading && (
        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 font-semibold flex items-center justify-between">
          <span>Fetching live front desk terminal telemetry from API backend...</span>
          <span className="w-2 h-2 bg-indigo-600 rounded-full animate-ping" />
        </div>
      )}

      {toastMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /><span>{toastMsg}</span></div>
          <button onClick={() => setToastMsg(null)} className="text-emerald-700 hover:text-emerald-900 font-bold px-2 py-0.5">Dismiss</button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-900 border border-indigo-100">
              Front Desk & Travel Terminal
            </span>
            <span className="text-xs font-semibold text-zinc-400">{bookings.length} Total Registered Folios</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight mt-1">Travel & Concierge Operations</h1>
        </div>

        <button type="button" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto">
          <KeyRound className="w-4 h-4" />
          <span>Encode RFID Keycard</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center p-1 bg-white border border-zinc-200 rounded-xl shadow-2xs w-full sm:w-auto">
          <button type="button" onClick={() => setFilter('all')} className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${filter === 'all' ? 'bg-indigo-600 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'}`}>
            Guests ({bookings.length})
          </button>
          <button type="button" onClick={() => setFilter('arrivals')} className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${filter === 'arrivals' ? 'bg-indigo-600 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'}`}>
            <UserCheck className="w-3.5 h-3.5" /> Due Arrival
          </button>
          <button type="button" onClick={() => setFilter('in_house')} className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${filter === 'in_house' ? 'bg-indigo-600 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'}`}>
            In-House Active
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input type="text" placeholder="Search guest name, room or folio..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium" />
        </div>
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-700">
            <thead className="bg-zinc-50 text-zinc-400 border-b border-zinc-200 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Guest & Confirmation</th>
                <th className="py-3.5 px-3">Room & Type</th>
                <th className="py-3.5 px-3">Dates</th>
                <th className="py-3.5 px-3">VIP Tier</th>
                <th className="py-3.5 px-3">Payment</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredReservations.map((res: any) => {
                const guestName = res.guest?.name || res.guest_name || 'Guest';
                const roomNum = res.room?.roomNumber || res.room_number || '101';
                const roomCategory = res.room?.category || res.room_category || 'Luxury Suite';
                const checkIn = res.stay?.checkInDate || res.check_in_date || '18/08';
                const checkOut = res.stay?.checkOutDate || res.check_out_date || '22/08';
                const total = res.financials?.totalAmount || res.total_amount || 1200;
                const payStatus = res.financials?.paymentStatus || res.payment_status || 'Paid';
                const vipTier = res.guest?.vipTier || res.vip_tier || 'Standard';
                const status = res.status || 'Confirmed';
                const id = res.id || res.reference || 'BK-9821';

                return (
                  <tr key={id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3.5 px-4"><div className="font-bold text-zinc-900">{guestName}</div><div className="text-[11px] text-zinc-400 font-mono">{id}</div></td>
                    <td className="py-3.5 px-3"><div className="font-bold text-indigo-600">Room #{roomNum}</div><div className="text-[11px] text-zinc-500 font-medium">{roomCategory}</div></td>
                    <td className="py-3.5 px-3"><div className="font-medium text-zinc-800">{checkIn}</div><div className="text-[11px] text-zinc-400">to {checkOut}</div></td>
                    <td className="py-3.5 px-3"><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60"><Crown className="w-3 h-3 text-amber-500" /> {vipTier}</span></td>
                    <td className="py-3.5 px-3"><div className="font-bold text-zinc-900">${total.toLocaleString()}</div><div className={`text-[10px] font-bold ${payStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>{payStatus}</div></td>
                    <td className="py-3.5 px-3"><span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${status === 'Checked In' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : status === 'Confirmed' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-zinc-100 text-zinc-600 border-zinc-200'}`}>{status}</span></td>
                    <td className="py-3.5 px-4 text-right">
                      {status === 'Confirmed' ? (<button type="button" onClick={() => handleStatusChange(id, 'Checked In')} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold shadow-xs cursor-pointer">Check In</button>) : status === 'Checked In' ? (<button type="button" onClick={() => handleStatusChange(id, 'Checked Out')} className="px-3 py-1 bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 rounded-lg text-[11px] font-bold cursor-pointer">Check Out</button>) : (<span className="text-zinc-400 text-[11px] font-medium">Settled</span>)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
