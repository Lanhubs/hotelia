import React, { useState } from 'react';
import { X, Check, Calendar, User, BedDouble } from 'lucide-react';

interface QuickBookingModalProps {
  onClose: () => void;
}

export const QuickBookingModal: React.FC<QuickBookingModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    roomType: 'Deluxe King',
    checkIn: '2026-08-18',
    checkOut: '2026-08-22',
    adults: 2,
    children: 0,
    vipTier: 'Standard',
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div
      id="quick-booking-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-2">
            <BedDouble className="w-5 h-5 text-amber-500" />
            <h2 className="text-sm font-semibold text-zinc-100">Create New Reservation</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {isSuccess ? (
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-3">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-zinc-100">Reservation Confirmed</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Folio generated for {formData.guestName || 'Guest'}. Notification sent to Front Desk.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 font-medium mb-1.5">Guest Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marcus Vance"
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-zinc-400 font-medium mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="m.vance@example.com"
                  value={formData.guestEmail}
                  onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 font-medium mb-1.5">Room Category</label>
                <select
                  value={formData.roomType}
                  onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="Deluxe King">Deluxe King ($240/nt)</option>
                  <option value="Executive Suite">Executive Suite ($420/nt)</option>
                  <option value="Ocean Villa">Ocean Villa ($650/nt)</option>
                  <option value="Standard Twin">Standard Twin ($180/nt)</option>
                  <option value="Presidential Suite">Presidential Suite ($1,200/nt)</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1.5">VIP Loyalty Tier</label>
                <select
                  value={formData.vipTier}
                  onChange={(e) => setFormData({ ...formData, vipTier: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="Standard">Standard Guest</option>
                  <option value="Silver">Silver Tier</option>
                  <option value="Gold">Gold Elite</option>
                  <option value="Diamond">Diamond VIP</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 font-medium mb-1.5">Check-in</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="date"
                    value={formData.checkIn}
                    onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-zinc-400 font-medium mb-1.5">Check-out</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="date"
                    value={formData.checkOut}
                    onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-zinc-400 hover:text-zinc-200 bg-zinc-800/80 hover:bg-zinc-800 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-md shadow-sm transition-colors"
              >
                Confirm & Create Folio
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
