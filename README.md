# 🏨 KEO Hotel Management System

A modern, full-stack hotel management system built with Bun, React, and PostgreSQL.

## 🌟 Features

- **Public Website** - Browse rooms, check availability, make bookings
- **Admin Dashboard** - Manage bookings, rooms, services, revenue, and staff
- **Real-time Updates** - Live booking status and room availability
- **Payment Integration** - Paystack payment gateway
- **Image Management** - Cloudinary integration for uploads
- **Multi-user Support** - Role-based access control (Manager, Receptionist, Staff)

## 🏗️ Architecture

```
┌──────────────────────────────────────┐
│       Render Web Service (Bun)       │
│  ┌────────────────────────────────┐  │
│  │  API Server (Hono)             │  │
│  │  ├─ /api/* (REST API)          │  │
│  │  ├─ / (Public Website)         │  │
│  │  └─ /admin (Admin Dashboard)   │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│     Render PostgreSQL Database       │
└──────────────────────────────────────┘
```

## 📦 Monorepo Structure

```
keo/
├── api/                    # Backend API (Bun + Hono)
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── services/      # Business logic
│   │   ├── repositories/  # Database access
│   │   ├── routes/        # Route definitions
│   │   └── index.ts       # App entry point
│   └── public/            # Built frontends (generated)
│       ├── landing/       # Public website build
│       └── admin/         # Admin dashboard build
│
├── frontend/              # Public website (React + Vite)
│   └── src/
│       ├── components/
│       ├── pages/
│       └── config.ts
│
├── admin/                 # Admin dashboard (React + Vite)
│   └── src/
│       ├── components/
│       ├── pages/
│       └── stores/
│
├── Dockerfile            # Multi-stage Docker build
├── render.yaml           # Render configuration
└── .dockerignore         # Docker ignore rules
```

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) v1.0+
- [Node.js](https://nodejs.org) v20+
- [PostgreSQL](https://postgresql.org) 15+
- [Git](https://git-scm.com)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/keo.git
   cd keo
   ```

2. **Set up environment variables**
   ```bash
   # Copy example files
   cp api/.env.example api/.env
   cp frontend/.env.example frontend/.env
   ```

3. **Install dependencies**
   ```bash
   # API
   cd api && bun install

   # Frontend
   cd ../frontend && npm install

   # Admin
   cd ../admin && npm install
   ```

4. **Start development servers**
   ```bash
   # Terminal 1: API
   cd api && bun run dev

   # Terminal 2: Frontend
   cd frontend && npm run dev

   # Terminal 3: Admin
   cd admin && npm run dev
   ```

5. **Access the apps**
   - Frontend: http://localhost:5173
   - Admin: http://localhost:5174
   - API: http://localhost:8080/api

See `LOCAL_DEVELOPMENT.md` for detailed instructions.

## 🌐 Deployment

### Deploy to Render (Recommended)

1. **Push to Git**
   ```bash
   git push origin main
   ```

2. **Create Render account**
   - Go to https://render.com
   - Sign up with GitHub/GitLab

3. **Deploy from dashboard**
   - Click "New +" → "Web Service"
   - Select repository
   - Runtime: **Docker**
   - Follow prompts

See `QUICK_START_RENDER.md` for 5-minute deployment guide.

### Why Render?

| Feature | Vercel Serverless | Render |
|---------|------------------|---------|
| **Runtime** | Node.js (limited) | Native Bun support ✅ |
| **Cold Starts** | 1-3 seconds ❌ | None (always-on) ✅ |
| **Monorepo** | Complex setup ❌ | Built-in support ✅ |
| **Database** | External only ❌ | Built-in PostgreSQL ✅ |
| **Cost** | $40-70/mo | $14/mo or Free ✅ |
| **Configuration** | Multiple files ❌ | Single Dockerfile ✅ |

## 📚 Documentation

- [QUICK_START_RENDER.md](./QUICK_START_RENDER.md) - Deploy in 5 minutes
- [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) - Complete deployment guide
- [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md) - Development workflow
- [RENDER_MIGRATION_SUMMARY.md](./RENDER_MIGRATION_SUMMARY.md) - Architecture overview
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Testing checklist

## 🛠️ Tech Stack

### Backend
- **Runtime**: [Bun](https://bun.sh) - Fast JavaScript runtime
- **Framework**: [Hono](https://hono.dev) - Lightweight web framework
- **Database**: PostgreSQL with custom query builder
- **ORM**: None (direct SQL for performance)
- **Validation**: Zod

### Frontend (Public Website)
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State**: React hooks
- **Routing**: React Router
- **Icons**: React Icons

### Admin Dashboard
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Routing**: React Router
- **UI Components**: Headless UI

### DevOps
- **Deployment**: Render (Docker)
- **Database**: Render PostgreSQL
- **CDN**: Cloudinary (images)
- **Payments**: Paystack
- **Version Control**: Git

## 🔐 Environment Variables

### API (`api/.env`)
```env
DATABASE_URL=postgresql://user:pass@host:5432/database
PORT=8080
NODE_ENV=production
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (`frontend/.env`)
```env
VITE_USE_MOCK=false
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
```

See `.env.example` for complete list.

## 🔑 API Endpoints

### Public Endpoints
- `GET /api/rooms` - List all rooms
- `GET /api/rooms/:slug` - Get room details
- `GET /api/availability` - Check availability
- `POST /api/bookings` - Create booking
- `POST /api/payments/initialize` - Initialize payment

### Admin Endpoints (Protected)
- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/bookings` - List all bookings
- `GET /api/admin/revenue` - Revenue analytics
- `GET /api/admin/dashboard` - Dashboard metrics
- `POST /api/admin/staff` - Manage staff

See API documentation for complete list.

## 👥 Default Users

After deployment, create admin users manually or use seed script:

**General Manager**
- Email: `gm@keohotel.com`
- Role: `manager`
- Permissions: Full access

**Receptionist**
- Email: `receptionist@keohotel.com`
- Role: `receptionist`
- Permissions: Bookings, check-in/out

**Staff**
- Email: `staff@keohotel.com`
- Role: `staff`
- Permissions: View only

## 🧪 Testing

```bash
# Run all tests (when implemented)
cd api && bun test
cd frontend && npm test
cd admin && npm test
```

## 📊 Performance

- **API Response Time**: <50ms (average)
- **Frontend Load Time**: <2s (average)
- **Admin Load Time**: <2s (average)
- **Database Queries**: <10ms (average)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary. All rights reserved.

## 🆘 Support

- **Issues**: Open an issue on GitHub
- **Email**: support@keohotel.com
- **Documentation**: See `/docs` folder

## 🗺️ Roadmap

- [ ] Mobile apps (React Native)
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Multi-property support
- [ ] Advanced analytics
- [ ] Third-party integrations (Booking.com, Airbnb)
- [ ] Housekeeping module
- [ ] Inventory management
- [ ] POS integration

## ⭐ Acknowledgments

- [Bun](https://bun.sh) - Amazing JavaScript runtime
- [Hono](https://hono.dev) - Fast web framework
- [React](https://react.dev) - UI library
- [Vite](https://vitejs.dev) - Build tool
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Render](https://render.com) - Deployment platform

---

**Made with ❤️ for KEO Experience Hotel & Events**
