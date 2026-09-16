import { getDatabase } from "../database"
import type { Event, EventBooking, EventOccurrence, EventFilters, BookingFilters, EventStats, TicketTier } from "../types/events"

function parseJsonArray(value: any): any[] {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    try { const parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed : [] } catch { return [] }
  }
  return []
}

function parseTicketTiers(value: any): TicketTier[] {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    try { const parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed : [] } catch { return [] }
  }
  return []
}

function mapEvent(row: any): Event | null {
  if (!row) return null
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description || null,
    eventType: row.event_type,
    category: row.category,
    startDate: row.start_date,
    endDate: row.end_date,
    startTime: row.start_time,
    endTime: row.end_time,
    timezone: row.timezone || 'Africa/Lagos',
    recurrenceRule: row.recurrence_rule || null,
    recurrenceEndDate: row.recurrence_end_date || null,
    recurrenceExceptions: parseJsonArray(row.recurrence_exceptions),
    isRecurring: !!row.is_recurring,
    venueName: row.venue_name || null,
    venueDescription: row.venue_description || null,
    maxCapacity: row.max_capacity ?? null,
    hasTickets: !!row.has_tickets,
    ticketTiers: parseTicketTiers(row.ticket_tiers),
    rsvpLimit: row.rsvp_limit ?? null,
    bookingOpensAt: row.booking_opens_at || null,
    bookingClosesAt: row.booking_closes_at || null,
    requiresApproval: !!row.requires_approval,
    heroImage: row.hero_image || null,
    gallery: parseJsonArray(row.gallery),
    tags: parseJsonArray(row.tags),
    isFeatured: !!row.is_featured,
    isPublished: !!row.is_published,
    status: row.status,
    contactEmail: row.contact_email || null,
    contactPhone: row.contact_phone || null,
    externalRegistrationUrl: row.external_registration_url || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by || null,
  }
}

