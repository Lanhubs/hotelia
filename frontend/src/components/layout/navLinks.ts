export interface NavLink {
  label: string
  to: string
}

export const PRIMARY_NAV: NavLink[] = [
  { label: 'Home', to: '/' },
  { label: 'Stay', to: '/rooms' },
  { label: 'Experience', to: '/experience' },
  { label: 'Events', to: '/events' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export const FOOTER_NAV: NavLink[] = [
  { label: 'Rooms', to: '/rooms' },
  { label: 'Availability', to: '/availability' },
  { label: 'Events', to: '/events' },
  { label: 'Services', to: '/services' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Reservation Lookup', to: '/reservation' },
]

export const INFO_NAV: NavLink[] = [
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Booking Policies', to: '/policies' },
  { label: 'Privacy', to: '/privacy' },
  { label: 'Terms', to: '/terms' },
]