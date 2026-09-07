import type { HttpOptions } from '../api/client'
import type { PaymentMethod } from '../api/types'
import { getRooms, getRoom, checkAvailability } from './availability'
import { SERVICES } from './seed/services'
import { EVENT_SPACES } from './seed/events'
import { HOTEL_CONFIG, GALLERY_IMAGES } from './seed/hotel'
import { EXTRAS } from './seed/extras'
import { createBooking, findBooking, cancelBooking, setPaymentMethod } from './bookings'
import { initPayment, simulatePayment, verifyPayment, confirmTransfer } from './payments'
import { db } from './db'

const delay = (ms = 320) => new Promise((resolve) => setTimeout(resolve, ms))

function parsePath(path: string): string[] {
  return path.split('/').filter(Boolean)
}

export async function mockRequest<T>(path: string, options: HttpOptions = {}): Promise<T> {
  await delay()
  const segments = parsePath(path)
  const [resource, param] = segments

  switch (resource) {
    case 'rooms':
      if (param) return getRoom(param) as T
      return getRooms() as T

    case 'availability':
      return checkAvailability({
        checkIn: String(options.params?.checkIn),
        checkOut: String(options.params?.checkOut),
        adults: Number(options.params?.adults) || 2,
        children: Number(options.params?.children) || 0,
        rooms: Number(options.params?.rooms) || 1,
      }) as T

    case 'services':
      if (param) return SERVICES.find((s) => s.slug === param) as T
      return SERVICES as T

    case 'events':
      if (param) return EVENT_SPACES.find((e) => e.slug === param) as T
      return EVENT_SPACES as T

    case 'hotel':
      return HOTEL_CONFIG as T

    case 'extras':
      return EXTRAS as T

    case 'gallery':
      return GALLERY_IMAGES as T

    case 'bookings':
      if (segments.length >= 3) {
        const ref = decodeURIComponent(param)
        if (segments[2] === 'payment-method') {
          const body = (options.body ?? {}) as { method?: PaymentMethod; depositAmount?: number }
          return setPaymentMethod(ref, body.method ?? 'card', Number(body.depositAmount) || 0) as T
        }
        if (segments[2] === 'confirm-transfer') {
          confirmTransfer(ref)
          return findBooking(ref) as T
        }
        return findBooking(ref) as T
      }
      return createBooking(options.body as never) as T

    case 'reservations': {
      const reference = decodeURIComponent(param)
      const email = options.params?.email ? String(options.params.email) : undefined
      const phone = options.params?.phone ? String(options.params.phone) : undefined
      if (segments.length >= 3 && segments[2] === 'cancel') {
        return cancelBooking(reference) as T
      }
      return findBooking(reference, email, phone) as T
    }

    case 'payments': {
      const ref = decodeURIComponent(param)
      const body = (options.body ?? {}) as {
        amount?: number
        outcome?: never
        bookingReference?: string
        method?: PaymentMethod
      }
      if (param === 'initialize') {
        return initPayment(
          String(body.bookingReference ?? ''),
          Number(body.amount) || 0,
          (body.method as PaymentMethod) ?? 'card',
        ) as T
      }
      if (segments.length >= 3 && segments[2] === 'simulate' && body.outcome) {
        simulatePayment(ref, body.outcome)
        return undefined as T
      }
      if (segments.length >= 3 && segments[2] === 'verify') {
        return verifyPayment(ref) as T
      }
      return initPayment(ref, Number(body.amount) || 0, (body.method as PaymentMethod) ?? 'card') as T
    }

    default:
      return undefined as T
  }
}

export { db as mockDB }