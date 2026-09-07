import React from 'react';
import { X, Check } from 'lucide-react';

interface RoomAmenitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoomAmenitiesModal: React.FC<RoomAmenitiesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-zinc-200">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <h3 className="text-base font-bold text-zinc-900">All 24 Suite Amenities</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 cursor-pointer transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm text-zinc-700 py-1">
          <div className="flex items-center gap-2"><Check className="w-4 h-4 text-ink" /><span>Kitchen facilities</span></div>
          <div className="flex items-center gap-2"><Check className="w-4 h-4 text-ink" /><span>Gigabit Wifi</span></div>
          <div className="flex items-center gap-2"><Check className="w-4 h-4 text-ink" /><span>Dedicated workspace</span></div>
          <div className="flex items-center gap-2"><Check className="w-4 h-4 text-ink" /><span>75" 4K OLED TV</span></div>
          <div className="flex items-center gap-2"><Check className="w-4 h-4 text-ink" /><span>Infinity Pool access</span></div>
          <div className="flex items-center gap-2"><Check className="w-4 h-4 text-ink" /><span>EV Supercharger station</span></div>
          <div className="flex items-center gap-2"><Check className="w-4 h-4 text-ink" /><span>Private Elevator</span></div>
          <div className="flex items-center gap-2"><Check className="w-4 h-4 text-ink" /><span>Free parking on premises</span></div>
          <div className="flex items-center gap-2"><Check className="w-4 h-4 text-ink" /><span>24/7 Room Service</span></div>
          <div className="flex items-center gap-2"><Check className="w-4 h-4 text-ink" /><span>Private Game Space & PS5</span></div>
          <div className="flex items-center gap-2"><Check className="w-4 h-4 text-ink" /><span>Nespresso Coffee Machine</span></div>
          <div className="flex items-center gap-2"><Check className="w-4 h-4 text-ink" /><span>Soundproof Italian Glazing</span></div>
          <div className="flex items-center gap-2"><Check className="w-4 h-4 text-ink" /><span>Egyptian Cotton Linens</span></div>
          <div className="flex items-center gap-2"><Check className="w-4 h-4 text-ink" /><span>Dyson Hairdryer</span></div>
          <div className="flex items-center gap-2"><Check className="w-4 h-4 text-ink" /><span>Hydrotherapy Jacuzzi</span></div>
          <div className="flex items-center gap-2"><Check className="w-4 h-4 text-ink" /><span>Climate Control HVAC</span></div>
        </div>
      </div>
    </div>
  );
};
