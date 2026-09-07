import React, { useState } from 'react';
import { X, CheckCircle2, Globe, Store, Printer } from 'lucide-react';
import { BookingRecord, BookingStatus } from '../../types/booking';
import { useBookingStore } from '../../stores/bookingStore';
import { DrawerOverviewTab } from './drawer/DrawerOverviewTab';
import { DrawerFolioTab } from './drawer/DrawerFolioTab';
import { DrawerKeycardTab } from './drawer/DrawerKeycardTab';
import { DrawerNotesTab } from './drawer/DrawerNotesTab';
import { BookingReceiptPrintModal } from './BookingReceiptPrintModal';

interface BookingDetailDrawerProps {
  booking: BookingRecord;
  onClose: () => void;
  displayCurrency: 'USD' | 'NGN';
}

export const BookingDetailDrawer: React.FC<BookingDetailDrawerProps> = ({
  booking,
  onClose,
  displayCurrency,
}) => {
  const { updateBookingStatus, recordPayment, issueKeycard, addBookingNote, cancelBooking } = useBookingStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'folio' | 'notes' | 'keycard'>('overview');
  const [newNoteText, setNewNoteText] = useState('');
  const [authorName] = useState('Elena Rostova');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(booking.financials.balanceDue);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [isEncodingKey, setIsEncodingKey] = useState(false);

  const formatMoney = (amountUSD: number) => {
    if (displayCurrency === 'NGN') {
      return `₦${(amountUSD * 1600).toLocaleString()}`;
    }
    return `$${amountUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleStatusChange = (newStatus: BookingStatus) => {
    updateBookingStatus(booking.id, newStatus);
    setActionSuccessMsg(`Status updated to "${newStatus}"!`);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const handleIssueKey = () => {
    setIsEncodingKey(true);
    setTimeout(() => {
      setIsEncodingKey(false);
      const randomUid = `RFID-K${booking.room.roomNumber}-${Math.floor(1000 + Math.random() * 9000)}`;
      issueKeycard(booking.id, randomUid, 'Elena Rostova (Front Desk)');
      setActionSuccessMsg(`Digital Keycard [${randomUid}] programmed & active for Room #${booking.room.roomNumber}!`);
      setTimeout(() => setActionSuccessMsg(null), 4000);
    }, 600);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addBookingNote(booking.id, newNoteText.trim(), authorName, 'Front Desk Operations');
    setNewNoteText('');
    setActionSuccessMsg('Staff log note appended to folio!');
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const handleSettlePayment = () => {
    if (paymentAmount <= 0) return;
    recordPayment(booking.id, paymentAmount, paymentAmount >= booking.financials.balanceDue ? 'Paid' : 'Partial');
    setShowPaymentModal(false);
    setActionSuccessMsg(`Payment of ${formatMoney(paymentAmount)} recorded successfully!`);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-zinc-200 overflow-hidden animate-in slide-in-from-right duration-300">
        <div className="p-5 border-b border-zinc-200/80 bg-zinc-50/70 flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-zinc-200/80 text-zinc-800">
                {booking.folioNumber}
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${booking.channelCategory === 'offline' ? 'bg-orange-100 text-orange-800 border border-orange-200' : 'bg-blue-100 text-blue-800 border border-blue-200'}`}>
                {booking.channelCategory === 'offline' ? <Store className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                <span>{booking.channelLabel}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                <span>{booking.status}</span>
              </span>
            </div>
            <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Reservation Details • {booking.guest.name}</h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowReceiptModal(true)}
              title="Print Receipt"
              className="p-2 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-600 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-zinc-200/80 text-zinc-400 hover:text-zinc-800 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {actionSuccessMsg && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2.5 text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        <div className="flex items-center px-5 border-b border-zinc-200 bg-white gap-2 shrink-0">
          <button onClick={() => setActiveTab('overview')} className={`py-3 px-3 text-xs font-bold border-b-2 cursor-pointer ${activeTab === 'overview' ? 'border-ink text-ink' : 'border-transparent text-zinc-500'}`}>Overview</button>
          <button onClick={() => setActiveTab('folio')} className={`py-3 px-3 text-xs font-bold border-b-2 cursor-pointer ${activeTab === 'folio' ? 'border-ink text-ink' : 'border-transparent text-zinc-500'}`}>Billing & Folio</button>
          <button onClick={() => setActiveTab('keycard')} className={`py-3 px-3 text-xs font-bold border-b-2 cursor-pointer ${activeTab === 'keycard' ? 'border-ink text-ink' : 'border-transparent text-zinc-500'}`}>Keycard ({booking.keycard.status})</button>
          <button onClick={() => setActiveTab('notes')} className={`py-3 px-3 text-xs font-bold border-b-2 cursor-pointer ${activeTab === 'notes' ? 'border-ink text-ink' : 'border-transparent text-zinc-500'}`}>Staff Notes ({booking.notes.length})</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar bg-white">
          {activeTab === 'overview' && <DrawerOverviewTab booking={booking} formatMoney={formatMoney} />}
          {activeTab === 'folio' && <DrawerFolioTab booking={booking} formatMoney={formatMoney} onOpenPaymentModal={() => setShowPaymentModal(true)} />}
          {activeTab === 'keycard' && <DrawerKeycardTab booking={booking} isEncodingKey={isEncodingKey} onIssueKey={handleIssueKey} />}
          {activeTab === 'notes' && (
            <DrawerNotesTab
              notes={booking.notes}
              newNoteText={newNoteText}
              onNoteTextChange={setNewNoteText}
              authorName={authorName}
              onAddNoteSubmit={handleAddNote}
            />
          )}
        </div>

        <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {booking.status === 'Confirmed' && (
              <button onClick={() => handleStatusChange('Checked In')} className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer">
                Perform Check-In
              </button>
            )}
            {booking.status === 'Checked In' && (
              <button onClick={() => handleStatusChange('Checked Out')} className="px-4 py-2.5 rounded-xl bg-zinc-800 text-white text-xs font-bold cursor-pointer">
                Perform Check-Out
              </button>
            )}
            {booking.status !== 'Cancelled' && (
              <button onClick={() => cancelBooking(booking.id, 'Cancelled at desk')} className="px-3 py-2 text-zinc-500 hover:text-red-600 text-xs font-semibold cursor-pointer">
                Cancel Booking
              </button>
            )}
          </div>
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border bg-white text-xs font-bold cursor-pointer">
            Close
          </button>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-zinc-200 space-y-4">
            <h3 className="text-base font-bold text-zinc-900">Record Payment</h3>
            <p className="text-xs text-zinc-500">Balance: <strong className="text-zinc-900">{formatMoney(booking.financials.balanceDue)}</strong></p>
            <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(Number(e.target.value))} className="w-full p-2 text-xs bg-zinc-50 border rounded-lg" />
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowPaymentModal(false)} className="px-3 py-1.5 text-xs text-zinc-600 font-semibold">Cancel</button>
              <button onClick={handleSettlePayment} className="px-4 py-2 bg-ink text-white text-xs font-bold rounded-xl">Confirm Payment</button>
            </div>
          </div>
        </div>
      )}

      {showReceiptModal && (
        <BookingReceiptPrintModal
          booking={booking}
          displayCurrency={displayCurrency}
          onClose={() => setShowReceiptModal(false)}
          onPrint={() => window.print()}
        />
      )}
    </div>
  );
};
