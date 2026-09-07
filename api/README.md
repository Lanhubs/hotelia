# KEO Hotel Management API

A robust, modular hotel management system API built with Hono.js and PostgreSQL.

## Features

- **Modular architecture** - Clean separation with controllers, services, repositories
- **PostgreSQL** - Raw queries for performance with Bun native driver
- **Authentication** - JWT-based auth for admin endpoints
- **Real-time availability** - Dynamic room availability and pricing
- **Booking management** - Full CRUD operations for guest bookings
- **Service orders** - Room service, spa, concierge order management
- **Revenue analytics** - Dashboard and reporting endpoints

## Tech Stack

- **Runtime**: Bun
- **Framework**: Hono.js
- **Database**: PostgreSQL
- **Structure**: Controller → Service → Repository pattern

## Setup

1. Install dependencies
```bash
bun install
```

2. Create `.env` from `.env.example`
```bash
cp .env.example .env
```

3. Start dev server
```bash
bun run dev
```

## API Structure

```
src/
├── index.ts              # Main app entry point
├── config.ts             # Configuration
├── database.ts           # DB connection & initialization
├── middleware.ts         # Auth & permissions
├── utils.ts              # Helper functions
├── controllers/          # Request handlers
│   ├── roomController.ts
│   ├── bookingController.ts
│   ├── serviceController.ts
│   ├── authController.ts
│   └── revenueController.ts
├── services/             # Business logic
│   ├── roomService.ts
│   ├── bookingService.ts
│   ├── serviceService.ts
│   ├── authService.ts
│   └── revenueService.ts
├── repositories/         # Data access
│   ├── roomRepository.ts
│   ├── bookingRepository.ts
│   ├── serviceRepository.ts
│   ├── authRepository.ts
│   └── revenueRepository.ts
└── routes/
    ├── index.ts
    └── admin/
        ├── auth.ts
        ├── bookings.ts
        ├── services.ts
        └── revenue.ts
```

## Environment Variables

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=keo
DB_PASSWORD=keo123
DB_NAME=keo_hotel
JWT_SECRET=your-secret-key
```

## License

MIT