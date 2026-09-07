import type { Booking, PaymentState, PaymentMethod } from '../api/types'
import { addDaysISO, todayISO } from '../lib/dates'

const DB_KEY = 'keo_mock_db_v1'

export interface PaymentRecord {
  reference: string
  amount: number
  gateway: string
  method: PaymentMethod
  outcome: PaymentState
  bookingReference?: string
  createdAt: string
}

export interface SeedBlock {
  roomId: string
  start: string
  end: string
}

interface MockDB {
  bookings: Booking[]
  payments: PaymentRecord[]
  blocks: SeedBlock[]
}

function createReference(): string {
  const n = Math.floor(100000 + Math.random() * 900000)
  return `KEO-${n}`
}

function seedBooking(): Booking {
  const checkIn = addDaysISO(todayISO(), -40)
  return {
    id: `b-seed-1`,
    reference: 'KEO-482913',
    guest: {
      fullName: 'Fatima Bello',
      email: 'fatima.bello@example.com',
      phone: '+234 803 555 0192',
      specialRequest: 'Early check-in if available.',
    },
    room: {
      id: 'keo-luxury',
      name: 'KEO Luxury',
      slug: 'keo-luxury',
      category: 'Deluxe Room',
      image: '',
    },
    stay: {
      checkIn,
      checkOut: addDaysISO(checkIn, 3),
      nights: 3,
      adults: 2,
      children: 0,
      rooms: 1,
    },
    extras: [{ id: 'breakfast', name: 'Breakfast', price: 0, perNight: false }],
    financials: {
      nights: 3,
      roomTotal: 225000,
      extrasTotal: 0,
      taxAmount: 16875,
      totalAmount: 241875,
      amountPaid: 241875,
      balanceDue: 0,
      depositAmount: 0,
      currency: 'NGN',
    },
    status: 'Confirmed',
    paymentMethod: 'card',
    paymentState: 'success',
    depositPaid: false,
    paidAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }
}

function seedBlocks(): SeedBlock[] {
  const t = todayISO()
  return [
    { roomId: 'keo-premium', start: addDaysISO(t, 2), end: addDaysISO(t, 4) },
    { roomId: 'keo-luxury', start: addDaysISO(t, 3), end: addDaysISO(t, 6) },
    { roomId: 'deluxe-apartment', start: addDaysISO(t, 5), end: addDaysISO(t, 8) },
    { roomId: 'exclusive-deluxe-apartment', start: addDaysISO(t, 1), end: addDaysISO(t, 3) },
  ]
}

function emptyDB(): MockDB {
  return { bookings: [seedBooking()], payments: [], blocks: seedBlocks() }
}

function loadDB(): MockDB {
  try {
    const raw = localStorage.getItem(DB_KEY)
    if (raw) return JSON.parse(raw) as MockDB
  } catch {
    /* corrupted storage — reseed */
  }
  const db = emptyDB()
  localStorage.setItem(DB_KEY, JSON.stringify(db))
  return db
}

export const db = {
  load(): MockDB {
    return loadDB()
  },
  save(data: MockDB): void {
    localStorage.setItem(DB_KEY, JSON.stringify(data))
  },
  mutate(update: (db: MockDB) => void): MockDB {
    const current = loadDB()
    update(current)
    this.save(current)
    return current
  },
  reference: createReference,
}

export const seedBookings = () => [seedBooking()]