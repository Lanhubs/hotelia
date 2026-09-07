export interface BookingDetailBar {
  day: string;
  amount: number;
  label: string;
}

export interface RoomStatusItem {
  label: string;
  count: number;
  color: string;
}

export interface LatestBooking {
  id: string;
  name: string;
  avatar: string;
  checkIn: string;
  checkOut: string;
  roomDesc: string;
  channel: string;
  isOffline: boolean;
  amountUSD: number;
}

export interface CalendarDay {
  dateNum: string;
  dayName: string;
  type: 'booked' | 'available';
  bookingsCount?: number;
  bgClass?: string;
  avatars?: string[];
  remaining?: string;
}

export interface ChannelStats {
  bookingsCount: number;
  sharePct: number;
  grossRevenueUSD: number;
  avgBookingUSD: number;
  avgStayNights: number;
  otaCommissionUSD: number;
  netYieldUSD: number;
  netMarginPct: string;
  conversionRate?: string;
  walkInConversionRate?: string;
}

export interface KPIData {
  title: string;
  icon: 'occupancy' | 'travel' | 'catering';
  mainValue: string | number;
  mainUnit?: string;
  subtitle?: string;
  highlightText?: string;
  highlightIcon?: 'trending' | 'sparkles';
  stats: Array<{
    label: string;
    value: string | number;
    icon: 'bed' | 'x' | 'arrowUp' | 'check' | 'dollar' | 'checkAlt';
    iconColor?: string;
  }>;
  linkText: string;
  linkTo: string;
}

export interface InventoryItem {
  label: string;
  count: number;
  total: number;
  color: string;
}

export interface SubChannelData {
  channelType: string;
  channelIcon: 'store' | 'globe' | 'globeBlue';
  category: string;
  categoryClass: string;
  bookings: number;
  grossRevenue: number;
  avgTicket: number;
  commissionDrag: string;
  netMargin: string;
  isPositive: boolean;
}
