import React from 'react';
import { Mail, MapPin, Phone, QrCode } from 'lucide-react';

interface ReceiptSidebarInfoProps {
  folioNumber: string;
}

export const ReceiptSidebarInfo: React.FC<ReceiptSidebarInfoProps> = ({ folioNumber }) => {
  return (
    <aside className="lg:col-span-4 space-y-6 sticky top-28">
      {/* Digital Check-In Pass */}
      <div className="bg-white border border-[#c5c6cd] rounded-none overflow-hidden">
        <div className="bg-[#0e1c2f] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]"><QrCode /></span>
            <span className="text-xs font-bold tracking-wide uppercase">Express Arrival Pass</span>
          </div>
          <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded-none text-white tracking-widest">DIGITAL KEY</span>
        </div>
        <div className="p-5 text-center space-y-4">
          <div>
            <span className="block text-[11px] uppercase tracking-widest text-[#44474c]">Folio Access Code</span>
            <span className="text-base font-bold text-[#131b2e] font-mono">{folioNumber}</span>
          </div>
          {/* QR Code Container Graphic */}
          <div className="bg-[#f2f3ff] p-4 rounded-none border border-[#c5c6cd] inline-block mx-auto">
            <svg className="w-36 h-36 mx-auto" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <rect fill="#f2f3ff" height="100" rx="0" width="100"></rect>
              <rect fill="#0e1c2f" height="26" width="26" x="8" y="8"></rect>
              <rect fill="#ffffff" height="16" width="16" x="13" y="13"></rect>
              <rect fill="#0e1c2f" height="8" width="8" x="17" y="17"></rect>
              <rect fill="#0e1c2f" height="26" width="26" x="66" y="8"></rect>
              <rect fill="#ffffff" height="16" width="16" x="71" y="13"></rect>
              <rect fill="#0e1c2f" height="8" width="8" x="75" y="17"></rect>
              <rect fill="#0e1c2f" height="26" width="26" x="8" y="66"></rect>
              <rect fill="#ffffff" height="16" width="16" x="13" y="71"></rect>
              <rect fill="#0e1c2f" height="8" width="8" x="17" y="75"></rect>
              <rect fill="#0e1c2f" height="6" width="6" x="40" y="12"></rect>
              <rect fill="#0e1c2f" height="6" width="6" x="50" y="12"></rect>
              <rect fill="#0e1c2f" height="6" width="6" x="40" y="24"></rect>
              <rect fill="#0e1c2f" height="6" width="10" x="50" y="32"></rect>
              <rect fill="#0e1c2f" height="8" width="8" x="12" y="44"></rect>
              <rect fill="#0e1c2f" height="6" width="6" x="24" y="44"></rect>
              <rect fill="#0e1c2f" height="6" width="10" x="36" y="44"></rect>
              <rect fill="#0e1c2f" height="12" width="6" x="52" y="44"></rect>
              <rect fill="#0e1c2f" height="8" width="8" x="64" y="44"></rect>
              <rect fill="#0e1c2f" height="6" width="10" x="78" y="44"></rect>
              <rect fill="#0e1c2f" height="8" width="8" x="40" y="60"></rect>
              <rect fill="#0e1c2f" height="8" width="8" x="54" y="62"></rect>
              <rect fill="#0e1c2f" height="14" width="6" x="68" y="58"></rect>
              <rect fill="#0e1c2f" height="8" width="8" x="80" y="58"></rect>
              <rect fill="#0e1c2f" height="6" width="12" x="40" y="76"></rect>
              <rect fill="#0e1c2f" height="12" width="6" x="58" y="76"></rect>
              <rect fill="#0e1c2f" height="6" width="18" x="70" y="78"></rect>
              <rect fill="#0e1c2f" height="6" width="8" x="44" y="86"></rect>
              <rect fill="#0e1c2f" height="6" width="8" x="80" y="88"></rect>
            </svg>
          </div>
          <p className="text-xs text-[#44474c]">
            Present this pass at any lobby kiosk or with our valet to bypass the front desk and transmit your digital room key straight to your mobile device.
          </p>
        </div>
      </div>

      {/* Dedicated Concierge Contact Card */}
      <div className="bg-white border border-[#c5c6cd] p-5 rounded-none space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#e2e7ff] flex items-center justify-center text-[#0e1c2f]">
            <span className="material-symbols-outlined text-[20px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-towel-rack"><path d="M22 7h-2" /><path d="M6.5 3h11A2.5 2.5 0 0 1 20 5.5V20a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1V5.5a1 1 0 0 0-5 0V17a1 1 0 0 0 1 1h4" /><path d="M9 7H2" /></svg>
            </span>
          </div>
          <div>
            <span className="block text-[11px] uppercase tracking-widest text-[#426086] font-bold">24/7 Service</span>
            <h3 className="text-base font-serif text-[#131b2e]">Private Concierge</h3>
          </div>
        </div>
        <p className="text-xs text-[#44474c]">
          Coordinate private ocean transport, reserve chef-table seatings at The Inkstone Dining Room, or request room personalization prior to arrival.
        </p>
        <div className="space-y-2 pt-2 border-t border-[#c5c6cd] text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#44474c] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]"><Phone /></span> Telephone
            </span>
            <span className="font-semibold text-[#131b2e]">+1 (800) 582-4190</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#44474c] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]"><Mail /></span> Private Desk
            </span>
            <span className="font-semibold text-[#131b2e]">desk@inkstonehotel.com</span>
          </div>
        </div>
      </div>

      {/* Hotel Location Card */}
      <div className="bg-white border border-[#c5c6cd] p-5 rounded-none space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-[#131b2e] uppercase tracking-wider">Property Location</h4>
          <span className="material-symbols-outlined text-[#426086] text-[18px]"><MapPin /></span>
        </div>
        <p className="text-[#44474c]">
          The Inkstone Hotel & Suites<br />
          420 Pelican Point Way, North Enclave<br />
          Newport, RI 02840, United States
        </p>
      </div>
    </aside>
  );
};
