import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { addDaysISO, todayISO } from '../lib/dates'
import type { SearchParams } from '../api/types'

interface BookingState {
  search: SearchParams
  setSearch: (search: Partial<SearchParams>) => void
  clearSearch: () => void
}

const initialSearch = (): SearchParams => ({
  checkIn: addDaysISO(todayISO(), 7),
  checkOut: addDaysISO(todayISO(), 9),
  adults: 2,
  children: 0,
  rooms: 1,
})

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      search: initialSearch(),
      setSearch: (search) =>
        set((state) => ({ search: { ...state.search, ...search } })),
      clearSearch: () => set({ search: initialSearch() }),
    }),
    {
      name: 'keo-booking-search',
      partialize: (state) => ({ search: state.search }),
    },
  ),
)