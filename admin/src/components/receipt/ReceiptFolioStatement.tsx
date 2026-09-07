import React from 'react';
import { CheckCircle, LucideWallet, ReceiptText } from 'lucide-react';

interface ReceiptFolioStatementProps {
  nights: number;
  roomName: string;
  checkIn: string;
  checkOut: string;
  baseRateFormatted: string;
  totalAmount: string;
  currency: string;
  paymentMethod: string;
  dateIssued: string;
}

export const ReceiptFolioStatement: React.FC<ReceiptFolioStatementProps> = ({
  nights,
  roomName,
  checkIn,
  checkOut,
  baseRateFormatted,
  totalAmount,
  currency,
  paymentMethod,
  dateIssued,
}) => {
  return (
    <article className="bg-white border border-[#c5c6cd] rounded-none overflow-hidden">
      <div className="bg-[#f2f3ff] px-5 py-3 border-b border-[#c5c6cd] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#426086] text-[20px]"><ReceiptText /></span>
          <h2 className="text-lg font-serif font-medium text-[#131b2e]">Itemized Folio Statement</h2>
        </div>
        <span className="text-[11px] uppercase tracking-widest text-[#44474c] font-bold">Currency: {currency}</span>
      </div>

      {/* Table-like line items */}
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between py-2 border-b border-[#c5c6cd] border-dashed">
          <div className="pr-4">
            <div className="text-sm font-semibold text-[#131b2e]">{nights} Nights Stay Rate</div>
            <div className="text-xs text-[#44474c] pl-4 mt-0.5">
              {roomName} ({checkIn} – {checkOut})
            </div>
          </div>
          <div className="text-sm font-semibold text-[#131b2e] whitespace-nowrap">
            {baseRateFormatted}
          </div>
        </div>
        <div className="flex items-start justify-between py-2 border-b border-[#c5c6cd] border-dashed">
          <div className="pr-4">
            <div className="text-sm font-semibold text-[#131b2e]">Resort & Wellness Amenity Fee</div>
            <div className="text-xs text-[#44474c] pl-4 mt-0.5">
              Access to Private Pool, Thermal Suite & Valet Parking throughout stay
            </div>
          </div>
          <div className="text-sm font-semibold text-[#131b2e] whitespace-nowrap">
            Included
          </div>
        </div>
        <div className="flex items-start justify-between py-2 border-b border-[#c5c6cd] border-dashed">
          <div className="pr-4">
            <div className="text-sm font-semibold text-[#131b2e]">Local Tourism & Municipal Tax</div>
            <div className="text-xs text-[#44474c] pl-4 mt-0.5">
              Standard state accommodation assessment and coastal preservation surcharge (7.5%)
            </div>
          </div>
          <div className="text-sm font-semibold text-[#131b2e] whitespace-nowrap">
            Included
          </div>
        </div>
        {/* Grand Total Row */}
        <div className="flex items-baseline justify-between py-3 bg-[#f2f3ff] px-4 rounded-none border border-[#c5c6cd] my-2">
          <div>
            <span className="text-base font-serif font-semibold text-[#131b2e] block">Total Paid</span>
            <span className="text-[11px] uppercase tracking-widest text-[#426086] font-bold">Zero Balance Due at Arrival</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-[#131b2e]">{totalAmount}</span>
            <span className="block text-[11px] text-[#44474c] uppercase font-bold">{currency}</span>
          </div>
        </div>
      </div>

      {/* Payment Verification Audit Footer */}
      <div className="print-audit-qr-wrapper bg-[#f2f3ff] px-5 py-3 border-t border-[#c5c6cd] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-[#44474c]">
        <div>
          <span className="block text-[11px] uppercase tracking-wider text-[#426086] font-bold">Payment Method</span>
          <span className="text-xs font-semibold text-[#131b2e] flex items-center gap-1.5 mt-0.5">
            <span className="material-symbols-outlined text-[16px]"><LucideWallet /></span> {paymentMethod}
          </span>
        </div>
        <div>
          <span className="block text-[11px] uppercase tracking-wider text-[#426086] font-bold">Authorization ID</span>
          <span className="text-xs font-semibold text-[#131b2e] mt-0.5 block">TXN-98214-AA</span>
        </div>
        <div>
          <span className="block text-[11px] uppercase tracking-wider text-[#426086] font-bold">Processed Timestamp</span>
          <span className="text-xs text-[#131b2e] mt-0.5 block">{dateIssued}</span>
        </div>
        <div>
          <span className="block text-[11px] uppercase tracking-wider text-[#426086] font-bold">Billing State</span>
          <span className="inline-flex items-center gap-1 text-xs text-[#1e8e3e] font-semibold mt-0.5">
            <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              <CheckCircle />
            </span> Settled in Full
          </span>
        </div>
      </div>
    </article>
  );
};
