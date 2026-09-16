import React, { useState } from 'react';
import { X, KeyRound, CreditCard, Banknote, Building, User, Phone, Mail,  Zap } from 'lucide-react';
import { AccommodationRoom } from '../../data/accommodationData';
import { WalkInModalConfirmation } from './WalkInModalConfirmation';

interface WalkInBookingModalProps {
  room: AccommodationRoom;
  checkInDate: string;
  checkOutDate: string;
  nightsCount: number;
  guestsCount: number;
  onClose: () => void;
  onSuccess: (bookingData: any) => void;
}

export const WalkInBookingModal: React.FC<WalkInBookingModalProps> = ({
  room, checkInDate, checkOutDate, nightsCount, onClose, onSuccess,
}) => {
  const [guestName, setGuestName] = useState('Alexander Vance');
  const [guestPhone, setGuestPhone] = useState('+234 803 456 7890');
  const [guestEmail, setGuestEmail] = useState('alexander.vance@corporate.ng');
  const [idPassport, setIdPassport] = useState('A09823412');
  const [selectedRoomNumber, setSelectedRoomNumber] = useState(room?.roomNumbers?.[0] || '401');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'transfer' | 'pos'>('card');
  const [currency, setCurrency] = useState<'USD' | 'NGN'>('NGN');
  const [vipTier, setVipTier] = useState<'Standard' | 'VIP Diamond' | 'Executive Platinum'>('VIP Diamond');
  const [specialNote, setSpecialNote] = useState('Walk-in VIP. Champagne on arrival.');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const basePriceUSD = room?.pricePerNight * nightsCount;
  const basePriceNGN = room?.priceNairaPerNight * nightsCount;
  const totalAmountNGN = basePriceNGN + Math.round(basePriceNGN * 0.075);
  const totalAmountUSD = basePriceUSD + Math.round(basePriceUSD * 0.075);

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setConfirmed(true);
      onSuccess({
        id: `WALK-${Math.floor(100000 + Math.random() * 900000)}`,
        roomName: room?.name, roomNumber: selectedRoomNumber, guestName, guestPhone, guestEmail,
        checkIn: checkInDate, checkOut: checkOutDate, nights: nightsCount,
        total: currency === 'NGN' ? `₦${totalAmountNGN.toLocaleString()}` : `$${totalAmountUSD.toLocaleString()}`,
        status: 'Checked In', vipTier,
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-zinc-200/80 custom-scrollbar">
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-[#EEF2FF] text-ink">Reception Walk-In Desk</span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> Instant Check-In Ready</span>
            </div>
            <h2 className="text-base font-bold text-zinc-900 mt-1">{confirmed ? 'Walk-In Booking Confirmed & Encoded' : `Book ${room?.name}`}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-400 cursor-pointer"><X className="w-4 h-4" /></button>
        </div>

        {!confirmed ? (
          <form onSubmit={handleConfirmBooking} className="p-5 space-y-5">
            <div className="p-3.5 rounded-lg border-zinc-200  bg-zinc-50 border flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={room?.heroImage} alt={room?.name} className="w-14 h-14 rounded-lg border-zinc-200  object-cover" />
                <div>
                  <h3 className="font-bold text-zinc-900 text-xs">{room?.name}</h3>
                  <p className="text-[11px] text-zinc-500">{room?.location}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-zinc-400">Total Rate ({nightsCount} Nights)</div>
                <div className="text-base font-extrabold text-zinc-900">{currency === 'NGN' ? `₦${totalAmountNGN.toLocaleString()}` : `$${totalAmountUSD.toLocaleString()}`}</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Walk-In Guest Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Full Guest Name</label>
                  <div className="relative"><User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" /><input type="text" required value={guestName} onChange={(e) => setGuestName(e.target.value)} className="w-full pl-9 pr-3 py-2 text-xs border rounded-lg border-zinc-200 " /></div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Phone Number</label>
                  <div className="relative"><Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" /><input type="text" required value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} className="w-full pl-9 pr-3 py-2 text-xs border rounded-lg border-zinc-200 " /></div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Email Address</label>
                  <div className="relative"><Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" /><input type="email" required value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} className="w-full pl-9 pr-3 py-2 text-xs border rounded-lg border-zinc-200 " /></div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">ID / Passport Number</label>
                  <input type="text" required value={idPassport} onChange={(e) => setIdPassport(e.target.value)} className="w-full px-3 py-2 text-xs border rounded-lg border-zinc-200 " />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-zinc-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Room Key</label>
                  <select value={selectedRoomNumber} onChange={(e) => setSelectedRoomNumber(e.target.value)} className="w-full px-3 py-2 text-xs border rounded-lg border-zinc-200 ">
                    {room?.roomNumbers?.map((num) => (<option key={num} value={num}>Suite #{num}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">VIP Tier</label>
                  <select value={vipTier} onChange={(e: any) => setVipTier(e.target.value)} className="w-full px-3 py-2 text-xs border rounded-lg border-zinc-200 ">
                    <option value="Standard">Standard</option>
                    <option value="VIP Diamond">VIP Diamond</option>
                    <option value="Executive Platinum">Executive Platinum</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Currency</label>
                  <div className="flex gap-1.5">
                    <button type="button" onClick={() => setCurrency('NGN')} className={`flex-1 py-1.5 text-xs rounded-lg border-zinc-200  font-bold ${currency === 'NGN' ? 'bg-ink text-white' : 'bg-zinc-100'}`}>NGN</button>
                    <button type="button" onClick={() => setCurrency('USD')} className={`flex-1 py-1.5 text-xs rounded-lg border-zinc-200  font-bold ${currency === 'USD' ? 'bg-ink text-white' : 'bg-zinc-100'}`}>USD</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-zinc-200">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Payment Method</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'card', label: 'Credit Card', icon: CreditCard },
                  { id: 'pos', label: 'POS Terminal', icon: CreditCard },
                  { id: 'transfer', label: 'Bank Transfer', icon: Building },
                  { id: 'cash', label: 'Cash', icon: Banknote },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button key={item.id} type="button" onClick={() => setPaymentMethod(item.id as any)} className={`p-2.5 rounded-lg border-zinc-200  border text-left flex flex-col cursor-pointer ${paymentMethod === item.id ? 'border-ink bg-[#EEF2FF] text-ink font-bold' : 'border-zinc-200 bg-white'}`}>
                      <Icon className="w-4 h-4 mb-1" />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Reception Notes</label>
              <textarea rows={2} value={specialNote} onChange={(e) => setSpecialNote(e.target.value)} className="w-full px-3 py-2 text-xs border rounded-lg border-zinc-200 " />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-200">
              <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg border-zinc-200  text-xs font-semibold">Cancel</button>
              <button type="submit" disabled={isProcessing} className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg border-zinc-200  bg-ink text-white text-xs font-bold">
                <KeyRound className="w-3.5 h-3.5" />
                <span>{isProcessing ? 'Encoding...' : 'Complete Walk-In'}</span>
              </button>
            </div>
          </form>
        ) : (
          <WalkInModalConfirmation
            room={room} selectedRoomNumber={selectedRoomNumber} guestName={guestName} vipTier={vipTier}
            checkInDate={checkInDate} checkOutDate={checkOutDate} nightsCount={nightsCount} currency={currency}
            totalAmountNGN={totalAmountNGN} totalAmountUSD={totalAmountUSD} onClose={onClose}
          />
        )}
      </div>
    </div>
  );
};
