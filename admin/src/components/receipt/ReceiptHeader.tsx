import React from 'react';
import { Printer } from 'lucide-react';
import keoLogo from '../../assets/keo-logo.png';

interface ReceiptHeaderProps {
  folioNumber: string;
  confirmationNumber: string;
  dateIssued: string;
  guestName: string;
  onPrint: () => void;
  onTrackInBookings: () => void;
  onReturnToRooms: () => void;
}

export const ReceiptHeader: React.FC<ReceiptHeaderProps> = ({
  folioNumber,
  confirmationNumber,
  dateIssued,
  guestName,
  onPrint,
  onTrackInBookings,
  onReturnToRooms,
}) => {
  return (
    <>
      {/* Top Action Toolbar (Hidden during print) */}
      <div className="no-print bg-white border-b border-[#c5c6cd] px-6 py-3 flex items-center justify-between shadow-xs sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-none">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            Booking Confirmed & Checked In
          </span>
          <span className="text-xs text-[#44474c] font-medium">
            Folio: <strong className="text-[#131b2e]">{folioNumber}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrint}
            className="flex items-center gap-2 px-4 py-2 bg-[#0e1c2f] text-white text-xs font-bold rounded-none hover:bg-black transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]"><Printer /></span>
            Print Folio Receipt
          </button>
          <button
            type="button"
            onClick={onTrackInBookings}
            className="px-4 py-2 border border-[#c5c6cd] text-[#131b2e] text-xs font-semibold rounded-none hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            Track in Bookings Hub
          </button>
          <button
            type="button"
            onClick={onReturnToRooms}
            className="px-4 py-2 bg-zinc-200 text-[#131b2e] text-xs font-semibold rounded-none hover:bg-zinc-300 transition-colors cursor-pointer"
          >
            Return to Accommodations
          </button>
        </div>
      </div>

      {/* Hero / Folio Status Banner */}
      <div className="receipt-hero-banner mb-8 bg-white border border-[#c5c6cd] p-6 rounded-none flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3 flex-wrap">
            <img src={keoLogo} alt="KEO Hotel" className="h-7 w-auto object-contain brightness-0 mr-2" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-none bg-[#e2e7ff] text-[#131b2e] text-xs font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1e8e3e]"></span>
              Payment Successful
            </span>
            <span className="text-[#44474c] text-xs">Issued: {dateIssued}</span>
            <span className="text-[#c5c6cd]">•</span>
            <span className="text-[#44474c] text-xs">Folio: <strong className="text-[#131b2e] font-semibold">{folioNumber}</strong></span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-medium text-[#131b2e]">Reservation Receipt & Guest Folio</h1>
          <p className="text-sm text-[#44474c]">
            Confirmed registration for guest <span className="font-semibold text-[#131b2e]">{guestName}</span>. Thank you for choosing The Inkstone Hotel & Suites.
          </p>
        </div>
        <div className="text-left md:text-right border-t md:border-t-0 pt-3 md:pt-0 border-[#c5c6cd]">
          <span className="block text-[11px] text-[#44474c] uppercase tracking-widest font-bold">Confirmation Number</span>
          <span className="text-xl font-serif font-semibold text-[#131b2e] tracking-tight">{confirmationNumber}</span>
          <span className="block text-xs text-[#426086]">Verified Secured Transaction</span>
        </div>
      </div>
    </>
  );
};
