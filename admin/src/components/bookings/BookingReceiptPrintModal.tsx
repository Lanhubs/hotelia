import React from 'react';
import { BookingRecord } from '../../types/booking';
import { ReceiptHeader } from '../receipt/ReceiptHeader';
import { ReceiptRoomShowcase } from '../receipt/ReceiptRoomShowcase';
import { ReceiptFolioStatement } from '../receipt/ReceiptFolioStatement';
import { ReceiptSidebarInfo } from '../receipt/ReceiptSidebarInfo';

interface BookingReceiptPrintModalProps {
  booking: BookingRecord;
  displayCurrency: 'USD' | 'NGN';
  onClose: () => void;
  onPrint?: () => void;
}

export const BookingReceiptPrintModal: React.FC<BookingReceiptPrintModalProps> = ({
  booking,
  displayCurrency,
  onClose,
  onPrint,
}) => {
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const guestName = booking.guest?.name || '';
  const folioNumber = booking.folioNumber || booking.id || '';
  const confirmationNumber = `#${booking.id || ''}`;
  const dateIssued = booking.bookedAt || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const roomName = booking.room?.name || '';
  const roomNumber = booking.room?.roomNumber || '';
  const checkIn = booking.stay?.checkInDate || '';
  const checkOut = booking.stay?.checkOutDate || '';
  const nights = booking.stay?.nights || 1;
  
  const currency = displayCurrency || booking.financials?.currency || 'USD';
  const totalAmountVal = booking.financials?.totalAmount || 0;
  const roomTotalVal = booking.financials?.roomTotal || totalAmountVal;

  const formatAmount = (val: number) => {
    if (currency === 'NGN' || displayCurrency === 'NGN') {
      return `₦${(val * 1600).toLocaleString()}`;
    }
    return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const totalAmount = formatAmount(totalAmountVal);
  const baseRateFormatted = formatAmount(roomTotalVal);
  const paymentMethod = booking.financials?.paymentMethod || 'POS Terminal (Front Desk)';
  const roomImage = booking.room?.heroImage || '';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-[#faf8ff] text-[#131b2e] w-full max-w-5xl rounded-none shadow-2xl overflow-hidden border border-[#c5c6cd] max-h-[92vh] flex flex-col">
        {/* Modal Top Control Bar */}
        <div className="no-print bg-[#0e1c2f] text-white px-5 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-bold tracking-wide uppercase">Print Receipt Preview • {folioNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-none text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              Print Folio Receipt
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-none text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

        {/* Printable Receipt Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <ReceiptHeader
            folioNumber={folioNumber}
            confirmationNumber={confirmationNumber}
            dateIssued={dateIssued}
            guestName={guestName}
            onPrint={handlePrint}
            onTrackInBookings={onClose}
            onReturnToRooms={onClose}
          />

          <main className="max-w-[1280px] mx-auto px-6 py-6 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <section className="lg:col-span-8 space-y-6">
                <ReceiptRoomShowcase
                  roomImage={roomImage}
                  roomNumber={roomNumber}
                  roomName={roomName}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  nights={nights}
                />

                <ReceiptFolioStatement
                  nights={nights}
                  roomName={roomName}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  baseRateFormatted={baseRateFormatted}
                  totalAmount={totalAmount}
                  currency={currency}
                  paymentMethod={paymentMethod}
                  dateIssued={dateIssued}
                />
              </section>

              <ReceiptSidebarInfo folioNumber={folioNumber} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
