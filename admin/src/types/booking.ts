export type BookingChannel =
  | 'online_direct'
  | 'front_desk_walkin'
  | 'phone_concierge'
  | 'ota_booking_com'
  | 'ota_expedia'
  | 'ota_airbnb'
  | 'corporate_direct';

export type BookingChannelCategory = 'online' | 'offline';

export type BookingStatus =
  | 'Confirmed'
  | 'Checked In'
  | 'Checked Out'
  | 'Pending'
  | 'Cancelled'
  | 'No Show';

export type PaymentStatus = 'Paid' | 'Partial' | 'Pending' | 'Refunded';

export type PaymentMethod =
  | 'Credit Card (Stripe)'
  | 'Cash at Reception'
  | 'POS Terminal (Front Desk)'
  | 'Bank Wire Transfer'
  | 'Direct Corporate Bill'
  | 'OTA Virtual Card';

export type VIPTier = 'Standard' | 'Silver' | 'Gold' | 'Diamond' | 'Black Edition';

export interface BookingNote {
  id: string;
  author: string;
  role: string;
  text: string;
  timestamp: string;
}

export interface BookingAddon {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface BookingRecord {
  id: string; // e.g. "BK-9821"
  folioNumber: string; // e.g. "FOL-2026-9821"
  channel: BookingChannel;
  channelCategory: BookingChannelCategory;
  channelLabel: string;
  bookedAt: string; // ISO date or formatted string
  handledBy: string; // Receptionist name or System
  status: BookingStatus;
  
  guest: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
    vipTier: VIPTier;
    nationality: string;
    idType: string;
    idNumber: string;
    specialRequests?: string;
  };

  room: {
    id: string;
    name: string;
    category: string;
    roomNumber: string;
    floor: number;
    heroImage: string;
    tagline: string;
  };

  stay: {
    checkInDate: string; // YYYY-MM-DD
    checkInTime: string; // e.g. 14:00
    checkOutDate: string; // YYYY-MM-DD
    checkOutTime: string; // e.g. 11:00
    nights: number;
    adults: number;
    children: number;
  };

  financials: {
    ratePerNight: number;
    roomTotal: number;
    taxAmount: number;
    serviceFee: number;
    addonsTotal: number;
    discountAmount: number;
    totalAmount: number;
    amountPaid: number;
    balanceDue: number;
    currency: 'USD' | 'NGN';
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    transactionRef: string;
  };

  keycard: {
    status: 'Not Issued' | 'Active' | 'Returned' | 'Expired';
    cardUid?: string;
    issuedAt?: string;
    issuedBy?: string;
  };

  addons: BookingAddon[];
  notes: BookingNote[];
}

export interface BookingFilters {
  searchQuery: string;
  channelCategory: 'all' | 'online' | 'offline';
  channelSpecific: 'all' | BookingChannel;
  status: 'all' | BookingStatus;
  timeframe: 'all' | 'today_arrivals' | 'currently_in_house' | 'upcoming' | 'checked_out';
  sortBy: 'latest_booked' | 'check_in_asc' | 'check_in_desc' | 'amount_desc' | 'guest_name';
}
