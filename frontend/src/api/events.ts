import { apiGet, apiPost } from './client'
import type { Event, EventBooking } from './types'

export async function getEvents(): Promise<Event[]> {
  try {
    const res = await apiGet<any>('/events')
    if (Array.isArray(res) && res.length > 0) return res as Event[]
  } catch { /* ignore */ }
  return []
}

export async function getEvent(slug: string): Promise<Event> {
  try {
    const res = await apiGet<any>(`/events/${encodeURIComponent(slug)}`)
    if (res && res.slug) return res as Event
  } catch { /* ignore */ }
  const events = await getEvents()
  const match = events.find((e) => e.slug.toLowerCase() === slug.toLowerCase())
  if (!match) throw new Error('Event not found')
  return match
}

export async function createEventBooking(eventId: string, data: Partial<EventBooking>): Promise<EventBooking> {
  const res = await apiPost<EventBooking>(`/events/${eventId}/book`, data)
  return res
}

export async function getEventBooking(reference: string): Promise<EventBooking> {
  const res = await apiGet<EventBooking>(`/events/bookings/${encodeURIComponent(reference)}`)
  return res
}

export async function cancelEventBooking(reference: string): Promise<EventBooking> {
  const res = await apiPost<EventBooking>(`/events/bookings/${encodeURIComponent(reference)}/cancel`, {})
  return res
}