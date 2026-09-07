export const hotelJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Hotel',
  name: 'KEO Experience Hotel & Events',
  description: 'A premium boutique hotel and event destination in Ilorin, Kwara State, Nigeria.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '54, Pipeline Road, Off Offa Garage Road',
    addressLocality: 'Ilorin',
    addressRegion: 'Kwara State',
    addressCountry: 'NG',
  },
  telephone: '+2348130148920',
  priceRange: '₦60,000 – ₦250,000',
} as const