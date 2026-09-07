import React, { useState } from 'react';
import { Search, Crown, Mail, Phone, UserPlus } from 'lucide-react';

const GUESTS_LIST = [
  { id: 'G-1', name: 'Sir Arthur Stirling', email: 'astirling@stirlingholdings.com', phone: '+44 20 7946 0912', tier: 'Diamond', stays: 18, totalSpend: 48200, country: 'United Kingdom', preferences: 'Penthouse suite, Sparkling mineral water, 6 pillows' },
  { id: 'G-2', name: 'Alexander Hayes', email: 'alex.hayes@apexcapital.com', phone: '+1 415 555 0198', tier: 'Diamond', stays: 12, totalSpend: 31400, country: 'United States', preferences: 'Ocean villa, late check-out, gluten-free dining' },
  { id: 'G-3', name: 'Sophia Loren', email: 'sophia.loren@arte.it', phone: '+39 06 698 7200', tier: 'Gold', stays: 7, totalSpend: 14600, country: 'Italy', preferences: 'High floor, daily espresso delivery at 7 AM' },
  { id: 'G-4', name: 'Claire Bennett', email: 'claire.b@luminar.co.uk', phone: '+44 161 496 0188', tier: 'Gold', stays: 5, totalSpend: 9800, country: 'United Kingdom', preferences: 'Hypoallergenic bedding, spa wellness packages' },
  { id: 'G-5', name: 'David Zhang', email: 'dzhang@singaporetech.sg', phone: '+65 6789 0123', tier: 'Silver', stays: 3, totalSpend: 4200, country: 'Singapore', preferences: 'Airport chauffeur, king bed, quiet room' },
];

export const GuestsPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredGuests = GUESTS_LIST.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.email.toLowerCase().includes(search.toLowerCase()) ||
      g.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Guest Directory & CRM</h2>
          <p className="text-xs text-zinc-400 font-medium mt-0.5">
            Guest loyalty profiles, lifetime value, preferences, and custom stay requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search guests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#05C168]/20 focus:border-[#05C168] shadow-2xs"
            />
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#05C168] hover:bg-[#04a85a] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors whitespace-nowrap"
          >
            <UserPlus className="w-3.5 h-3.5" /> Add Guest
          </button>
        </div>
      </div>

      {/* Guest Directory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGuests.map((guest) => (
          <div
            key={guest.id}
            className="p-5 bg-white border border-zinc-100 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">{guest.name}</h3>
                  <p className="text-[11px] text-zinc-400 font-medium">{guest.country}</p>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-emerald-50 text-[#05C168]">
                  <Crown className="w-3.5 h-3.5" /> {guest.tier}
                </span>
              </div>

              <div className="mt-3.5 space-y-1.5 text-xs text-zinc-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="truncate">{guest.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{guest.phone}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100">
              <div className="flex items-center justify-between text-xs mb-2">
                <div>
                  <span className="text-zinc-400 text-[11px]">Lifetime Stays: </span>
                  <span className="font-bold text-zinc-800">{guest.stays}</span>
                </div>
                <div>
                  <span className="text-zinc-400 text-[11px]">Total LTV: </span>
                  <span className="font-bold text-[#05C168]">${guest.totalSpend.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 text-[11px] text-zinc-600">
                <span className="font-bold text-zinc-800">Preferences: </span>
                {guest.preferences}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
