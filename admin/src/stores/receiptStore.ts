import { create } from 'zustand';

export interface ConfirmedReceiptData {
  id?: string;
  folioNumber?: string;
  confirmationNumber?: string;
  dateIssued?: string;
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
  vipTier?: string;
  roomName?: string;
  roomNumber?: string;
  checkIn?: string;
  checkOut?: string;
  nights?: number;
  paymentMethod?: string;
  currency?: string;
  totalAmount?: string;
  roomImage?: string;
  baseRateFormatted?: string;
  taxesFormatted?: string;
  addOnsFormatted?: string;
  [key: string]: any;
}

interface ReceiptStoreState {
  confirmedBooking: ConfirmedReceiptData | null;
  setConfirmedBooking: (data: ConfirmedReceiptData | null) => void;
  resetReceipt: () => void;
}

export const useReceiptStore = create<ReceiptStoreState>((set) => ({
  confirmedBooking: null,
  setConfirmedBooking: (data) => set({ confirmedBooking: data }),
  resetReceipt: () => set({ confirmedBooking: null }),
}));
