import React, { useEffect } from 'react';
import { ShieldQuestionMarkIcon } from 'lucide-react';
import { useReceiptStore } from '../../stores/receiptStore';
import { ReceiptHeader } from '../receipt/ReceiptHeader';
import { ReceiptRoomShowcase } from '../receipt/ReceiptRoomShowcase';
import { ReceiptFolioStatement } from '../receipt/ReceiptFolioStatement';
import { ReceiptSidebarInfo } from '../receipt/ReceiptSidebarInfo';

interface WalkInConfirmationProps {
  confirmedBooking: any;
  onPrint: () => void;
  onTrackInBookings: () => void;
  onReturnToRooms: () => void;
}

export const WalkInConfirmation: React.FC<WalkInConfirmationProps> = ({
  confirmedBooking: initialBooking,
  onPrint,
  onTrackInBookings,
  onReturnToRooms,
}) => {
  const { confirmedBooking, setConfirmedBooking } = useReceiptStore();

  useEffect(() => {
    if (initialBooking) {
      setConfirmedBooking(initialBooking);
    }
  }, [initialBooking, setConfirmedBooking]);

  const booking = confirmedBooking || initialBooking;

  const guestName = booking?.guestName || '';
  const folioNumber = booking?.folioNumber || booking?.id || '';
  const confirmationNumber = booking?.confirmationNumber || `#${booking?.id || ''}`;
  const dateIssued = booking?.dateIssued || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const roomName = booking?.roomName || booking?.room?.name || '';
  const roomNumber = booking?.roomNumber || booking?.room?.roomNumber || '';
  const checkIn = booking?.checkIn || booking?.stay?.checkInDate || '';
  const checkOut = booking?.checkOut || booking?.stay?.checkOutDate || '';
  const nights = booking?.nights || booking?.stay?.nights || 1;
  const totalAmount = booking?.totalAmount || (booking?.financials?.totalAmount ? `$${booking.financials.totalAmount}` : '');
  const paymentMethod = booking?.paymentMethod || booking?.financials?.paymentMethod || 'POS Terminal (Front Desk)';
  const currency = booking?.currency || booking?.financials?.currency || 'USD';
  const roomImage = booking?.roomImage || booking?.room?.heroImage || '';
  const baseRateFormatted = booking?.baseRateFormatted || (booking?.financials?.roomTotal ? `$${booking.financials.roomTotal}` : totalAmount);

  return (
    <div className="w-full bg-[#faf8ff] text-[#131b2e] font-sans antialiased min-h-screen">
      <ReceiptHeader
        folioNumber={folioNumber}
        confirmationNumber={confirmationNumber}
        dateIssued={dateIssued}
        guestName={guestName}
        onPrint={onPrint}
        onTrackInBookings={onTrackInBookings}
        onReturnToRooms={onReturnToRooms}
      />

      {/* Main Receipt Content matching receipt.html exactly */}
      <main className="max-w-[1280px] mx-auto px-6 py-8 w-full">
        {/* Editorial Two-Column Architecture Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Main Ledger, Suite Specs & Financial Statement (8 Columns) */}
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

            {/* Terms of Stay & Folio Policy Ledger */}
            <article className="no-print bg-white border border-[#c5c6cd] p-5 rounded-none">
              <h3 className="text-base font-serif text-[#131b2e] mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#426086]"><ShieldQuestionMarkIcon /></span>
                Check-In Guidelines & Cancellation Terms
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#44474c] text-xs">
                <div>
                  <h4 className="text-xs font-bold text-[#131b2e] mb-1">Guarantee & Incidentals</h4>
                  <p>A valid government photo ID and matching credit card are required upon arrival. An incidental security hold of $100.00 USD per night will be pre-authorized and released upon key surrender.</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#131b2e] mb-1">Modification & Cancellation</h4>
                  <p>Complimentary cancellation or stay date amendments are permitted until 72 hours prior to arrival. Late cancellations incur a one-night room charge.</p>
                </div>
              </div>
            </article>
          </section>

          <ReceiptSidebarInfo folioNumber={folioNumber} />
        </div>
      </main>
    </div>
  );
};