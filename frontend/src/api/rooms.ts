import { apiGet } from './client'
import type { Room } from './types'

export function getRooms(): Promise<Room[]> {
  return apiGet<Room[]>('/rooms')
}

export function getRoom(slug: string): Promise<Room> {
  return apiGet<Room>(`/rooms/${encodeURIComponent(slug)}`)
}