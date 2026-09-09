import { getDatabase } from '../database'
import { generateReference, generateFolioNumber, calculateNights } from '../utils'
import { config } from '../config'
import bookingRepo from '../repositories/bookingRepository'
import { Booking, BookingFilters } from '../types/bookings'

const CURRENCY_RATE = 1600

export interface CreateBookingPayload {
  search: { checkIn: string; checkOut: string; adults: number; children: number; rooms: number }
  room: { id: string; slug: string; name: string; category: string; image: string; pricePerNight: number }
  guest: { fullName: string; email: string; phone: string; specialRequest: string }
  extras: Array<{ id: string; name: string; price: number; perNight: boolean }>
}

export interface PublicBooking {
  id: string; reference: string
  guest: { fullName: string; email: string; phone: string; specialRequest: string }
  room: { id: string; name: string; slug: string; category: string; image: string }
  stay: { checkIn: string; checkOut: string; nights: number; adults: number; children: number; rooms: number }
  extras: Array<{ id: string; name: string; price: number; perNight: boolean }>
  financials: {
    nights: number; roomTotal: number; extrasTotal: number
    taxAmount: number; totalAmount: number; amountPaid: number
    balanceDue: number; depositAmount: number; currency: 'NGN'
  }
  status: string; paymentMethod: string | null; paymentState: string
  depositPaid: boolean; createdAt: string
}

class BookingService {
  async getBookings(filters: BookingFilters): Promise<Booking[]> {
    return await bookingRepo.findBookings(filters)
  }

  async getBookingById(id: string): Promise<Booking | null> {
    return await bookingRepo.findBookingById(id)
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking> {
    return await bookingRepo.updateBookingStatus(id, status)
  }

  async recordPayment(id: string, amount: number, paymentStatus: string): Promise<Booking> {
    return await bookingRepo.recordPayment(id, amount, paymentStatus)
  }

  async issueKeycard(id: string, cardUid: string, issuedBy: string): Promise<Booking> {
    return await bookingRepo.issueKeycard(id, cardUid, issuedBy)
  }

  async createPublicBooking(payload: CreateBookingPayload, idempotencyKey?: string): Promise<PublicBooking> {
    const db = getDatabase()

    // Use slug as ID if ID is null/undefined
    const roomId = payload.room.id || payload.room.slug

    if (idempotencyKey) {
      const ik = await db.queryOne<{ response: any }>(
        `SELECT response FROM idempotency_keys WHERE key = $1`,
        [idempotencyKey]
      )
      if (ik) {
        const ref = ik.response?.reference
        const existing = ref ? await db.queryOne<any>(`SELECT * FROM bookings WHERE reference = $1`, [ref]) : null
        if (existing) return this.formatBooking(existing, payload.extras)
      }
    }

    const nights = calculateNights(payload.search.checkIn, payload.search.checkOut)
    const rateNGN = payload.room.pricePerNight * CURRENCY_RATE
    const roomTotal = rateNGN * nights * payload.search.rooms
    const extrasTotal = payload.extras.reduce((s, e) => s + e.price * (e.perNight ? nights : 1), 0)
    const subtotal = roomTotal + extrasTotal
    const taxAmount = subtotal * config.taxRate
    const serviceCharge = subtotal * config.serviceCharge
    const totalAmount = subtotal + taxAmount + serviceCharge

    const reference = generateReference('KEO')
    const folioNumber = generateFolioNumber()

    const booking = await db.queryOne<any>(
      `INSERT INTO bookings (
        reference, folio_number, channel, channel_category, channel_label,
        guest_name, guest_email, guest_phone, special_requests, vip_tier,
        room_id, room_name, room_slug, room_category, hero_image,
        check_in_date, check_out_date, nights, adults, children,
        rate_per_night, room_total, tax_amount, service_fee, addons_total,
        discount_amount, total_amount, amount_paid, balance_due,
        currency, payment_status, payment_method
      ) VALUES (
        $1, $2, 'Online Booking', 'online', 'Direct Website',
        $3, $4, $5, $6, 'Standard',
        $7, $8, $9, $10, $11,
        $12, $13, $14, $15, $16,
        $17, $18, $19, $20, $21,
        0, $22, 0, $23, 'NGN', 'pending', 'pay_at_hotel'
      ) RETURNING *`,
      [
        reference, folioNumber,
        payload.guest.fullName, payload.guest.email, payload.guest.phone, payload.guest.specialRequest,
        roomId, payload.room.name, payload.room.slug, payload.room.category, payload.room.image,
        payload.search.checkIn, payload.search.checkOut, nights, payload.search.adults, payload.search.children,
        rateNGN, roomTotal, taxAmount, serviceCharge, extrasTotal, 
        totalAmount, totalAmount,  // Send totalAmount twice - once for total_amount, once for balance_due
      ]
    ) as any

    if (idempotencyKey) {
      await db.query(
        `INSERT INTO idempotency_keys (key, response, status_code) VALUES ($1,$2::jsonb,201) ON CONFLICT (key) DO NOTHING`,
        [idempotencyKey, JSON.stringify({ reference })]
      )
    }

    return this.formatBooking(booking, payload.extras)
  }

  async lookupBooking(reference: string, email?: string): Promise<PublicBooking | null> {
    const db = getDatabase()
    let q = `SELECT * FROM bookings WHERE reference = $1`
    const params: any[] = [reference]
    if (email) { q += ` AND guest_email ILIKE $2`; params.push(email) }
    const row = await db.queryOne<any>(q, params)
    return row ? this.formatBooking(row, []) : null
  }

  async cancelBooking(reference: string): Promise<PublicBooking | null> {
    const db = getDatabase()
    const row = await db.queryOne<any>(
      `UPDATE bookings SET status='Cancelled', cancelled_at=NOW()
       WHERE reference=$1 AND status!='Cancelled' RETURNING *`,
      [reference]
    )
    return row ? this.formatBooking(row, []) : null
  }

  formatBooking(row: any, extras: any[]): PublicBooking {
    const totalAmount = Number(row.total_amount)
    return {
      id: row.id, reference: row.reference,
      guest: { fullName: row.guest_name, email: row.guest_email, phone: row.guest_phone, specialRequest: row.special_requests ?? '' },
      room: { id: row.room_id, name: row.room_name, slug: row.room_slug, category: row.room_category, image: row.hero_image },
      stay: { checkIn: row.check_in_date, checkOut: row.check_out_date, nights: row.nights, adults: row.adults, children: row.children, rooms: 1 },
      extras,
      financials: {
        nights: row.nights, roomTotal: Number(row.room_total), extrasTotal: Number(row.addons_total),
        taxAmount: Number(row.tax_amount), totalAmount, amountPaid: Number(row.amount_paid),
        balanceDue: Number(row.balance_due), depositAmount: Math.round(totalAmount * 0.25), currency: 'NGN',
      },
      status: row.status, paymentMethod: row.payment_method,
      paymentState: row.payment_status?.toLowerCase() ?? 'pending',
      depositPaid: Number(row.amount_paid) > 0, createdAt: row.created_at,
    }
  }
}

export default new BookingService()