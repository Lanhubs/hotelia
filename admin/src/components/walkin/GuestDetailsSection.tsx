import React from 'react';
import { User, Phone, Mail } from 'lucide-react';

export type WalkInVipTier = 'Standard' | 'VIP Diamond' | 'Executive Platinum';

interface GuestDetailsSectionProps {
  guestName: string;
  onGuestNameChange: (value: string) => void;
  guestPhone: string;
  onGuestPhoneChange: (value: string) => void;
  guestEmail: string;
  onGuestEmailChange: (value: string) => void;
  idPassport: string;
  onIdPassportChange: (value: string) => void;
  nationality: string;
  onNationalityChange: (value: string) => void;
  vipTier: WalkInVipTier;
  onVipTierChange: (value: any) => void;
}

export const GuestDetailsSection: React.FC<GuestDetailsSectionProps> = ({
  guestName,
  onGuestNameChange,
  guestPhone,
  onGuestPhoneChange,
  guestEmail,
  onGuestEmailChange,
  idPassport,
  onIdPassportChange,
  nationality,
  onNationalityChange,
  vipTier,
  onVipTierChange,
}) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[#EEF2FF] text-ink flex items-center justify-center text-xs font-black">
            1
          </div>
          <h2 className="text-sm font-bold text-zinc-900">Walk-In Guest Information</h2>
        </div>
        <span className="text-[11px] text-zinc-400 font-medium">Mandatory for Hotel Registry & Police Folio</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
        <div>
          <label className="block font-semibold text-zinc-700 mb-1">Full Legal Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={guestName}
              onChange={(e) => onGuestNameChange(e.target.value)}
              placeholder="e.g. Chief Adeola Adeleke"
              className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200/80 rounded-lg text-zinc-900 font-semibold focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-zinc-700 mb-1">Phone Number (WhatsApp)</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={guestPhone}
              onChange={(e) => onGuestPhoneChange(e.target.value)}
              placeholder="+234 800 000 0000"
              className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200/80 rounded-lg text-zinc-900 font-semibold focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-zinc-700 mb-1">Email (For Digital Folio & Invoice)</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={guestEmail}
              onChange={(e) => onGuestEmailChange(e.target.value)}
              placeholder="guest@corporate.ng"
              className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200/80 rounded-lg text-zinc-900 font-semibold focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-zinc-700 mb-1">Passport / NIN / National ID</label>
          <input
            type="text"
            required
            value={idPassport}
            onChange={(e) => onIdPassportChange(e.target.value)}
            placeholder="A09823412"
            className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200/80 rounded-lg text-zinc-900 font-semibold focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink"
          />
        </div>

        <div>
          <label className="block font-semibold text-zinc-700 mb-1">Nationality</label>
          <input
            type="text"
            value={nationality}
            onChange={(e) => onNationalityChange(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200/80 rounded-lg text-zinc-900 font-semibold focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink"
          />
        </div>

        <div>
          <label className="block font-semibold text-zinc-700 mb-1">VIP Recognition Status</label>
          <select
            value={vipTier}
            onChange={(e: any) => onVipTierChange(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200/80 rounded-lg text-zinc-900 font-bold focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink"
          >
            <option value="Standard">Standard Guest</option>
            <option value="VIP Diamond">VIP Diamond Tier</option>
            <option value="Executive Platinum">Executive Platinum</option>
          </select>
        </div>
      </div>
    </div>
  );
};