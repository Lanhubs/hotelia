import { Context } from "hono"
import eventService from "../services/eventService"
import { handleApiError } from "../types/errorTypes"
import { rateLimit } from "../middlewares/rateLimit"

class PublicEventController {
  async getPastEvents(c: Context): Promise<Response> {
    try {
      const filters = {
        search: c.req.query('search') || undefined,
        eventType: c.req.query('eventType') || undefined,
        category: c.req.query('category') || undefined,
        limit: c.req.query('limit') ? parseInt(c.req.query('limit')!) : 20,
        offset: c.req.query('offset') ? parseInt(c.req.query('offset')!) : 0,
      }
      const events = await eventService.getPastEvents(filters)
      return c.json(events)
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  async getEventBySlug(c: Context): Promise<Response> {
    try {
      const slug = c.req.param("slug") as string
      const event = await eventService.getEventBySlug(slug)
      if (!event) {
        return c.json({ error: "Event not found" }, 404)
      }
      const now = new Date().toISOString().split('T')[0]
      if (event.endDate >= now) {
        return c.json({ error: "Event not found" }, 404)
      }
      return c.json(event)
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  async createBooking(c: Context): Promise<Response> {
    try {
      const id = c.req.param("id") as string
      const data = await c.req.json()
      const booking = await eventService.createBooking({ ...data, eventId: id })
      return c.json({ success: true, booking }, 201)
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  async getBookingByReference(c: Context): Promise<Response> {
    try {
      const reference = c.req.param("reference") as string
      const booking = await eventService.getBookingByReference(reference)
      if (!booking) {
        return c.json({ error: "Booking not found" }, 404)
      }
      return c.json(booking)
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  async cancelBooking(c: Context): Promise<Response> {
    try {
      const reference = c.req.param("reference") as string
      const booking = await eventService.cancelBooking(reference)
      if (!booking) {
        return c.json({ error: "Booking not found" }, 404)
      }
      return c.json({ success: true, booking })
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }
}

export default new PublicEventController()