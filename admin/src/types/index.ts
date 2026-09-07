export type NavigationSectionKey = 'DAILY_OPERATIONS' | 'DOCUMENTS' | 'SYSTEM' | 'OPERATIONS' | 'BUSINESS' | 'MANAGEMENT';

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  badge?: string | number;
  badgeVariant?: 'neutral' | 'accent' | 'warning' | 'danger';
}

export interface NavigationSection {
  title: string;
  key: NavigationSectionKey;
  items: NavigationItem[];
}

export interface UserProfile {
  name: string;
  role: string;
  email?: string;
  avatarUrl: string;
  status: 'online' | 'busy' | 'away';
  hotelBranch: string;
  shift: string;
}

export interface RoomStatus {
  id: string;
  number: string;
  type: 'Deluxe King' | 'Executive Suite' | 'Ocean Villa' | 'Standard Twin' | 'Presidential Suite';
  floor: number;
  status: 'occupied' | 'vacant_clean' | 'vacant_dirty' | 'maintenance' | 'reserved';
  guestName?: string;
  checkOut?: string;
  ratePerNight: number;
  cleanliness: 'inspected' | 'cleaned' | 'dirty' | 'in_progress';
}

export interface Reservation {
  id: string;
  confirmationCode: string;
  guestName: string;
  guestEmail: string;
  roomNumber: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  status: 'Confirmed' | 'Checked In' | 'Checked Out' | 'Pending' | 'Canceled';
  totalAmount: number;
  paymentStatus: 'Paid' | 'Partial' | 'Pending';
  adults: number;
  children: number;
  vipTier?: 'Standard' | 'Silver' | 'Gold' | 'Diamond';
  specialRequests?: string;
}

export interface FrontDeskActivity {
  id: string;
  type: 'check_in' | 'check_out' | 'room_service' | 'key_card_issued' | 'folio_settled';
  guest: string;
  room: string;
  time: string;
  operator: string;
  status: 'completed' | 'in_progress' | 'pending';
}
