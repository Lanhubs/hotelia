import {
  BookingDetailBar,
  RoomStatusItem,
  LatestBooking,
  CalendarDay,
  ChannelStats,
  KPIData,
  InventoryItem,
  SubChannelData,
} from './dashboardTypes';

export const BOOKING_BARS: BookingDetailBar[] = [
  { day: 'Sep 23', amount: 68000, label: '68k' },
  { day: 'Sep 24', amount: 50000, label: '50k' },
  { day: 'Sep 25', amount: 86000, label: '86k' },
  { day: 'Sep 26', amount: 58000, label: '58k' },
  { day: 'Sep 27', amount: 68000, label: '68k' },
  { day: 'Sep 28', amount: 34000, label: '34k' },
  { day: 'Sep 29', amount: 76000, label: '76k' },
];

export const ROOM_STATUS_ITEMS: RoomStatusItem[] = [
  { label: 'Vacant', count: 50, color: '#10B981' },
  { label: 'Occupied', count: 280, color: '#4F46E5' },
  { label: 'In-House Stay Overs', count: 60, color: '#8B5CF6' },
  { label: 'Walk-Ins', count: 40, color: '#F59E0B' },
  { label: 'Under Maintenance', count: 12, color: '#6B7280' },
  { label: 'Out of Order', count: 8, color: '#EF4444' },
  { label: 'Cleaning', count: 120, color: '#F97316' },
];

