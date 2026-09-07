import type { Extra } from '../../api/types'

export const EXTRAS: Extra[] = [
  {
    id: 'airport-pickup',
    slug: 'airport-pickup',
    name: 'Airport Pickup',
    description: 'A comfortable, reliable transfer from Ilorin airport to KEO.',
    price: 20000,
    perNight: false,
    icon: 'car',
  },
  {
    id: 'extra-bed',
    slug: 'extra-bed',
    name: 'Extra Bed',
    description: 'An additional bed for an extra guest in select rooms.',
    price: 15000,
    perNight: true,
    icon: 'bed',
  },
  {
    id: 'laundry',
    slug: 'laundry',
    name: 'Laundry Service',
    description: 'Laundry and pressing for your stay, arranged at reception.',
    price: 10000,
    perNight: false,
    icon: 'shirt',
  },
  {
    id: 'private-dining',
    slug: 'private-dining',
    name: 'Private Dining Setup',
    description: 'A reserved table with a personal setup for a special occasion.',
    price: 25000,
    perNight: false,
    icon: 'utensils',
  },
]