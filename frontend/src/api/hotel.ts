import { apiGet } from './client'
import type { HotelConfig } from './types'

export async function getHotel(): Promise<HotelConfig> {
  try {
    const res = await apiGet<any>('/hotel')
    if (res && res.contact) return res as HotelConfig
  } catch { /* ignore */ }

  return {
    contact: {
      phone: '+2348130148920',
      phoneDisplay: '+234 813 014 8920',
      email: 'booking@keoexperience.com',
      address: '54, Pipeline Road, Off Offa Garage Road',
      city: 'Ilorin, Kwara State, Nigeria',
      mapsQuery: 'KEO Experience Hotel, 54 Pipeline Road, Off Offa Garage Road, Ilorin, Kwara State, Nigeria',
    },
    payment: {
      provider: 'KEO Payment Partner',
      depositRate: 0.25,
    },
    policies: {
      checkInTime: '2:00 PM',
      checkOutTime: '12:00 PM',
      cancellation: 'Free cancellation up to 48 hours before check-in. Within 48 hours, the first night is charged.',
      payment: 'A deposit secures your reservation. Full payment is due at check-in unless otherwise arranged.',
      children: 'Children are welcome. Please include them in your guest count so we can prepare the right room.',
      guests: 'Rooms are reserved for the number of guests stated at booking. Additional guests can be arranged in advance.',
      pets: 'Pets are not permitted inside the property.',
    },
    nav: [
      { label: 'Home', to: '/' },
      { label: 'Stay', to: '/rooms' },
      { label: 'Experience', to: '/experience' },
      { label: 'Events', to: '/events' },
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
    ],
    testimonials: [
      {
        id: 't1',
        name: 'Adebayo',
        role: 'Business traveller',
        text: 'Quiet, clean and comfortable. Breakfast in the courtyard was a calm start to each day. I will stay here again.',
      },
      {
        id: 't2',
        name: 'Mrs. O.',
        role: 'Event host',
        text: 'We hosted our daughter’s celebration at KEO. The team carried every detail and our guests were well looked after.',
      },
      {
        id: 't3',
        name: 'Tunde',
        role: 'Weekend guest',
        text: 'The apartment was spacious and the staff were warm and attentive. Exactly what a stay in Ilorin should feel like.',
      },
    ],
    galleryCategories: ['Rooms', 'Interiors', 'Dining', 'Events', 'Outdoor'],
  }
}

export async function getGallery(): Promise<Record<string, string[]>> {
  try {
    const res = await apiGet<any>('/gallery')
    if (res && res.gallery && Object.keys(res.gallery).length > 0) return res.gallery
  } catch { /* ignore */ }

  const { ROOM_IMAGES, img } = await import('../lib/images')
  return {
    Rooms: [
      ROOM_IMAGES.bedroomWarm,
      ROOM_IMAGES.bedroomSun,
      ROOM_IMAGES.bedroomSuite,
      ROOM_IMAGES.bedroomMinimal,
      ROOM_IMAGES.bedroomGuest,
      ROOM_IMAGES.bedroomResort,
    ],
    Interiors: [
      ROOM_IMAGES.livingApartment,
      ROOM_IMAGES.livingMinimal,
      ROOM_IMAGES.livingBright,
      ROOM_IMAGES.livingLounge,
      ROOM_IMAGES.livingModern,
      ROOM_IMAGES.bathroomTiles,
    ],
    Dining: [
      img('photo-1414235077428-338989a2e8c0'),
      img('photo-1504674900247-0877df9cc836'),
      img('photo-1552566626-52f8b828add9'),
      img('photo-1544148103-0773bf10d330'),
    ],
    Events: [
      ROOM_IMAGES.eventWedding,
      ROOM_IMAGES.eventBallroom,
      ROOM_IMAGES.eventTables,
      ROOM_IMAGES.eventParty,
    ],
    Outdoor: [
      ROOM_IMAGES.courtyardPool,
      ROOM_IMAGES.lobbyLounge,
      ROOM_IMAGES.loungeSofa,
    ],
  }
}