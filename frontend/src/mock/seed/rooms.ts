import type { Room, RoomCategory } from '../../api/types'

export const img = (id: string, w = 1400, h = 1000): string =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&q=82&w=${w}&h=${h}`

export const ROOM_IMAGES: Record<string, string> = {
  bedroomWarm: img('photo-1611892440504-42a792e24d32'),
  bedroomLinen: img('photo-1590490360182-c33d57733427'),
  bedroomSun: img('photo-1566665797739-1674de7a421a'),
  bedroomSuite: img('photo-1578683010236-d716f9a3f461'),
  bedroomResort: img('photo-1582719478250-c89cae4dc85b'),
  bedroomMinimal: img('photo-1616627989153-c67c974f6de7'),
  bedroomGuest: img('photo-1615873968403-89e068629265'),
  livingApartment: img('photo-1522708323590-d24dbb6b0267'),
  livingMinimal: img('photo-1502672260266-1c1ef2d93688'),
  livingBright: img('photo-1600585154340-be6161a56a0c'),
  livingLounge: img('photo-1600210492486-724fe5c67fb0'),
  livingModern: img('photo-1600607687939-ce8a6c25118c'),
  bathroomTiles: img('photo-1600566753086-00f18fb6b3ea'),
  bathroomWash: img('photo-1584622650111-993a426fbf0a'),
  diningTable: img('photo-1544148103-0773bf10d330'),
  restaurant: img('photo-1414235077428-338989a2e8c0'),
  restaurantWarm: img('photo-1552566626-52f8b828add9'),
  foodPlate: img('photo-1504674900247-0877df9cc836'),
  eventWedding: img('photo-1519167758481-83f550bb49b3'),
  eventBallroom: img('photo-1464366400600-7168b8af9bc3'),
  eventStage: img('photo-1505373877841-8d25efa7aff0'),
  eventTables: img('photo-1492684223066-81342ee5ff30'),
  eventParty: img('photo-1511578314322-379afb476865'),
  conferenceRoom: img('photo-1530103862676-de8c9debad1d'),
  conferenceTable: img('photo-1540575467063-178a50c2df87'),
  lobbyLounge: img('photo-1551882547-ff40c63fe5fa'),
  loungeSofa: img('photo-1571003123894-1f0594d2b5d9'),
  courtyardPool: img('photo-1571896349842-33c89424de2d'),
}

const commonAmenities = [
  { id: 'ac', name: 'Air conditioning', icon: 'wind' },
  { id: 'wifi', name: 'High-speed WiFi', icon: 'wifi' },
  { id: 'tv', name: 'Flat-screen TV', icon: 'tv' },
  { id: 'bathroom', name: 'Private bathroom', icon: 'bath' },
  { id: 'hot-water', name: 'Hot water', icon: 'droplet' },
  { id: 'housekeeping', name: 'Daily housekeeping', icon: 'sparkles' },
]

export const ROOMS: Room[] = [
  {
    id: 'keo-premium',
    slug: 'keo-premium',
    name: 'KEO Premium',
    category: 'Single Room',
    tagline: 'A calm, private room for the solo traveller',
    description:
      'A restful single room with a comfortable bed, cool air and everything you need for a quiet stay in the heart of Ilorin.',
    overview:
      'KEO Premium rooms are designed for solo travellers who value calm and privacy. Each room offers a comfortable bed, an en-suite bathroom, air conditioning and a quiet setting for a restful night. Breakfast is served each morning in our courtyard.',
    pricePerNight: 60000,
    capacity: 1,
    bedType: 'Single bed',
    size: 16,
    floor: 'Ground – First floor',
    units: 5,
    image: ROOM_IMAGES.bedroomMinimal,
    gallery: [
      ROOM_IMAGES.bedroomMinimal,
      ROOM_IMAGES.bedroomWarm,
      ROOM_IMAGES.bathroomWash,
    ],
    amenities: [...commonAmenities, { id: 'breakfast', name: 'Complimentary breakfast', icon: 'coffee' }],
    features: ['Quiet courtyard access', 'Desk & reading light', 'Complimentary breakfast', 'Secure parking'],
  },
  {
    id: 'keo-luxury',
    slug: 'keo-luxury',
    name: 'KEO Luxury',
    category: 'Deluxe Room',
    tagline: 'A warm deluxe room for two, refined and considered',
    description:
      'A spacious deluxe room with a plush queen bed, generous natural light and thoughtful touches for a comfortable stay for two.',
    overview:
      'KEO Luxury rooms balance comfort and elegance. With a plush queen bed, soft linens, a modern bathroom and air conditioning, these rooms are perfect for couples and business travellers alike. Wake up to a complimentary breakfast in our courtyard.',
    pricePerNight: 75000,
    capacity: 2,
    bedType: 'Queen bed',
    size: 22,
    floor: 'First floor',
    units: 6,
    image: ROOM_IMAGES.bedroomSun,
    gallery: [
      ROOM_IMAGES.bedroomSun,
      ROOM_IMAGES.bedroomLinen,
      ROOM_IMAGES.bathroomTiles,
    ],
    amenities: [
      ...commonAmenities,
      { id: 'breakfast', name: 'Complimentary breakfast', icon: 'coffee' },
      { id: 'kettle', name: 'Tea & coffee station', icon: 'cup' },
    ],
    features: ['Plush queen bedding', 'Tea & coffee station', 'Complimentary breakfast', 'Quiet courtyard views'],
  },
  {
    id: 'deluxe-apartment',
    slug: 'deluxe-apartment',
    name: 'Deluxe Apartment',
    category: 'Deluxe Apartment',
    tagline: 'A spacious apartment with a separate living area',
    description:
      'Twenty square metres of well-planned space on the first floor, ideal for two adults seeking a quiet, relaxing stay.',
    overview:
      'Experience comfort, privacy and thoughtful design in the KEO Deluxe Apartment. Located on the first floor, this spacious apartment offers a comfortable double bed and a relaxed living arrangement for two adults. It is a favourite for guests who want more room to unwind.',
    pricePerNight: 150000,
    capacity: 2,
    bedType: 'Double bed + lounge',
    size: 20,
    floor: 'First floor',
    units: 4,
    image: ROOM_IMAGES.bedroomSuite,
    gallery: [
      ROOM_IMAGES.bedroomSuite,
      ROOM_IMAGES.livingApartment,
      ROOM_IMAGES.bathroomTiles,
      ROOM_IMAGES.bedroomWarm,
    ],
    amenities: [
      ...commonAmenities,
      { id: 'breakfast', name: 'Complimentary breakfast', icon: 'coffee' },
      { id: 'lounge', name: 'Separate lounge area', icon: 'sofa' },
      { id: 'kitchenette', name: 'Kitchenette', icon: 'utensils' },
    ],
    features: ['Separate lounge area', 'Kitchenette', 'Complimentary breakfast', 'First-floor privacy'],
  },
  {
    id: 'executive-deluxe-apartment',
    slug: 'executive-deluxe-apartment',
    name: 'KEO Executive Deluxe Apartment',
    category: 'Executive Deluxe Apartment',
    tagline: 'More space and added comforts for business and leisure',
    description:
      'An executive apartment with generous space, a proper working area and refined finishes for a longer, easier stay.',
    overview:
      'The KEO Executive Deluxe Apartment offers an elevated stay with more space, a comfortable working area and considered extras. It suits guests who travel for business or simply prefer a little more room and comfort, with breakfast included each morning.',
    pricePerNight: 180000,
    capacity: 3,
    bedType: 'Double bed + sofa bed',
    size: 28,
    floor: 'Second floor',
    units: 3,
    image: ROOM_IMAGES.bedroomWarm,
    gallery: [
      ROOM_IMAGES.bedroomWarm,
      ROOM_IMAGES.livingMinimal,
      ROOM_IMAGES.livingLounge,
      ROOM_IMAGES.bathroomWash,
    ],
    amenities: [
      ...commonAmenities,
      { id: 'breakfast', name: 'Complimentary breakfast', icon: 'coffee' },
      { id: 'workspace', name: 'Dedicated workspace', icon: 'briefcase' },
      { id: 'lounge', name: 'Separate lounge area', icon: 'sofa' },
    ],
    features: ['Dedicated workspace', 'Separate lounge area', 'Complimentary breakfast', 'Executive finishes'],
  },
  {
    id: 'exclusive-deluxe-apartment',
    slug: 'exclusive-deluxe-apartment',
    name: 'KEO Exclusive Deluxe Apartment',
    category: 'Exclusive Deluxe Apartment',
    tagline: 'Our largest stay, reserved for those who want the most of KEO',
    description:
      'The most generous apartment in the house, with a full lounge, dining space and the quiet confidence of our finest appointments.',
    overview:
      'The KEO Exclusive Deluxe Apartment is our largest and most considered accommodation. With a full lounge, dining area and premium appointments, it is made for families, extended stays and guests who simply want the fullest KEO experience. Breakfast is included throughout your stay.',
    pricePerNight: 250000,
    capacity: 4,
    bedType: 'Double bed + sofa bed',
    size: 34,
    floor: 'Second floor',
    units: 2,
    image: ROOM_IMAGES.livingBright,
    gallery: [
      ROOM_IMAGES.livingBright,
      ROOM_IMAGES.bedroomSuite,
      ROOM_IMAGES.livingModern,
      ROOM_IMAGES.bathroomTiles,
    ],
    amenities: [
      ...commonAmenities,
      { id: 'breakfast', name: 'Complimentary breakfast', icon: 'coffee' },
      { id: 'lounge', name: 'Full lounge area', icon: 'sofa' },
      { id: 'dining', name: 'Dining space', icon: 'utensils' },
      { id: 'workspace', name: 'Workspace', icon: 'briefcase' },
    ],
    features: ['Full lounge & dining space', 'Largest floor plan', 'Complimentary breakfast', 'Premium appointments'],
  },
]

export const CATEGORIES: RoomCategory[] = ['Single Room', 'Deluxe Room', 'Deluxe Apartment', 'Executive Deluxe Apartment', 'Exclusive Deluxe Apartment']