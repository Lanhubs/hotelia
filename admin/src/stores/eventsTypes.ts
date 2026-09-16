export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  eventType: string;
  category: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  timezone: string;
  recurrenceRule: string | null;
  recurrenceEndDate: string | null;
  recurrenceExceptions: string[];
  isRecurring: boolean;
  venueName: string | null;
  venueDescription: string | null;
  maxCapacity: number | null;
  hasTickets: boolean;
  ticketTiers: TicketTier[];
  rsvpLimit: number | null;
  bookingOpensAt: string | null;
  bookingClosesAt: string | null;
  requiresApproval: boolean;
  heroImage: string | null;
  gallery: string[];
  tags: string[];
  isFeatured: boolean;
  isPublished: boolean;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  contactEmail: string | null;
  contactPhone: string | null;
  externalRegistrationUrl: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  bookings?: EventBooking[];
}

export interface TicketTier {
  id: string;
  name: string;
  priceUSD: number;
  priceNaira: number | null;
  capacity: number | null;
  description: string | null;
}

export interface EventBooking {
  id: string;
  eventId: string;
  occurrenceDate: string | null;
  guestName: string;
  guestEmail: string;
  guestPhone: string | null;
  guestCount: number;
  ticketTierId: string | null;
  amountUSD: number;
  amountNaira: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'waitlisted' | 'attended';
  paymentStatus: 'free' | 'pending' | 'paid' | 'refunded';
  paymentReference: string | null;
  paymentMethod: string | null;
  approvedBy: string | null;
  checkedInAt: string | null;
  checkedInBy: string | null;
  specialRequests: string | null;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export type EventOccurrence = Event & {
  occurrenceDate: string;
  isRecurrenceInstance: boolean;
  sourceEvent: Event;
  bookedCount: number;
  maxCapacity: number | null;
};

export interface EventFilters {
  search?: string;
  eventType?: string;
  category?: string;
  status?: string;
  isRecurring?: boolean;
  isPublished?: boolean;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

export interface BookingFilters {
  status?: string;
  paymentStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

export interface EventStats {
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
  totalBookings: number;
  totalRevenueUSD: number;
  totalRevenueNaira: number;
}