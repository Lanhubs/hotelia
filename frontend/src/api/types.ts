export type RoomCategory =
  | 'Single Room'
  | 'Deluxe Room'
  | 'Deluxe Apartment'
  | 'Executive Deluxe Apartment'
  | 'Exclusive Deluxe Apartment'

export interface Amenity {
  id: string
  name: string
  icon: string
}

export type AmenityItem = string | Amenity

export interface Room {
  id: string
  slug: string
  name: string
  category: RoomCategory
  tagline: string
  description: string
  overview: string
  pricePerNight: number
  capacity: number
  bedType: string
  size: number
  floor: string
  units: number
  image: string
  gallery: string[]
  amenities: AmenityItem[]
  features: string[]
}

export interface SearchParams {
  checkIn: string
  checkOut: string
  adults: number
  children: number
  rooms: number
}

export interface AvailabilityItem {
  room: Room
  availableUnits: number
  pricePerNight: number
  nights: number
  total: number
  taxEstimate: number
}

export interface Service {
  id: string
  slug: string
  name: string
  category: string
  description: string
  image: string
  price?: number
  priceLabel?: string
  requestable: boolean
  available: boolean
}

export interface EventSpace {
  id: string
  slug: string
  name: string
  category: string
  description: string
  image: string
  gallery: string[]
  capacity: number | null
  layouts: string[]
  facilities: string[]
}

export interface Event {
  id: string
  slug: string
  title: string
  description: string | null
  eventType: string
  category: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  timezone: string
  recurrenceRule: string | null
  recurrenceEndDate: string | null
  recurrenceExceptions: string[]
  isRecurring: boolean
  venueName: string | null
  venueDescription: string | null
  maxCapacity: number | null
  hasTickets: boolean
  ticketTiers: TicketTier[]
  rsvpLimit: number | null
  bookingOpensAt: string | null
  bookingClosesAt: string | null
  requiresApproval: boolean
  heroImage: string | null
  gallery: string[]
  tags: string[]
  isFeatured: boolean
  isPublished: boolean
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
  contactEmail: string | null
  contactPhone: string | null
  externalRegistrationUrl: string | null
  createdAt: string
  updatedAt: string
  createdBy: string | null
}

export interface TicketTier {
  id: string
  name: string
  priceUSD: number
  priceNaira: number | null
  capacity: number | null
  description: string | null
}

export interface EventOccurrence extends Event {
  occurrenceDate: string
  isRecurrenceInstance: boolean
  availableCapacity: number
  bookedCount: number
}

export interface EventBooking {
  id: string
  eventId: string
  occurrenceDate: string | null
  guestName: string
  guestEmail: string
  guestPhone: string | null
  guestCount: number
  ticketTierId: string | null
  amountUSD: number
  amountNaira: number
  currency: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'waitlisted' | 'attended'
  paymentStatus: 'free' | 'pending' | 'paid' | 'refunded'
  paymentReference: string | null
  paymentMethod: string | null
  approvedBy: string | null
  checkedInAt: string | null
  checkedInBy: string | null
  specialRequests: string | null
  source: string
  createdAt: string
  updatedAt: string
}

export interface Extra {
  id: string
  slug: string
  name: string
  description: string
  price: number
  perNight: boolean
  icon: string
}

export interface GuestInfo {
  fullName: string
  email: string
  phone: string
  specialRequest: string
}

export type PaymentMethod = 'card' | 'transfer' | 'pay_at_hotel'

export type PaymentState = 'pending' | 'processing' | 'success' | 'failed' | 'cancelled' | 'pay_at_hotel'

export interface TransferInstructions {
  provider: string
  bankName: string
  accountName: string
  accountNumber: string
  reference: string
  amount: number
  expiresAt?: string
}

export interface Financials {
  nights: number
  roomTotal: number
  extrasTotal: number
  taxAmount: number
  totalAmount: number
  amountPaid: number
  balanceDue: number
  depositAmount: number
  currency: 'NGN'
}

export interface Booking {
  id: string
  reference: string
  guest: GuestInfo
  room: {
    id: string
    name: string
    slug: string
    category: RoomCategory
    image: string
  }
  stay: {
    checkIn: string
    checkOut: string
    nights: number
    adults: number
    children: number
    rooms: number
  }
  extras: Array<{ id: string; name: string; price: number; perNight: boolean }>
  financials: Financials
  status: 'Confirmed' | 'Pending' | 'Cancelled'
  paymentMethod: PaymentMethod | null
  paymentState: PaymentState
  depositPaid: boolean
  transferInstructions?: TransferInstructions
  paidAt?: string
  createdAt: string
}

export interface Contact {
  phone: string
  phoneDisplay: string
  email: string
  address: string
  city: string
  mapsQuery: string
}

export interface HotelPolicy {
  checkInTime: string
  checkOutTime: string
  cancellation: string
  payment: string
  children: string
  guests: string
  pets: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  text: string
}

export interface HotelConfig {
  contact: Contact
  policies: HotelPolicy
  nav: Array<{ label: string; to: string }>
  testimonials: Testimonial[]
  galleryCategories: string[]
  payment: { provider: string; depositRate: number }
}

export interface PaymentInit {
  reference: string
  gateway: string
  redirectUrl?: string
  authorizationUrl?: string
  accessCode?: string
  amount: number
  method: PaymentMethod
  transferInstructions?: TransferInstructions
}

export interface PaymentVerify {
  state: PaymentState
  reference: string
  amount: number
  paidAt?: string
}