import eventRepository from "../repositories/eventRepository"
import type { Event, EventBooking, EventOccurrence, EventFilters, BookingFilters, EventStats } from "../types/events"

class EventService {
  async getEvents(filters: EventFilters = {}): Promise<Event[]> {
    return eventRepository.fetchEvents(filters)
  }

  async getEventById(id: string): Promise<Event | null> {
    return eventRepository.fetchEventById(id)
  }

  async getEventBySlug(slug: string): Promise<Event | null> {
    return eventRepository.fetchEventBySlug(slug)
  }

  async createEvent(data: any): Promise<Event> {
    return eventRepository.createEvent(data)
  }

  async updateEvent(id: string, data: any): Promise<Event | null> {
    return eventRepository.updateEvent(id, data)
  }

  async deleteEvent(id: string): Promise<boolean> {
    return eventRepository.deleteEvent(id)
  }

  async getPastEvents(filters: EventFilters = {}): Promise<Event[]> {
    const now = new Date().toISOString().split('T')[0]
    return eventRepository.fetchEvents({
      ...filters,
      dateTo: now,
      isPublished: true,
    })
  }

  async getAdminEvents(filters: EventFilters = {}): Promise<Event[]> {
    return eventRepository.fetchEvents(filters)
  }

  async getEventOccurrences(eventId: string, rangeStart: string, rangeEnd: string): Promise<EventOccurrence[]> {
    return eventRepository.fetchEventOccurrences(eventId, rangeStart, rangeEnd)
  }

  async createBooking(data: any): Promise<EventBooking> {
    const event = await eventRepository.fetchEventById(data.eventId)
    if (!event) throw new Error('Event not found')

    if (event.bookingClosesAt && new Date(data.occurrenceDate || event.startDate) > new Date(event.bookingClosesAt)) {
      throw new Error('Booking period has closed')
    }
    if (event.bookingOpensAt && new Date(data.occurrenceDate || event.startDate) < new Date(event.bookingOpensAt)) {
      throw new Error('Booking has not opened yet')
    }

    if (event.hasTickets) {
      const tier = event.ticketTiers.find(t => t.id === data.ticketTierId)
      if (!tier) throw new Error('Invalid ticket tier')
      data.amountUSD = tier.priceUSD
      data.amountNaira = tier.priceNaira ?? tier.priceUSD * 1600
      data.paymentStatus = 'pending'
    } else {
      data.amountUSD = 0
      data.amountNaira = 0
      data.paymentStatus = 'free'
    }

    const existingBookings = await eventRepository.fetchEventBookings(event.id, {
      dateFrom: data.occurrenceDate,
      dateTo: data.occurrenceDate,
    })
    const bookedCount = existingBookings.reduce((sum, b) => sum + b.guestCount, 0)
    const capacity = event.hasTickets 
      ? event.ticketTiers.find(t => t.id === data.ticketTierId)?.capacity ?? 0
      : event.maxCapacity || event.rsvpLimit || 0
    
    if (bookedCount + (data.guestCount || 1) > capacity) {
      throw new Error('Event is at capacity')
    }

    if (event.requiresApproval) {
      data.status = 'pending'
    }

    return eventRepository.createEventBooking(data)
  }

  async getEventBookings(eventId: string, filters: BookingFilters = {}): Promise<EventBooking[]> {
    return eventRepository.fetchEventBookings(eventId, filters)
  }

  async getBookingByReference(reference: string): Promise<EventBooking | null> {
    return eventRepository.fetchBookingByReference(reference)
  }

  async updateBookingStatus(id: string, status: string, userId: string): Promise<EventBooking | null> {
    return eventRepository.updateBookingStatus(id, status, userId)
  }

  async cancelBooking(id: string): Promise<EventBooking | null> {
    return eventRepository.cancelBooking(id)
  }

  async checkInBooking(id: string, userId: string): Promise<EventBooking | null> {
    return eventRepository.checkInBooking(id, userId)
  }

  async getStats(): Promise<EventStats> {
    return eventRepository.getEventStats()
  }
}

export default new EventService()