export const config = {
  port: Number(Bun.env.PORT) || 3000,
  db: {
    host: Bun.env.DB_HOST || 'localhost',
    port: Number(Bun.env.DB_PORT) || 5432,
    user: Bun.env.DB_USER || 'keo',
    password: Bun.env.DB_PASSWORD || 'keo123',
    database: Bun.env.DB_NAME || 'keo_hotel',
    connectionString: Bun.env.CONNECTION_STRING!,
  },
  jwtSecret: Bun.env.JWT_SECRET || 'your-secret-key-change-in-production',
  taxRate: 0.075,       // 7.5% VAT
  serviceCharge: 0.10,  // 10% service charge
  depositRate: 0.25,    // 25% deposit for online bookings
  maxFiles: 5,
  maxFileSize: 5 * 1024 * 1024,
  // Paystack
  paystackSecretKey: Bun.env.PAYSTACK_KEY || '',
  paystackBaseUrl: 'https://api.paystack.co',
  // Cloudinary Credentials
  cloudinary: {
    cloudName: Bun.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: Bun.env.CLOUDINARY_API_KEY || '',
    apiSecret: Bun.env.CLOUDINARY_API_SECRET || '',
  },
  // Frontend URL (for Paystack callback redirect)
  frontendUrl: Bun.env.FRONTEND_URL || 'http://localhost:5173',
}