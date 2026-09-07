import { create } from 'zustand';

export type ViewMode = 'table' | 'cards' | 'inhouse';

interface BookingsHubState {
  viewMode: ViewMode;
  isWalkInModalOpen: boolean;
  toastMsg: string | null;
  
  setViewMode: (mode: ViewMode) => void;
  setIsWalkInModalOpen: (open: boolean) => void;
  setToastMsg: (msg: string | null) => void;
  clearToast: () => void;
}

export const useBookingsHubStore = create<BookingsHubState>((set) => ({
  viewMode: 'table',
  isWalkInModalOpen: false,
  toastMsg: null,
  
  setViewMode: (mode) => set({ viewMode: mode }),
  setIsWalkInModalOpen: (open) => set({ isWalkInModalOpen: open }),
  setToastMsg: (msg) => set({ toastMsg: msg }),
  clearToast: () => set({ toastMsg: null }),
}));