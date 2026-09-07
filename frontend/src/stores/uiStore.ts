import { create } from 'zustand'

interface LightboxState {
  open: boolean
  images: string[]
  index: number
}

interface UiState {
  mobileNavOpen: boolean
  lightbox: LightboxState
  setMobileNav: (open: boolean) => void
  openLightbox: (images: string[], index: number) => void
  closeLightbox: () => void
  stepLightbox: (direction: 1 | -1) => void
}

export const useUiStore = create<UiState>((set) => ({
  mobileNavOpen: false,
  lightbox: { open: false, images: [], index: 0 },
  setMobileNav: (open) => set({ mobileNavOpen: open }),
  openLightbox: (images, index) =>
    set({ lightbox: { open: true, images, index } }),
  closeLightbox: () =>
    set((state) => ({ lightbox: { ...state.lightbox, open: false } })),
  stepLightbox: (direction) =>
    set((state) => {
      const { images, index } = state.lightbox
      const next = (index + direction + images.length) % Math.max(1, images.length)
      return { lightbox: { ...state.lightbox, index: next } }
    }),
}))