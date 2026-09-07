import type { AvailabilityItem, Room, SearchParams } from '../api/types'
import { nightsBetween, parseISO } from '../lib/dates'
import { ROOMS } from './seed/rooms'
import { db } from './db'

function overlaps(start: string, end: string, checkIn: string, checkOut: string): boolean {
  const s = parseISO(start).getTime()
  const e = parseISO(end).getTime()
  const ci = parseISO(checkIn).getTime()
  const co = parseISO(checkOut).getTime()
  return s < co && ci < e
}

function countBlockingUnits(checkIn: string, checkOut: string, roomId: string): number {
  const data = db.load()
  const bookingCount = data.bookings.filter(
    (b) => b.room.id === roomId && b.status !== 'Cancelled' && overlaps(b.stay.checkIn, b.stay.checkOut, checkIn, checkOut),
  ).length
  const blockCount = data.blocks.filter((b) => b.roomId === roomId && overlaps(b.start, b.end, checkIn, checkOut)).length
  return bookingCount + blockCount
}

export function checkAvailability(params: SearchParams): AvailabilityItem[] {
  const nights = nightsBetween(params.checkIn, params.checkOut)
  if (nights < 1) return []

  const results: AvailabilityItem[] = []
  for (const room of ROOMS) {
    const blocked = countBlockingUnits(params.checkIn, params.checkOut, room.id)
    const availableUnits = Math.max(0, room.units - blocked)
    if (availableUnits < 1) continue

    const total = room.pricePerNight * nights
    results.push({
      room,
      availableUnits,
      pricePerNight: room.pricePerNight,
      nights,
      total,
      taxEstimate: Math.round(total * 0.075),
    })
  }

  return results.sort((a, b) => a.pricePerNight - b.pricePerNight)
}

export function getRoom(slug: string): Room | undefined {
  return ROOMS.find((r) => r.slug === slug)
}

export function getRooms(): Room[] {
  return ROOMS
}