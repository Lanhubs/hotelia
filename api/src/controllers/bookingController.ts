import { Context } from "hono"
import bookingService from "../services/bookingService"
import { BookingFilters } from "../types/bookings"
import { NotFoundError, handleApiError } from "../types/errorTypes"

class BookingController {
  async getBookings(c: Context): Promise<Response> {
    try {
      const filters: BookingFilters = {
        searchQuery: c.req.query('searchQuery') || '',
        channelCategory: (c.req.query('channelCategory') as any) || 'all',
        channelSpecific: (c.req.query('channelSpecific') as any) || 'all',
        status: (c.req.query('status') as any) || 'all',
        timeframe: (c.req.query('timeframe') as any) || 'all',
        sortBy: (c.req.query('sortBy') as any) || 'latest_booked',
      }
      const bookings = await bookingService.getBookings(filters)
      return c.json(bookings)
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  async getBooking(c: Context): Promise<Response> {
    try {
      const id = c.req.param("id")as string
      const booking = await bookingService.getBookingById(id)
      if (!booking) {
        return c.json({ error: "Booking not found" }, 404)
      }
      return c.json(booking)
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  async updateBookingStatus(c: Context): Promise<Response> {
    try {
      const id = c.req.param("id")as string
      const { status } = await c.req.json()
      const booking = await bookingService.updateBookingStatus(id, status)
      return c.json(booking)
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  async recordPayment(c: Context): Promise<Response> {
    try {
      const id = c.req.param("id")as string
      const { amount, paymentStatus } = await c.req.json()
      const booking = await bookingService.recordPayment(id, amount, paymentStatus)
      return c.json(booking)
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }

  async issueKeycard(c: Context): Promise<Response> {
    try {
      const id = c.req.param("id")as string
      const { cardUid, issuedBy } = await c.req.json()
      const booking = await bookingService.issueKeycard(id, cardUid, issuedBy)
      return c.json(booking)
    } catch (error) {
      return handleApiError(c, error as any)
    }
  }
}

export default new BookingController()