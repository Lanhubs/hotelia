import { apiGet, apiPost } from './client'
import type { Booking, Extra, GuestInfo, PaymentMethod, Room, SearchParams } from './types'

export interface CreateBookingPayload {
  search: SearchParams
  room: Room
  guest: GuestInfo
  extras: Extra[]
}

export function getExtras(): Promise<Extra[]> {
  return apiGet<Extra[]>('/extras')
}

export function createBooking(payload: CreateBookingPayload, idempotencyKey?: string): Promise<Booking> {
  return apiPost<Booking>('/bookings', payload, idempotencyKey)
}

export function getReservation(reference: string, email?: string, phone?: string): Promise<Booking | null> {
  return apiGet<Booking | null>(`/reservations/${encodeURIComponent(reference)}`, { email, phone })
}

export function cancelReservation(reference: string): Promise<Booking | null> {
  return apiPost<Booking | null>(`/reservations/${encodeURIComponent(reference)}/cancel`, {})
}

export function setBookingPaymentMethod(
  reference: string,
  method: PaymentMethod,
  depositAmount?: number,
): Promise<Booking | null> {
  return apiPost<Booking | null>(`/bookings/${encodeURIComponent(reference)}/payment-method`, {
    method,
    depositAmount,
  })
}

export function confirmTransfer(reference: string): Promise<Booking | null> {
  return apiPost<Booking | null>(`/payments/${encodeURIComponent(reference)}/confirm-transfer`, {})
}