export const LATEST_BOOKINGS: LatestBooking[] = [
  { id: 'BK-9825', name: 'Alexander Hayes', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120', checkIn: '18/08', checkOut: '22/08', roomDesc: 'Presidential Suite #301', channel: 'Front Desk Walk-In', isOffline: true, amountUSD: 4800 },
  { id: 'BK-9824', name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120', checkIn: '18/08', checkOut: '21/08', roomDesc: 'Ocean Villa #104', channel: 'Direct Web Portal', isOffline: false, amountUSD: 3600 },
  { id: 'BK-9823', name: 'Sir Arthur Stirling', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120', checkIn: '19/08', checkOut: '24/08', roomDesc: 'Executive Penthouse #303', channel: 'Front Desk Walk-In', isOffline: true, amountUSD: 6200 },
  { id: 'BK-9822', name: 'Sophia Loren', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120&h=120', checkIn: '19/08', checkOut: '22/08', roomDesc: 'Deluxe King Suite #201', channel: 'Booking.com OTA', isOffline: false, amountUSD: 1950 },
];

export const CALENDAR_DAYS: CalendarDay[] = [
  { dateNum: '23', dayName: 'Mon', type: 'booked', bookingsCount: 8, bgClass: 'bg-[#EFF6FF] text-[#1E40AF] border border-[#DBEAFE]', avatars: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=60&h=60', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=60&h=60'], remaining: '+5' },
  { dateNum: '24', dayName: 'Tue', type: 'booked', bookingsCount: 9, bgClass: 'bg-[#ECFDF5] text-[#065F46] border border-[#D1FAE5]', avatars: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=60&h=60'], remaining: '+6' },
  { dateNum: '25', dayName: 'Wed', type: 'available' },
  { dateNum: '26', dayName: 'Thu', type: 'booked', bookingsCount: 12, bgClass: 'bg-[#FEFCE8] text-[#854D0E] border border-[#FEF08A]', avatars: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=60&h=60'], remaining: '+9' },
  { dateNum: '27', dayName: 'Fri', type: 'booked', bookingsCount: 17, bgClass: 'bg-[#FFF7ED] text-[#9A3412] border border-[#FFEDD5]', avatars: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=60&h=60'], remaining: '+14' },
  { dateNum: '28', dayName: 'Sat', type: 'available' },
  { dateNum: '29', dayName: 'Sun', type: 'booked', bookingsCount: 20, bgClass: 'bg-[#FFF1F2] text-[#9F1239] border border-[#FFE4E6]', avatars: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=60&h=60'], remaining: '+17' },
];

export const ONLINE_STATS: ChannelStats = {
  bookingsCount: 182, sharePct: 65, grossRevenueUSD: 148600, avgBookingUSD: 816, avgStayNights: 3.4, otaCommissionUSD: 14200, netYieldUSD: 134400, netMarginPct: '90.4%', conversionRate: '3.8%',
};

export const OFFLINE_STATS: ChannelStats = {
  bookingsCount: 98, sharePct: 35, grossRevenueUSD: 114500, avgBookingUSD: 1168, avgStayNights: 2.1, otaCommissionUSD: 0, netYieldUSD: 114500, netMarginPct: '100%', walkInConversionRate: '94.2%',
};

export const KPI_DATA: KPIData[] = [
  {
    title: 'Occupancy Rate', icon: 'occupancy', mainValue: 280, mainUnit: '/500 Rooms', highlightText: '56.0% current fill rate', highlightIcon: 'trending',
    stats: [{ label: 'Booked Rooms', value: 220, icon: 'bed', iconColor: 'text-indigo-500' }, { label: 'Cancelled Rooms', value: 24, icon: 'x', iconColor: 'text-rose-500' }],
    linkText: 'View All Bookings', linkTo: '/admin/reservations',
  },
  {
    title: 'Arrivals & Departures', icon: 'travel', mainValue: 50, subtitle: 'Total transfers scheduled',
    stats: [{ label: 'Scheduled Check-outs', value: 24, icon: 'arrowUp', iconColor: 'text-rose-500' }, { label: 'Scheduled Check-ins', value: 26, icon: 'check', iconColor: 'text-emerald-500' }],
    linkText: 'Dispatch Travel Trip', linkTo: '/admin/travel',
  },
  {
    title: 'Culinary & Catering', icon: 'catering', mainValue: 250, highlightText: '22 active in kitchen station', highlightIcon: 'sparkles',
    stats: [{ label: 'Culinary Revenue', value: 86500, icon: 'dollar', iconColor: 'text-emerald-600' }, { label: 'Orders Completed', value: 228, icon: 'check', iconColor: 'text-indigo-500' }],
    linkText: 'Open Kitchen Board', linkTo: '/admin/services',
  },
];

export const INVENTORY_DATA: InventoryItem[] = [
  { label: 'Meat', count: 12, total: 125, color: '#10B981' },
  { label: 'Produce', count: 32, total: 725, color: '#3B82F6' },
  { label: 'Pantry', count: 80, total: 325, color: '#8B5CF6' },
  { label: 'Beverages', count: 74, total: 325, color: '#F59E0B' },
];

export const TOTAL_INVENTORY = { count: 198, total: 3500 };

export const SUB_CHANNELS_DATA: SubChannelData[] = [
  { channelType: 'Front Desk Walk-In', channelIcon: 'store', category: 'Offline / Desk', categoryClass: 'bg-amber-50 text-amber-800', bookings: 76, grossRevenue: 88900, avgTicket: 1170, commissionDrag: '0% ($0)', netMargin: '100%', isPositive: true },
  { channelType: 'Direct Web Engine', channelIcon: 'globe', category: 'Online Direct', categoryClass: 'bg-indigo-50 text-indigo-800', bookings: 102, grossRevenue: 84200, avgTicket: 825, commissionDrag: '0% ($0)', netMargin: '100%', isPositive: true },
  { channelType: 'Booking.com (OTA)', channelIcon: 'globeBlue', category: 'Online OTA', categoryClass: 'bg-blue-50 text-blue-800', bookings: 54, grossRevenue: 44800, avgTicket: 830, commissionDrag: '15%', netMargin: '85.0%', isPositive: false },
  { channelType: 'Direct Phone & Concierge', channelIcon: 'store', category: 'Offline / VIP', categoryClass: 'bg-emerald-50 text-emerald-800', bookings: 22, grossRevenue: 25600, avgTicket: 1163, commissionDrag: '0% ($0)', netMargin: '100%', isPositive: true },
];

export const TIME_RANGE_OPTIONS = ['Last 7 days', 'Last 14 days', 'Last 30 days'];
export const WEEK_OPTIONS = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
export const ROOM_CATEGORIES = ['Suites', 'Deluxe', 'Single', 'Double'] as const;
