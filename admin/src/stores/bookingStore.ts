import { create } from 'zustand';
import { BookingRecord, BookingFilters, BookingStatus, PaymentStatus } from '../types/booking';
import { INITIAL_BOOKINGS } from '../data/mockBookingsData';
import {
  notifyBookingCreated,
  notifyStatusUpdated,
  notifyPaymentRecorded,
  notifyKeycardIssued,
  notifyBookingCancelled,
} from './bookingStoreHelpers';

interface BookingStoreState {
  bookings: BookingRecord[];
  selectedBooking: BookingRecord | null;
  isDetailDrawerOpen: boolean;
  isCreateModalOpen: boolean;
  displayCurrency: 'USD' | 'NGN';
  filters: BookingFilters;

  setBookings: (bookings: BookingRecord[]) => void;
  setDisplayCurrency: (currency: 'USD' | 'NGN') => void;
  setSelectedBooking: (booking: BookingRecord | null) => void;
  openBookingDetails: (booking: BookingRecord) => void;
  closeBookingDetails: () => void;
  setCreateModalOpen: (open: boolean) => void;
  setFilters: (newFilters: Partial<BookingFilters>) => void;
  resetFilters: () => void;

  addBooking: (booking: BookingRecord) => void;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  recordPayment: (id: string, amount: number, paymentStatus: PaymentStatus) => void;
  issueKeycard: (id: string, cardUid: string, operator: string) => void;
  addBookingNote: (id: string, text: string, author: string, role: string) => void;
  cancelBooking: (id: string, reason?: string) => void;
}

const DEFAULT_FILTERS: BookingFilters = {
  searchQuery: '',
  channelCategory: 'all',
  channelSpecific: 'all',
  status: 'all',
  timeframe: 'all',
  sortBy: 'latest_booked',
};

export const useBookingStore = create<BookingStoreState>((set) => ({
  bookings: INITIAL_BOOKINGS,
  selectedBooking: null,
  isDetailDrawerOpen: false,
  isCreateModalOpen: false,
  displayCurrency: 'USD',
  filters: DEFAULT_FILTERS,

  setBookings: (bookings) => set({ bookings }),
  setDisplayCurrency: (currency) => set({ displayCurrency: currency }),
  setSelectedBooking: (booking) => set({ selectedBooking: booking }),
  openBookingDetails: (booking) => set({ selectedBooking: booking, isDetailDrawerOpen: true }),
  closeBookingDetails: () => set({ isDetailDrawerOpen: false, selectedBooking: null }),
  setCreateModalOpen: (open) => set({ isCreateModalOpen: open }),
  setFilters: (newFilters) => set((state) => ({ filters: { ...state.filters, ...newFilters } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  addBooking: (newBooking) => {
    set((state) => ({ bookings: [newBooking, ...state.bookings] }));
    notifyBookingCreated(newBooking);
  },

  updateBookingStatus: (id, newStatus) =>
    set((state) => {
      const updated = state.bookings.map((b) => {
        if (b.id === id) {
          const rec = { ...b, status: newStatus };
          if (newStatus === 'Checked Out' && b.keycard.status === 'Active') {
            rec.keycard = { ...b.keycard, status: 'Returned' };
          }
          return rec;
        }
        return b;
      });
      const target = updated.find((b) => b.id === id);
      if (target) notifyStatusUpdated(target, newStatus);
      return {
        bookings: updated,
        selectedBooking: state.selectedBooking?.id === id ? target || null : state.selectedBooking,
      };
    }),

  recordPayment: (id, amount, paymentStatus) =>
    set((state) => {
      const updated = state.bookings.map((b) => {
        if (b.id === id) {
          const newPaid = b.financials.amountPaid + amount;
          return {
            ...b,
            financials: {
              ...b.financials,
              amountPaid: newPaid,
              balanceDue: Math.max(0, b.financials.totalAmount - newPaid),
              paymentStatus,
            },
          };
        }
        return b;
      });
      const target = updated.find((b) => b.id === id);
      if (target) notifyPaymentRecorded(target, amount, paymentStatus);
      return {
        bookings: updated,
        selectedBooking: state.selectedBooking?.id === id ? target || null : state.selectedBooking,
      };
    }),

  issueKeycard: (id, cardUid, operator) =>
    set((state) => {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const updated = state.bookings.map((b) => {
        if (b.id === id) {
          return {
            ...b,
            keycard: { status: 'Active' as const, cardUid, issuedAt: `Today ${time}`, issuedBy: operator },
            status: b.status === 'Confirmed' ? ('Checked In' as const) : b.status,
          };
        }
        return b;
      });
      const target = updated.find((b) => b.id === id);
      if (target) notifyKeycardIssued(target, cardUid);
      return {
        bookings: updated,
        selectedBooking: state.selectedBooking?.id === id ? target || null : state.selectedBooking,
      };
    }),

  addBookingNote: (id, text, author, role) =>
    set((state) => {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const note = { id: `note-${Date.now()}`, author, role, text, timestamp: `Today ${time}` };
      const updated = state.bookings.map((b) => (b.id === id ? { ...b, notes: [note, ...b.notes] } : b));
      return {
        bookings: updated,
        selectedBooking: state.selectedBooking?.id === id ? updated.find((b) => b.id === id) || null : state.selectedBooking,
      };
    }),

  cancelBooking: (id, reason) =>
    set((state) => {
      const updated = state.bookings.map((b) => {
        if (b.id === id) {
          return {
            ...b,
            status: 'Cancelled' as const,
            keycard: { ...b.keycard, status: 'Expired' as const },
            notes: reason
              ? [{ id: `note-${Date.now()}`, author: 'Front Desk System', role: 'Audit Log', text: `Reason: ${reason}`, timestamp: new Date().toLocaleTimeString() }, ...b.notes]
              : b.notes,
          };
        }
        return b;
      });
      const target = updated.find((b) => b.id === id);
      if (target) notifyBookingCancelled(target, reason);
      return {
        bookings: updated,
        selectedBooking: state.selectedBooking?.id === id ? target || null : state.selectedBooking,
      };
    }),
}));
