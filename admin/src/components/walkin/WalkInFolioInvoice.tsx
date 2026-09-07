import React from 'react';
import { KeyRound } from 'lucide-react';
import { AccommodationRoom } from '../../data/accommodationData';

interface WalkInFolioInvoiceProps {
  room: AccommodationRoom;
  selectedRoomNumber: string;
  nightsCount: number;
  currency: 'USD' | 'NGN';
  baseRateUSD: number;
  baseRateNGN: number;
  addOnsUSD: number;
  addOnsNGN: number;
  serviceTaxUSD: number;
  serviceTaxNGN: number;
  totalPayableUSD: number;
  totalPayableNGN: number;
  includeAirportTransfer: boolean;
  includeLateCheckout: boolean;
  isProcessing: boolean;
}

export const WalkInFolioInvoice: React.FC<WalkInFolioInvoiceProps> = ({
  room,
  selectedRoomNumber,
  nightsCount,
  currency,
  baseRateUSD,
  baseRateNGN,
  addOnsUSD,
  addOnsNGN,
  serviceTaxUSD,
  serviceTaxNGN,
  totalPayableUSD,
  totalPayableNGN,
  includeAirportTransfer,
  includeLateCheckout,
  isProcessing,
}) => {
  return (
    <div className="lg:col-span-4 space-y-5 sticky top-20">
      {/* Room Summary Card */}
      <div className="bg-white rounded-xl overflow-hidden border border-zinc-200/80 shadow-md shadow-zinc-200/40">
        <div className="relative aspect-16/9 bg-zinc-950">
          <img
            src={room.heroImage}
            alt={room.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-ink text-white">
            {room.category}
          </div>
          <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-xs text-white">
            <div className="text-xs font-bold">{room.name}</div>
            <div className="text-[10px] text-zinc-300">Suite #{selectedRoomNumber}</div>
          </div>
        </div>

        {/* Folio Cost Breakdown */}
        <div className="p-4 space-y-3.5 text-xs">
          <h3 className="font-bold text-zinc-900 border-b border-zinc-100 pb-2">
            Folio Price Breakdown ({nightsCount} Nights)
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between text-zinc-600">
              <span>Base Suite Rate ({nightsCount} nights)</span>
              <span className="font-semibold text-zinc-900">
                {currency === 'NGN' ? `₦${baseRateNGN.toLocaleString()}` : `$${baseRateUSD.toLocaleString()}`}
              </span>
            </div>

            {(includeAirportTransfer || includeLateCheckout) && (
              <div className="flex justify-between text-zinc-600">
                <span>Add-ons & VIP Services</span>
                <span className="font-semibold text-zinc-900">
                  {currency === 'NGN' ? `₦${addOnsNGN.toLocaleString()}` : `$${addOnsUSD.toLocaleString()}`}
                </span>
              </div>
            )}

            <div className="flex justify-between text-zinc-600">
              <span>VAT & Hospitality Tax (7.5%)</span>
              <span className="font-semibold text-zinc-900">
                {currency === 'NGN' ? `₦${serviceTaxNGN.toLocaleString()}` : `$${serviceTaxUSD.toLocaleString()}`}
              </span>
            </div>
          </div>

          <div className="pt-2.5 border-t border-zinc-200 flex justify-between items-baseline">
            <div>
              <span className="text-xs text-zinc-500 font-semibold">Total Payable</span>
              <p className="text-[10px] text-emerald-600 font-bold">Instant Settlement</p>
            </div>
            <div className="text-xl font-black text-ink">
              {currency === 'NGN' ? `₦${totalPayableNGN.toLocaleString()}` : `$${totalPayableUSD.toLocaleString()}`}
            </div>
          </div>

          {/* Primary Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 px-4 rounded-lg bg-ink hover:bg-[#4338CA] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authorizing & Programming RFID...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Confirm & Issue Room Keycard</span>
              </>
            )}
          </button>

          <p className="text-[10px] text-center text-zinc-400 font-medium">
            Instant registration in Master Ledger & PMS database
          </p>
        </div>
      </div>
    </div>
  );
};