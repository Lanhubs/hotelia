import { apiGet } from './client'
import type { EventSpace } from './types'

export async function getEvents(): Promise<EventSpace[]> {
  try {
    const res = await apiGet<any>('/events')
    if (Array.isArray(res) && res.length > 0) return res as EventSpace[]
  } catch { /* ignore */ }

  const { ROOM_IMAGES } = await import('../lib/images')
  return [
    {
      id: 'evt-grand-hall',
      slug: 'grand-ballroom',
      name: 'The Grand Hall',
      category: 'Ballroom & Celebrations',
      description: 'A soaring multi-functional hall designed for weddings, banquets and milestone celebrations.',
      capacity: 350,
      image: ROOM_IMAGES.eventBallroom,
      gallery: [ROOM_IMAGES.eventBallroom, ROOM_IMAGES.eventWedding, ROOM_IMAGES.eventTables],
      layouts: ['Banquet', 'Theatre', 'Reception'],
      facilities: ['Air Conditioning', 'Banquet Seating', 'Stage & Lighting', 'Private Prep Rooms'],
    },
    {
      id: 'evt-courtyard',
      slug: 'courtyard-garden',
      name: 'The Courtyard Garden',
      category: 'Outdoor & Reception',
      description: 'An intimate open-air courtyard surrounded by lush greenery and warm night lighting.',
      capacity: 150,
      image: ROOM_IMAGES.courtyardPool,
      gallery: [ROOM_IMAGES.courtyardPool, ROOM_IMAGES.eventParty],
      layouts: ['Standing', 'Outdoor Seating'],
      facilities: ['Ambient Lighting', 'Outdoor Bar', 'Sound System', 'Garden Seating'],
    },
    {
      id: 'evt-executive-suite',
      slug: 'executive-boardroom',
      name: 'Executive Boardroom',
      category: 'Corporate & Meetings',
      description: 'A private conference environment outfitted for executive meetings and workshops.',
      capacity: 25,
      image: ROOM_IMAGES.conferenceRoom,
      gallery: [ROOM_IMAGES.conferenceRoom],
      layouts: ['Boardroom', 'U-Shape'],
      facilities: ['Video Conferencing', 'Fiber Wi-Fi', 'Coffee Station', 'Whiteboard'],
    },
  ]
}

export async function getEvent(slug: string): Promise<EventSpace> {
  try {
    const res = await apiGet<any>(`/events/${encodeURIComponent(slug)}`)
    if (res && res.slug) return res as EventSpace
  } catch { /* ignore */ }

  const events = await getEvents()
  const match = events.find((e) => e.slug.toLowerCase() === slug.toLowerCase())
  if (!match) throw new Error('Event space not found')
  return match
}