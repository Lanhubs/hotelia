const env = import.meta.env as {
  VITE_API_URL?: string
  VITE_USE_MOCK?: string
  VITE_PAYSTACK_PUBLIC_KEY?: string
}

export const config = {
  useMock: env.VITE_USE_MOCK === 'true',  // false by default — use real API
  apiBaseUrl:  '/api',
  paystackPublicKey: env.VITE_PAYSTACK_PUBLIC_KEY || '',
  hotelName: 'KEO Experience Hotel & Events',
  tagline: 'Refined Stays, Remarkable Events',
  strapline: 'Stay well. Celebrate better.',
}

export const isMock = () => config.useMock