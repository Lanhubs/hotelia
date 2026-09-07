export interface Booking {
  id: string
  reference: string
  folioNumber: string
  channel: string
  channelCategory: string
  channelLabel: string
  status: string
  guestName: string
  guestEmail: string
  guestPhone: string
  guestAvatar: string
  vipTier: string
  nationality: string | null
  idType: string | null
  idNumber: string | null
  specialRequests: string | null
  roomId: string | null
  roomName: string
  roomSlug: string
  roomCategory: string
  roomNumber: string | null
  floor: number | null
  heroImage: string | null
  tagline: string | null
  checkInDate: string
  checkInTime: string
  checkOutDate: string
  checkOutTime: string
  nights: number
  adults: number
  children: number
  ratePerNight: number
  roomTotal: number
  taxAmount: number
  serviceFee: number
  addonsTotal: number
  discountAmount: number
  totalAmount: number
  amountPaid: number
  balanceDue: number
  currency: string
  paymentStatus: string
  paymentMethod: string | null
  transactionRef: string | null
  bookedAt: string
  handledBy: string | null
  keycardStatus: string
  cardUid: string | null
  issuedAt: string | null
  issuedBy: string | null
  paidAt: string | null
  cancelledAt: string | null
  createdAt: string
  updatedAt: string
}

export interface BookingFilters {
  searchQuery: string
  channelCategory: 'all' | 'online' | 'offline'
  channelSpecific: 'all' | string
  status: 'all' | string
  timeframe: 'all' | string
  sortBy: string
}