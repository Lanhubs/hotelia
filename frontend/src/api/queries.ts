export const queryKeys = {
  rooms: ['rooms'] as const,
  room: (slug: string) => ['rooms', slug] as const,
  availability: (params: string) => ['availability', params] as const,
  services: ['services'] as const,
  service: (slug: string) => ['services', slug] as const,
  events: ['events'] as const,
  event: (slug: string) => ['events', slug] as const,
  hotel: ['hotel'] as const,
  extras: ['extras'] as const,
  gallery: ['gallery'] as const,
  reservation: (reference: string) => ['reservation', reference] as const,
  payment: (reference: string) => ['payment', reference] as const,
}