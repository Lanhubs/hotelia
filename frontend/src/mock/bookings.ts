import type { Booking, GuestInfo, Room, SearchParams, Extra, PaymentMethod } from '../api/types'
import { nightsBetween } from '../lib/dates'
import { TAX_RATE } from './seed/hotel'
import { db } from './db'

export interface CreateBookingInput {
  search: SearchParams
  room: Room
  guest: GuestInfo
  extras: Extra[]
}

export function computeFinancials(room: Room, search: SearchParams, extras: Extra[]) {
  const nights = nightsBetween(search.checkIn, search.checkOut)
  const roomTotal = room.pricePerNight * nights * search.rooms
  const extrasTotal = extras.reduce(
    (sum, e) => sum + (e.perNight ? e.price * nights : e.price),
    0,
  )
  const taxAmount = Math.round((roomTotal + extrasTotal) * TAX_RATE)
  const totalAmount = roomTotal + extrasTotal + taxAmount
  return { nights, roomTotal, extrasTotal, taxAmount, totalAmount }
}

export function createBooking(input: CreateBookingInput): Booking {
  const nights = nightsBetween(input.search.checkIn, input.search.checkOut)
  const fin = computeFinancials(input.room, input.search, input.extras)
  const booking: Booking = {
    id: `b-${Date.now()}`,
    reference: db.reference(),
    guest: input.guest,
    room: {
      id: input.room.id,
      name: input.room.name,
      slug: input.room.slug,
      category: input.room.category,
      image: input.room.image,
    },
    stay: {
      checkIn: input.search.checkIn,
      checkOut: input.search.checkOut,
      nights,
      adults: input.search.adults,
      children: input.search.children,
      rooms: input.search.rooms,
    },
    extras: input.extras.map((e) => ({
      id: e.id,
      name: e.name,
      price: e.perNight ? e.price * nights : e.price,
      perNight: e.perNight,
    })),
    financials: {
      nights,
      roomTotal: fin.roomTotal,
      extrasTotal: fin.extrasTotal,
      taxAmount: fin.taxAmount,
      totalAmount: fin.totalAmount,
      amountPaid: 0,
      balanceDue: fin.totalAmount,
      depositAmount: 0,
      currency: 'NGN',
    },
    status: 'Pending',
    paymentMethod: null,
    paymentState: 'pending',
    depositPaid: false,
    createdAt: new Date().toISOString(),
  }

  db.mutate((d) => {
    d.bookings.unshift(booking)
  })
  return booking
}

export function setPaymentMethod(
  reference: string,
  method: PaymentMethod,
  depositAmount = 0,
): Booking | undefined {
  const data = db.load()
  const booking = data.bookings.find((b) => b.reference.toLowerCase() === reference.toLowerCase())
  if (!booking) return undefined

  booking.paymentMethod = method
  if (method === 'pay_at_hotel') {
    booking.status = 'Confirmed'
    booking.paymentState = 'pay_at_hotel'
    booking.depositPaid = depositAmount > 0
    booking.financials.depositAmount = depositAmount
    booking.financials.amountPaid = depositAmount
    booking.financials.balanceDue = booking.financials.totalAmount - depositAmount
    booking.paidAt = depositAmount > 0 ? new Date().toISOString() : undefined
  } else {
    booking.paymentState = 'pending'
    booking.status = 'Pending'
  }
  db.save(data)
  return booking
}

export function findBooking(reference: string, email?: string, phone?: string): Booking | undefined {
  const data = db.load()
  const match = data.bookings.find((b) => b.reference.toLowerCase() === reference.toLowerCase())
  if (!match) return undefined
  if (email && match.guest.email.toLowerCase() !== email.toLowerCase()) return undefined
  if (phone && match.guest.phone.replace(/\D/g, '') !== phone.replace(/\D/g, '')) return undefined
  return match
}

export function cancelBooking(reference: string, _reason?: string): Booking | undefined {
  const data = db.load()
  const booking = data.bookings.find((b) => b.reference.toLowerCase() === reference.toLowerCase())
  if (!booking) return undefined
  booking.status = 'Cancelled'
  booking.financials.balanceDue = 0
  db.save(data)
  return booking
}