import { Context } from 'hono'
import paymentService from '../services/paymentService'

class PublicPaymentController {
  async initialize(c: Context): Promise<Response> {
    try {
      const body = await c.req.json()
      const idempotencyKey = c.req.header('Idempotency-Key') ?? undefined

      const { bookingReference, amount, method } = body
      if (!bookingReference || !method) {
        return c.json({ error: 'bookingReference and method are required' }, 400)
      }

      const result = await paymentService.initialize({
        bookingReference,
        amount: Number(amount ?? 0),
        method,
        email: body.email ?? '',
        idempotencyKey,
        depositAmount: body.depositAmount,
      })

      return c.json(result)
    } catch (err: any) {
      console.error('[payment.initialize]', err)
      return c.json({ error: err.message || 'Payment initialization failed' }, 500)
    }
  }

  async verify(c: Context): Promise<Response> {
    try {
      const reference = c.req.param('reference')
      const result = await paymentService.verify(reference as string)
      return c.json(result)
    } catch (err: any) {
      console.error('[payment.verify]', err)
      return c.json({ error: err.message || 'Payment verification failed' }, 500)
    }
  }

  async webhook(c: Context): Promise<Response> {
    try {
      const signature = c.req.header('x-paystack-signature') ?? ''
      const rawBody = await c.req.text()

      await paymentService.handleWebhook(rawBody, signature)
      return c.json({ received: true })
    } catch (err: any) {
      console.error('[payment.webhook]', err)
      // Always 200 to Paystack (they retry on non-200)
      return c.json({ received: false, error: err.message }, 200)
    }
  }

  async confirmTransfer(c: Context): Promise<Response> {
    try {
      const reference = c.req.param('reference') as string
      // Mark booking as pending transfer confirmation; webhook will finalize
      const db = (await import('../database')).getDatabase()
      await db.query(
        `UPDATE bookings SET payment_method='transfer', payment_status='processing'
         WHERE reference=$1`,
        [reference]
      )
      const booking = await (await import('../services/bookingService')).default.lookupBooking(reference)
      return c.json(booking)
    } catch (err: any) {
      return c.json({ error: err.message }, 500)
    }
  }
  async charge(c: Context): Promise<Response> {
    try {
      const body = await c.req.json()
      const result = await paymentService.chargeCard(body)
      return c.json(result)
    } catch (err: any) {
      console.error('[payment.charge]', err)
      return c.json({ error: err.message || 'Charge failed' }, 500)
    }
  }

  async submitPin(c: Context): Promise<Response> {
    try {
      const { reference, pin } = await c.req.json()
      const result = await paymentService.submitPin(reference, pin)
      return c.json(result)
    } catch (err: any) {
      console.error('[payment.submitPin]', err)
      return c.json({ error: err.message || 'Submit PIN failed' }, 500)
    }
  }

  async submitOtp(c: Context): Promise<Response> {
    try {
      const { reference, otp } = await c.req.json()
      const result = await paymentService.submitOtp(reference, otp)
      return c.json(result)
    } catch (err: any) {
      console.error('[payment.submitOtp]', err)
      return c.json({ error: err.message || 'Submit OTP failed' }, 500)
    }
  }

  async submitPhone(c: Context): Promise<Response> {
    try {
      const { reference, phone } = await c.req.json()
      const result = await paymentService.submitPhone(reference, phone)
      return c.json(result)
    } catch (err: any) {
      console.error('[payment.submitPhone]', err)
      return c.json({ error: err.message || 'Submit phone failed' }, 500)
    }
  }

  async submitBirthday(c: Context): Promise<Response> {
    try {
      const { reference, birthday } = await c.req.json()
      const result = await paymentService.submitBirthday(reference, birthday)
      return c.json(result)
    } catch (err: any) {
      console.error('[payment.submitBirthday]', err)
      return c.json({ error: err.message || 'Submit birthday failed' }, 500)
    }
  }
}

export default new PublicPaymentController()