function mapEventBooking(row: any): EventBooking | null {
  if (!row) return null
  return {
    id: row.id,
    eventId: row.event_id,
    occurrenceDate: row.occurrence_date || null,
    guestName: row.guest_name,
    guestEmail: row.guest_email,
    guestPhone: row.guest_phone || null,
    guestCount: row.guest_count || 1,
    ticketTierId: row.ticket_tier_id || null,
    amountUSD: row.amount_usd || 0,
    amountNaira: row.amount_naira || 0,
    currency: row.currency || 'NGN',
    status: row.status,
    paymentStatus: row.payment_status,
    paymentReference: row.payment_reference || null,
    paymentMethod: row.payment_method || null,
    approvedBy: row.approved_by || null,
    checkedInAt: row.checked_in_at || null,
    checkedInBy: row.checked_in_by || null,
    specialRequests: row.special_requests || null,
    source: row.source || 'website',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

class EventRepository {
  async fetchEvents(filters: EventFilters = {}): Promise<Event[]> {
    const db = getDatabase()
    let query = `SELECT * FROM events WHERE 1=1`
    const params: any[] = []

    if (filters.search) {
      query += ` AND (title LIKE $${params.length + 1} OR description LIKE $${params.length + 1})`
      params.push(`%${filters.search}%`)
    }
    if (filters.eventType) {
      query += ` AND event_type = $${params.length + 1}`
      params.push(filters.eventType)
    }
    if (filters.category) {
      query += ` AND category = $${params.length + 1}`
      params.push(filters.category)
    }
    if (filters.status) {
      query += ` AND status = $${params.length + 1}`
      params.push(filters.status)
    }
    if (filters.isRecurring !== undefined) {
      query += ` AND is_recurring = $${params.length + 1}`
      params.push(filters.isRecurring ? 1 : 0)
    }
    if (filters.isPublished !== undefined) {
      query += ` AND is_published = $${params.length + 1}`
      params.push(filters.isPublished ? 1 : 0)
    }
    if (filters.dateFrom) {
      query += ` AND end_date >= $${params.length + 1}`
      params.push(filters.dateFrom)
    }
    if (filters.dateTo) {
      query += ` AND start_date <= $${params.length + 1}`
      params.push(filters.dateTo)
    }

    query += ` ORDER BY start_date DESC`

    if (filters.limit) {
      query += ` LIMIT $${params.length + 1}`
      params.push(filters.limit)
    }
    if (filters.offset) {
      query += ` OFFSET $${params.length + 1}`
      params.push(filters.offset)
    }

    const result = await db.query<any>(query, params)
    return result.rows.map(mapEvent).filter((e): e is Event => e !== null)
  }

  async fetchEventById(id: string): Promise<Event | null> {
    const db = getDatabase()
    const event = await db.queryOne<any>('SELECT * FROM events WHERE id = $1', [id])
    return mapEvent(event)
  }

  async fetchEventBySlug(slug: string): Promise<Event | null> {
    const db = getDatabase()
    const event = await db.queryOne<any>('SELECT * FROM events WHERE slug = $1', [slug])
    return mapEvent(event)
  }

  async createEvent(data: any): Promise<Event> {
    const db = getDatabase()
    const id = data.id || `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const now = new Date().toISOString()

    const result = await db.queryOne<any>(
      `INSERT INTO events (
        id, slug, title, description, event_type, category,
        start_date, end_date, start_time, end_time, timezone,
        recurrence_rule, recurrence_end_date, recurrence_exceptions, is_recurring,
        venue_name, venue_description, max_capacity,
        has_tickets, ticket_tiers, rsvp_limit, booking_opens_at, booking_closes_at, requires_approval,
        hero_image, gallery, tags,
        is_featured, is_published, status,
        contact_email, contact_phone, external_registration_url,
        created_at, updated_at, created_by
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36
      ) RETURNING *`,
      [
        id, slug, data.title, data.description || '', data.eventType || 'party', data.category || 'Social',
        data.startDate, data.endDate, data.startTime, data.endTime, data.timezone || 'Africa/Lagos',
        data.recurrenceRule || null, data.recurrenceEndDate || null, JSON.stringify(data.recurrenceExceptions || []), data.isRecurring ? 1 : 0,
        data.venueName || null, data.venueDescription || null, data.maxCapacity || null,
        data.hasTickets ? 1 : 0, JSON.stringify(data.ticketTiers || []), data.rsvpLimit || null, data.bookingOpensAt || null, data.bookingClosesAt || null, data.requiresApproval ? 1 : 0,
        data.heroImage || null, JSON.stringify(data.gallery || []), JSON.stringify(data.tags || []),
        data.isFeatured ? 1 : 0, data.isPublished ? 1 : 0, data.status || 'scheduled',
        data.contactEmail || null, data.contactPhone || null, data.externalRegistrationUrl || null,
        now, now, data.createdBy || null,
      ]
    )
    return mapEvent(result)!
  }

  async updateEvent(id: string, data: any): Promise<Event | null> {
    const db = getDatabase()
    const fields: string[] = []
    const params: any[] = []
    let idx = 1

    const fieldMap: Record<string, string> = {
      title: 'title',
      description: 'description',
      eventType: 'event_type',
      category: 'category',
      startDate: 'start_date',
      endDate: 'end_date',
      startTime: 'start_time',
      endTime: 'end_time',
      timezone: 'timezone',
      recurrenceRule: 'recurrence_rule',
      recurrenceEndDate: 'recurrence_end_date',
      recurrenceExceptions: 'recurrence_exceptions',
      isRecurring: 'is_recurring',
      venueName: 'venue_name',
      venueDescription: 'venue_description',
      maxCapacity: 'max_capacity',
      hasTickets: 'has_tickets',
      ticketTiers: 'ticket_tiers',
      rsvpLimit: 'rsvp_limit',
      bookingOpensAt: 'booking_opens_at',
      bookingClosesAt: 'booking_closes_at',
      requiresApproval: 'requires_approval',
      heroImage: 'hero_image',
      gallery: 'gallery',
      tags: 'tags',
      isFeatured: 'is_featured',
      isPublished: 'is_published',
      status: 'status',
      contactEmail: 'contact_email',
      contactPhone: 'contact_phone',
      externalRegistrationUrl: 'external_registration_url',
    }

    for (const [key, column] of Object.entries(fieldMap)) {
      if (data[key] !== undefined) {
        fields.push(`${column} = $${idx++}`)
        if (key === 'recurrenceExceptions' || key === 'gallery' || key === 'tags' || key === 'ticketTiers') {
          params.push(JSON.stringify(data[key]))
        } else if (key === 'isRecurring' || key === 'hasTickets' || key === 'isFeatured' || key === 'isPublished' || key === 'requiresApproval') {
          params.push(data[key] ? 1 : 0)
        } else {
          params.push(data[key])
        }
      }
    }

    if (fields.length === 0) return this.fetchEventById(id)

    fields.push(`updated_at = $${idx++}`)
    params.push(new Date().toISOString())
    params.push(id)

    await db.query(
      `UPDATE events SET ${fields.join(', ')} WHERE id = $${idx}`,
      params
    )

    return this.fetchEventById(id)
  }

  async deleteEvent(id: string): Promise<boolean> {
    const db = getDatabase()
    await db.query('DELETE FROM events WHERE id = $1', [id])
    return true
  }

  async fetchEventOccurrences(eventId: string, rangeStart: string, rangeEnd: string): Promise<EventOccurrence[]> {
    const event = await this.fetchEventById(eventId)
    if (!event) return []
    return this.expandRecurringEvent(event, rangeStart, rangeEnd)
  }

  async expandRecurringEvent(event: Event, rangeStart: string, rangeEnd: string): Promise<EventOccurrence[]> {
    if (!event.isRecurring || !event.recurrenceRule) {
      const start = new Date(event.startDate)
      const end = new Date(event.endDate)
      const rangeS = new Date(rangeStart)
      const rangeE = new Date(rangeEnd)
      if (start <= rangeE && end >= rangeS) {
        return [{
          ...event,
          occurrenceDate: event.startDate,
          isRecurrenceInstance: false,
          availableCapacity: event.maxCapacity || 0,
          bookedCount: 0,
        }]
      }
      return []
    }

    const occurrences: EventOccurrence[] = []
    const rule = this.parseRRule(event.recurrenceRule)
    if (!rule) return []

    const startDate = new Date(event.startDate)
    const endDate = event.recurrenceEndDate ? new Date(event.recurrenceEndDate) : new Date(rangeEnd)
    const actualEnd = endDate < new Date(rangeEnd) ? endDate : new Date(rangeEnd)
    const exceptions = new Set(event.recurrenceExceptions)

    let current = new Date(startDate)
    current.setHours(0, 0, 0, 0)

    while (current <= actualEnd) {
      const currentStr = current.toISOString().split('T')[0]
      
      if (this.matchesRule(current, rule) && !exceptions.has(currentStr)) {
        if (current >= new Date(rangeStart) && current <= new Date(rangeEnd)) {
          occurrences.push({
            ...event,
            occurrenceDate: currentStr,
            isRecurrenceInstance: currentStr !== event.startDate,
            availableCapacity: event.maxCapacity || 0,
            bookedCount: 0,
          })
        }
      }
      current.setDate(current.getDate() + 1)
    }

    return occurrences
  }

  private parseRRule(ruleStr: string): { freq: string; interval: number; byDay?: number[]; byMonthDay?: number; byWeekNo?: number; byDayOfWeek?: number } | null {
    const parts = ruleStr.split(';')
    const rule: any = { freq: '', interval: 1 }
    for (const part of parts) {
      const [key, value] = part.split('=')
      if (key === 'FREQ') rule.freq = value
      else if (key === 'INTERVAL') rule.interval = parseInt(value, 10)
      else if (key === 'BYDAY') rule.byDay = value.split(',').map((d: string) => this.dayToNum(d))
      else if (key === 'BYMONTHDAY') rule.byMonthDay = parseInt(value, 10)
    }
    return rule.freq ? rule : null
  }

  private dayToNum(day: string): number {
    const days: Record<string, number> = { MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6, SU: 0 }
    return days[day.toUpperCase()] ?? 0
  }

  private matchesRule(date: Date, rule: any): boolean {
    if (rule.freq === 'WEEKLY') {
      return date.getDay() === (rule.byDay?.[0] ?? date.getDay()) && 
             (rule.interval === 1 || Math.floor(this.weeksBetween(new Date(rule.freq === 'WEEKLY' ? '2026-01-01' : date), date)) % rule.interval === 0)
    }
    if (rule.freq === 'MONTHLY') {
      if (rule.byMonthDay) return date.getDate() === rule.byMonthDay
      if (rule.byDay && rule.byWeekNo) {
        const weekOfMonth = Math.ceil(date.getDate() / 7)
        return date.getDay() === rule.byDay[0] && weekOfMonth === rule.byWeekNo
      }
    }
    return false
  }

  private weeksBetween(start: Date, end: Date): number {
    const diff = end.getTime() - start.getTime()
    return Math.floor(diff / (7 * 24 * 60 * 60 * 1000))
  }

  async createEventBooking(data: any): Promise<EventBooking> {
    const db = getDatabase()
    const id = data.id || `ebk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const now = new Date().toISOString()

    const result = await db.queryOne<any>(
      `INSERT INTO event_bookings (
        id, event_id, occurrence_date,
        guest_name, guest_email, guest_phone, guest_count,
        ticket_tier_id, amount_usd, amount_naira, currency,
        status, payment_status, payment_reference, payment_method,
        approved_by, checked_in_at, checked_in_by,
        special_requests, source,
        created_at, updated_at
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22
      ) RETURNING *`,
      [
        id, data.eventId, data.occurrenceDate || null,
        data.guestName, data.guestEmail, data.guestPhone || null, data.guestCount || 1,
        data.ticketTierId || null, data.amountUSD || 0, data.amountNaira || 0, data.currency || 'NGN',
        data.status || 'confirmed', data.paymentStatus || 'free', data.paymentReference || null, data.paymentMethod || null,
        data.approvedBy || null, data.checkedInAt || null, data.checkedInBy || null,
        data.specialRequests || null, data.source || 'website',
        now, now,
      ]
    )
    return mapEventBooking(result)!
  }

  async fetchEventBookings(eventId: string, filters: BookingFilters = {}): Promise<EventBooking[]> {
    const db = getDatabase()
    let query = `SELECT * FROM event_bookings WHERE event_id = $1`
    const params: any[] = [eventId]

    if (filters.status) {
      query += ` AND status = $${params.length + 1}`
      params.push(filters.status)
    }
    if (filters.paymentStatus) {
      query += ` AND payment_status = $${params.length + 1}`
      params.push(filters.paymentStatus)
    }
    if (filters.dateFrom) {
      query += ` AND occurrence_date >= $${params.length + 1}`
      params.push(filters.dateFrom)
    }
    if (filters.dateTo) {
      query += ` AND occurrence_date <= $${params.length + 1}`
      params.push(filters.dateTo)
    }

    query += ` ORDER BY created_at DESC`

    if (filters.limit) {
      query += ` LIMIT $${params.length + 1}`
      params.push(filters.limit)
    }
    if (filters.offset) {
      query += ` OFFSET $${params.length + 1}`
      params.push(filters.offset)
    }

    const result = await db.query<any>(query, params)
    return result.rows.map(mapEventBooking).filter((e): e is EventBooking => e !== null)
  }

  async fetchBookingById(id: string): Promise<EventBooking | null> {
    const db = getDatabase()
    const booking = await db.queryOne<any>('SELECT * FROM event_bookings WHERE id = $1', [id])
    return mapEventBooking(booking)
  }

  async fetchBookingByReference(reference: string): Promise<EventBooking | null> {
    const db = getDatabase()
    const booking = await db.queryOne<any>('SELECT * FROM event_bookings WHERE id = $1', [reference])
    return mapEventBooking(booking)
  }

  async updateBookingStatus(id: string, status: string, approvedBy?: string): Promise<EventBooking | null> {
    const db = getDatabase()
    const now = new Date().toISOString()
    const result = await db.queryOne<any>(
      `UPDATE event_bookings SET status = $1, approved_by = COALESCE($2, approved_by), updated_at = $3 WHERE id = $4 RETURNING *`,
      [status, approvedBy || null, now, id]
    )
    return mapEventBooking(result)
  }

  async checkInBooking(id: string, checkedInBy: string): Promise<EventBooking | null> {
    const db = getDatabase()
    const now = new Date().toISOString()
    const result = await db.queryOne<any>(
      `UPDATE event_bookings SET status = 'attended', checked_in_at = $1, checked_in_by = $2, updated_at = $3 WHERE id = $4 RETURNING *`,
      [now, checkedInBy, now, id]
    )
    return mapEventBooking(result)
  }

  async cancelBooking(id: string): Promise<EventBooking | null> {
    return this.updateBookingStatus(id, 'cancelled')
  }

  async getEventStats(): Promise<EventStats> {
    const db = getDatabase()
    const now = new Date().toISOString().split('T')[0]

    const totalResult = await db.queryOne<any>('SELECT COUNT(*) as count FROM events')
    const upcomingResult = await db.queryOne<any>('SELECT COUNT(*) as count FROM events WHERE end_date >= $1 AND status != $2', [now, 'cancelled'])
    const pastResult = await db.queryOne<any>('SELECT COUNT(*) as count FROM events WHERE end_date < $1 AND status != $2', [now, 'cancelled'])
    const bookingsResult = await db.queryOne<any>('SELECT COUNT(*) as count FROM event_bookings WHERE status != $1', ['cancelled'])
    const revenueResult = await db.queryOne<any>('SELECT SUM(amount_usd) as usd, SUM(amount_naira) as naira FROM event_bookings WHERE payment_status = $1', ['paid'])

    return {
      totalEvents: totalResult?.count || 0,
      upcomingEvents: upcomingResult?.count || 0,
      pastEvents: pastResult?.count || 0,
      totalBookings: bookingsResult?.count || 0,
      totalRevenueUSD: revenueResult?.usd || 0,
      totalRevenueNaira: revenueResult?.naira || 0,
    }
  }
}

export default new EventRepository()