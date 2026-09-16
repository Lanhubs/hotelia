import { apiGet } from './client'
import type { Room } from './types'

export function getRooms(): Promise<Room[]> {
  return apiGet<Room[]>('/rooms')
}

export function getRoom(slug: string): Promise<Room> {
  return apiGet<Room>(`/rooms/${encodeURIComponent(slug)}`)
}

export interface RoomAvailabilityResult {
  available: boolean
  availableUnits: number
  roomId: string
  roomName: string
}

export function getRoomAvailability(
  slug: string,
  checkIn: string,
  checkOut: string
): Promise<RoomAvailabilityResult> {
  return apiGet<RoomAvailabilityResult>(
    `/rooms/${encodeURIComponent(slug)}/availability?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}`
  )
}