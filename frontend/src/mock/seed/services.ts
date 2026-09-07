import type { Service } from '../../api/types'
import { img, ROOM_IMAGES } from './rooms'

const restaurant = img('photo-1414235077428-338989a2e8c0')
const food = img('photo-1504674900247-0877df9cc836')
const transport = img('photo-1449965408869-eaa3f722e40d')
const laundry = img('photo-1517677208171-0bc6725a3e60')
const bar = img('photo-1566417713940-fe7c737a9ef2')
const lounge = img('photo-1551882547-ff40c63fe5fa')
const roomService = img('photo-1520437358207-323b43b50729')
const meeting = img('photo-1540575467063-178a50c2df87')

export const SERVICES: Service[] = [
  {
    id: 'restaurant',
    slug: 'restaurant',
    name: 'Restaurant & Dining',
    category: 'Dining',
    description:
      'Our kitchen serves warm, considered meals throughout the day — from hearty breakfasts to relaxed dinners, prepared fresh and served with care.',
    image: restaurant,
    available: true,
    requestable: false,
  },
  {
    id: 'breakfast',
    slug: 'complimentary-breakfast',
    name: 'Complimentary Breakfast',
    category: 'Dining',
    description:
      'Every stay at KEO begins with breakfast in the quiet of our courtyard — a calm start to the day, included with your room.',
    image: food,
    priceLabel: 'Included with your stay',
    available: true,
    requestable: false,
  },
  {
    id: 'airport-pickup',
    slug: 'airport-pickup',
    name: 'Airport Pickup',
    category: 'Transport',
    description:
      'Arrive in Ilorin and let us meet you. Arrange a comfortable, reliable transfer from the airport directly to KEO.',
    image: transport,
    available: true,
    requestable: true,
  },
  {
    id: 'bar-lounge',
    slug: 'bar-and-lounge',
    name: 'Bar & Lounge',
    category: 'Dining',
    description:
      'An easy, unhurried lounge for drinks and conversation — a relaxed space to end your day or catch up with guests.',
    image: bar,
    available: true,
    requestable: false,
  },
  {
    id: 'laundry',
    slug: 'laundry-service',
    name: 'Laundry Service',
    category: 'Convenience',
    description:
      'Practical laundry care during your stay, so you can travel lighter and stay longer, comfortably.',
    image: laundry,
    available: true,
    requestable: true,
  },
  {
    id: 'room-service',
    slug: 'room-service',
    name: 'Room Service',
    category: 'Hospitality',
    description:
      'Meals and refreshments delivered to your room, so you can enjoy KEO hospitality without leaving your space.',
    image: roomService,
    available: true,
    requestable: true,
  },
  {
    id: 'meeting-space',
    slug: 'meeting-and-conference',
    name: 'Meeting & Conference Space',
    category: 'Events',
    description:
      'Focused, private space for meetings, workshops and corporate sessions, supported by our events team.',
    image: meeting,
    available: true,
    requestable: true,
  },
  {
    id: 'event-hosting',
    slug: 'event-hosting',
    name: 'Event Hosting',
    category: 'Events',
    description:
      'Weddings, private celebrations and gatherings — our venue and team host meaningful occasions from start to finish.',
    image: ROOM_IMAGES.eventBallroom,
    available: true,
    requestable: true,
  },
  {
    id: 'lounge-access',
    slug: 'lounge-and-courtyard',
    name: 'Lounge & Courtyard',
    category: 'Wellness',
    description:
      'Quiet corners and open air — a courtyard, lounge seating and a place to simply sit and breathe during your stay.',
    image: lounge,
    available: true,
    requestable: false,
  },
]

export const SERVICE_CATEGORIES = ['Dining', 'Transport', 'Events', 'Convenience', 'Hospitality', 'Wellness']