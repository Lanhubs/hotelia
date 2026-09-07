export const TAX_RATE = 0.075

export const CATEGORIES = ['All', 'Suites', 'Apartments', 'Rooms'] as const

export const SERVICE_CATEGORIES = ['All', 'Dining', 'Wellness', 'Transport', 'Events'] as const

export function computeFinancials(
  room: { pricePerNight: number },
  search: { checkIn: string; checkOut: string; rooms: number },
  extras: Array<{ price: number; perNight?: boolean }>
) {
  const checkIn = new Date(search.checkIn)
  const checkOut = new Date(search.checkOut)
  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
  
  const roomTotal = room.pricePerNight * nights * search.rooms
  const extrasTotal = extras.reduce(
    (sum, e) => sum + (e.perNight ? e.price * nights : e.price),
    0
  )
  const taxAmount = Math.round((roomTotal + extrasTotal) * TAX_RATE)
  const totalAmount = roomTotal + extrasTotal + taxAmount
  return { nights, roomTotal, extrasTotal, taxAmount, totalAmount }
}
