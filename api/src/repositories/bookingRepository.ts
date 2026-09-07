import { getDatabase } from "../database"
import { Booking, BookingFilters } from "../types/bookings"

class BookingRepository {
  async findBookings(filters: BookingFilters): Promise<Booking[]> {
    const db = getDatabase()
    let query = `
      SELECT id, reference, folio_number, channel, channel_category, channel_label, 
             status, guest_name, guest_email, guest_phone, guest_avatar, vip_tier,
             room_name, room_number, floor, hero_image, tagline, check_in_date, check_out_date,
             nights, adults, children, rate_per_night, total_amount, amount_paid, balance_due,
             currency, payment_status, payment_method, transaction_ref, booked_at, handled_by,
             keycard_status, card_uid, issued_at, issued_by, paid_at, cancelled_at,
             created_at, updated_at
      FROM bookings
      WHERE 1=1
    `
    const params: any[] = []

    if (filters.channelCategory && filters.channelCategory !== 'all') {
      query += ` AND channel_category = $${params.length + 1}`
      params.push(filters.channelCategory)
    }

    if (filters.status && filters.status !== 'all') {
      query += ` AND status = $${params.length + 1}`
      params.push(filters.status)
    }

    if (filters.searchQuery) {
      query += ` AND (guest_name ILIKE $${params.length + 1} OR reference ILIKE $${params.length + 1} OR folio_number ILIKE $${params.length + 1})`
      params.push(`%${filters.searchQuery}%`)
    }

    query += ` ORDER BY booked_at DESC`
    const result = await db.query<Booking>(query, params)
    return result.rows
  }

  async findBookingById(id: string): Promise<Booking | null> {
    const db = getDatabase()
    const booking = await db.queryOne<Booking>('SELECT * FROM bookings WHERE id = $1', [id])
    return booking
  }

  async createBooking(data: any): Promise<Booking> {
    const db = getDatabase()
    const id = data.id || `booking-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    const booking = await db.queryOne<Booking>(
      `INSERT INTO bookings (
        id, reference, folio_number, channel, channel_category, channel_label,
        guest_name, guest_email, guest_phone, guest_avatar, vip_tier, nationality, id_type, id_number, special_requests,
        room_id, room_name, room_slug, room_category, room_number, floor, hero_image, tagline,
        check_in_date, check_in_time, check_out_date, check_out_time,
        nights, adults, children,
        rate_per_night, room_total, tax_amount, service_fee, addons_total, discount_amount,
        total_amount, amount_paid, balance_due, currency, payment_status, payment_method, transaction_ref,
        handled_by, keycard_status, card_uid, issued_at, issued_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48
      ) RETURNING *`,
      [
        id, data.reference, data.folioNumber, data.channel, data.channelCategory, data.channelLabel,
        data.guestName, data.guestEmail, data.guestPhone, data.guestAvatar, data.vipTier, 
        data.nationality, data.idType, data.idNumber, data.specialRequests,
        data.roomId, data.roomName, data.roomSlug, data.roomCategory, data.roomNumber, data.floor, 
        data.heroImage, data.tagline, data.checkInDate, data.checkInTime, data.checkOutDate, data.checkOutTime,
        data.nights, data.adults, data.children,
        data.ratePerNight, data.roomTotal, data.taxAmount, data.serviceFee, data.addonsTotal, data.discountAmount,
        data.totalAmount, data.amountPaid, data.balanceDue, data.currency, data.paymentStatus, 
        data.paymentMethod, data.transactionRef,
        data.handledBy, data.keycardStatus, data.cardUid, data.issuedAt, data.issuedBy
      ]
    ) as unknown as Booking
    return booking
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking> {
    const db = getDatabase()
    const booking = await db.queryOne<Booking>(
      `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    ) as unknown as Booking
    return booking
  }

  async recordPayment(id: string, amount: number, paymentStatus: string): Promise<Booking> {
    const db = getDatabase()
    const booking = await db.queryOne<Booking>(
      `UPDATE bookings 
       SET amount_paid = amount_paid + $1, 
           balance_due = total_amount - (amount_paid + $1),
           payment_status = $2,
           paid_at = NOW()
       WHERE id = $3 RETURNING *`,
      [amount, paymentStatus, id]
    )as unknown as Booking
    return booking
  }

  async issueKeycard(id: string, cardUid: string, issuedBy: string): Promise<Booking> {
    const db = getDatabase()
    const booking = await db.queryOne<Booking>(
      `UPDATE bookings 
       SET keycard_status = 'Active', card_uid = $1, issued_at = NOW(), issued_by = $2
       WHERE id = $3 RETURNING *`,
      [cardUid, issuedBy, id]
    ) as unknown as Booking
    return booking
  }
}

export default new BookingRepository()