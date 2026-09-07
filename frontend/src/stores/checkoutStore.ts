import { create } from 'zustand'
import type { Booking, Extra, GuestInfo, PaymentInit, Room, SearchParams } from '../api/types'

interface CheckoutState {
  room: Room | null
  search: SearchParams | null
  extras: Extra[]
  guest: GuestInfo
  booking: Booking | null
  payment: PaymentInit | null
  setRoom: (room: Room | null) => void
  setSearch: (search: SearchParams | null) => void
  setExtras: (extras: Extra[]) => void
  setGuest: (guest: GuestInfo) => void
  setBooking: (booking: Booking | null) => void
  setPayment: (payment: PaymentInit | null) => void
  reset: () => void
}

const emptyGuest: GuestInfo = {
  fullName: '',
  email: '',
  phone: '',
  specialRequest: '',
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  room: null,
  search: null,
  extras: [],
  guest: emptyGuest,
  booking: null,
  payment: null,
  setRoom: (room) => set({ room }),
  setSearch: (search) => set({ search }),
  setExtras: (extras) => set({ extras }),
  setGuest: (guest) => set({ guest }),
  setBooking: (booking) => set({ booking }),
  setPayment: (payment) => set({ payment }),
  reset: () =>
    set({
      room: null,
      search: null,
      extras: [],
      guest: emptyGuest,
      booking: null,
      payment: null,
    }),
}))