import { Context } from 'hono'
import bookingService from '../services/bookingService'
import extrasRepo from '../repositories/extrasRepository'

class PublicBookingController {
  async createBooking(c: Context): Promise<Response> {
    try {
      const body = await c.req.json()
      const idempotencyKey = c.req.header('Idempotency-Key') ?? undefined

      if (!body.search?.checkIn || !body.search?.checkOut) {
        return c.json({ error: 'checkIn and checkOut dates are required' }, 400)
      }
      if (!body.room?.id && !body.room?.slug) {
        return c.json({ error: 'room ID or slug is required' }, 400)
      }
      if (!body.guest?.email?.trim()) {
        return c.json({ error: 'guest email is required' }, 400)
      }
      if (!body.guest?.fullName?.trim()) {
        return c.json({ error: 'guest full name is required' }, 400)
      }

      const booking = await bookingService.createPublicBooking(body, idempotencyKey)
      return c.json(booking, 201)
    } catch (err: any) {
      console.error('[createBooking]', err)
      return c.json({ error: err.message || 'Failed to create booking' }, 500)
    }
  }

  async getReservation(c: Context): Promise<Response> {
    try {
      const reference = c.req.param('reference') as string
      const email = c.req.query('email') ?? undefined

      const booking = await bookingService.lookupBooking(reference, email)
      if (!booking) return c.json({ error: 'Reservation not found' }, 404)

      return c.json(booking)
    } catch (err: any) {
      console.error('[getReservation]', err)
      return c.json({ error: err.message || 'Failed to fetch reservation' }, 500)
    }
  }

  async cancelReservation(c: Context): Promise<Response> {
    try {
      const reference = c.req.param('reference') as string
      const result = await bookingService.cancelBooking(reference)
      if (!result) return c.json({ error: 'Reservation not found or already cancelled' }, 404)
      return c.json(result)
    } catch (err: any) {
      console.error('[cancelReservation]', err)
      return c.json({ error: err.message || 'Failed to cancel' }, 500)
    }
  }

  async setPaymentMethod(c: Context): Promise<Response> {
    try {
      const reference = c.req.param('reference') as string
      const { method, depositAmount } = await c.req.json()
      const db = (await import('../database')).getDatabase()
      await db.query(
        `UPDATE bookings SET payment_method = $1 WHERE reference = $2`,
        [method, reference]
      )
      const booking = await bookingService.lookupBooking(reference)
      return c.json(booking)
    } catch (err: any) {
      return c.json({ error: err.message }, 500)
    }
  }

  async getExtras(c: Context): Promise<Response> {
    try {
      const extras = await extrasRepo.findAll()
      return c.json(extras)
    } catch (err: any) {
      return c.json({ error: err.message }, 500)
    }
  }
}

export default new PublicBookingController()
