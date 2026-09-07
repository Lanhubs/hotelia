import type { EventSpace } from '../../api/types'
import { img, ROOM_IMAGES } from './rooms'

const wedding = img('photo-1519167758481-83f550bb49b3')
const ballroom = img('photo-1464366400600-7168b8af9bc3')
const conference = img('photo-1530103862676-de8c9debad1d')
const party = img('photo-1511578314322-379afb476865')

export const EVENT_SPACES: EventSpace[] = [
  {
    id: 'weddings',
    slug: 'weddings',
    name: 'Weddings & Receptions',
    category: 'Celebration',
    description:
      'Your wedding day, hosted with care. From the ceremony to the reception, our venue and team carry the details so you can enjoy the moment.',
    image: wedding,
    gallery: [wedding, ballroom, ROOM_IMAGES.eventTables],
    capacity: null,
    layouts: ['Ceremony & reception', 'Indoor reception', 'Courtyard celebration'],
    facilities: ['Dedicated events team', 'Sound & lighting', 'Catering', 'Parking'],
  },
  {
    id: 'private-celebrations',
    slug: 'private-celebrations',
    name: 'Private Celebrations',
    category: 'Celebration',
    description:
      'Birthdays, anniversaries and family gatherings — private space and attentive service for the occasions that matter to you.',
    image: party,
    gallery: [party, ROOM_IMAGES.eventTables, ROOM_IMAGES.eventParty],
    capacity: null,
    layouts: ['Seated dinner', 'Standing reception', 'Intimate lounge'],
    facilities: ['Flexible setup', 'Catering', 'Decor support', 'Parking'],
  },
  {
    id: 'corporate-events',
    slug: 'corporate-events',
    name: 'Corporate Events & Meetings',
    category: 'Business',
    description:
      'Meetings, workshops and company events in focused, comfortable spaces — supported by our team and ready when you are.',
    image: conference,
    gallery: [conference, ROOM_IMAGES.eventStage, ROOM_IMAGES.loungeSofa],
    capacity: null,
    layouts: ['Boardroom', 'Classroom', 'Theatre', 'Workshop'],
    facilities: ['AV support', 'High-speed WiFi', 'Breakout space', 'Catering'],
  },
  {
    id: 'social-gatherings',
    slug: 'social-gatherings',
    name: 'Social Gatherings',
    category: 'Celebration',
    description:
      'Engagements, naming ceremonies and friendly get-togethers — a welcoming venue for good company and shared moments.',
    image: ROOM_IMAGES.eventTables,
    gallery: [ROOM_IMAGES.eventTables, ballroom, party],
    capacity: null,
    layouts: ['Reception', 'Buffet dinner', 'Open celebration'],
    facilities: ['Event coordination', 'Catering', 'Sound system', 'Parking'],
  },
]