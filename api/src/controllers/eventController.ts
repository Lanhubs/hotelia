import { Context } from "hono"
import eventService from "../services/eventService"
import { handleApiError } from "../types/errorTypes"

class EventController {
  async getEvents(c: Context): Promise<Response> {
    try {
      const filters = {
        search: c.req.query('search') || undefined,
        eventType: c.req.query('eventType') || undefined,
        category: c.req.query('category') || undefined,
        status: c.req.query('status') || undefined,
        isRecurring: c.req.query('isRecurring') !== undefined ? c.req.query('isRecurring') === 'true' : undefined,
        isPublished: c.req.query('isPublished') !== undefined ? c.req.query('isPublished') === 'true' : undefined,
        dateFrom: c.req.query('dateFrom') || undefined,
        dateTo: c.req.query('dateTo') || undefined,
        limit: c.req.query('limit') ? parseInt(c.req.query('limit')!) : 50,
        offset: c.req.query('offset') ? parseInt(c.req.query('offset')!) : 0,
      }
      const events = await eventService.getAdminEvents(filters)
      return c.json(events)
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  async getEvent(c: Context): Promise<Response> {
    try {
      const id = c.req.param("id") as string
      const event = await eventService.getEventById(id)
      if (!event) {
        return c.json({ error: "Event not found" }, 404)
      }
      return c.json(event)
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  async createEvent(c: Context): Promise<Response> {
    try {
      const userId = c.get('userId') as string
      const data = await c.req.json()
      const event = await eventService.createEvent({ ...data, createdBy: userId })
      return c.json({ success: true, event }, 201)
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  async updateEvent(c: Context): Promise<Response> {
    try {
      const id = c.req.param("id") as string
      const data = await c.req.json()
      const event = await eventService.updateEvent(id, data)
      if (!event) {
        return c.json({ error: "Event not found" }, 404)
      }
      return c.json({ success: true, event })
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  async deleteEvent(c: Context): Promise<Response> {
    try {
      const id = c.req.param("id") as string
      await eventService.deleteEvent(id)
      return c.json({ success: true, message: "Event deleted" })
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  async getEventOccurrences(c: Context): Promise<Response> {
    try {
      const id = c.req.param("id") as string
      const rangeStart = c.req.query('rangeStart') as string
      const rangeEnd = c.req.query('rangeEnd') as string
      
      if (!rangeStart || !rangeEnd) {
        return c.json({ error: "rangeStart and rangeEnd are required" }, 400)
      }
      
      const occurrences = await eventService.getEventOccurrences(id, rangeStart, rangeEnd)
      return c.json(occurrences)
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  async getEventBookings(c: Context): Promise<Response> {
    try {
      const id = c.req.param("id") as string
      const filters = {
        status: c.req.query('status') || undefined,
        paymentStatus: c.req.query('paymentStatus') || undefined,
        dateFrom: c.req.query('dateFrom') || undefined,
        dateTo: c.req.query('dateTo') || undefined,
        limit: c.req.query('limit') ? parseInt(c.req.query('limit')!) : 100,
        offset: c.req.query('offset') ? parseInt(c.req.query('offset')!) : 0,
      }
      const bookings = await eventService.getEventBookings(id, filters)
      return c.json(bookings)
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  async updateBooking(c: Context): Promise<Response> {
    try {
      const bookingId = c.req.param("bookingId") as string
      const userId = c.get('userId') as string
      const { status } = await c.req.json()
      const booking = await eventService.updateBookingStatus(bookingId, status, userId)
      if (!booking) {
        return c.json({ error: "Booking not found" }, 404)
      }
      return c.json({ success: true, booking })
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  async checkInBooking(c: Context): Promise<Response> {
    try {
      const bookingId = c.req.param("bookingId") as string
      const userId = c.get('userId') as string
      const booking = await eventService.checkInBooking(bookingId, userId)
      if (!booking) {
        return c.json({ error: "Booking not found" }, 404)
      }
      return c.json({ success: true, booking })
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  async cancelBooking(c: Context): Promise<Response> {
    try {
      const bookingId = c.req.param("bookingId") as string
      const booking = await eventService.cancelBooking(bookingId)
      if (!booking) {
        return c.json({ error: "Booking not found" }, 404)
      }
      return c.json({ success: true, booking })
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  async getStats(c: Context): Promise<Response> {
    try {
      const stats = await eventService.getStats()
      return c.json(stats)
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }
}

export default new EventController()