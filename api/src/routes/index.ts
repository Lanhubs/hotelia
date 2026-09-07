import { Hono } from 'hono'
import roomController from '../controllers/roomController'
import serviceController from '../controllers/serviceController'
import publicBookingController from '../controllers/publicBookingController'
import publicPaymentController from '../controllers/publicPaymentController'
import adminAuthRouter from './admin/auth'
import adminBookingRouter from './admin/bookings'
import adminRevenueRouter from './admin/revenue'
import adminServicesRouter from './admin/services'
import adminSettingsRouter from './admin/settings'
import adminDashboardRouter from './admin/dashboard'
import adminStaffRouter from './admin/staff'
import { rateLimit } from '../middlewares/rateLimit'
import uploadController from '../controllers/uploadController'

const router = new Hono()

router.post('/upload/cloudinary', uploadController.upload)

router.get('/', (c) =>
  c.json({ service: 'KEO Hotel Management API', version: '1.0.0', status: 'running' })
)

// ── Rooms (public) ─────────────────────────────────────────────────────────
router.get('/rooms', roomController.fetchRooms)
router.get('/rooms/:slug', roomController.fetchRoom)
router.get('/availability', roomController.fetchAvailability)

// ── Rooms (admin CRUD) ─────────────────────────────────────────────────────
router.post('/rooms', roomController.createRoom)
router.put('/rooms/:id', roomController.updateRoom)
router.delete('/rooms/:id', roomController.deleteRoom)

// ── Services (public) ──────────────────────────────────────────────────────
router.get('/services', serviceController.getServiceMenu)
router.get('/services/:slug', serviceController.getService)

// ── Extras (public) ────────────────────────────────────────────────────────
router.get('/extras', publicBookingController.getExtras)

// ── Public bookings ────────────────────────────────────────────────────────
router.post('/bookings', rateLimit(5, 60_000), publicBookingController.createBooking)
router.get('/reservations/:reference', publicBookingController.getReservation)
router.post('/reservations/:reference/cancel', publicBookingController.cancelReservation)
router.post('/bookings/:reference/payment-method', publicBookingController.setPaymentMethod)

// ── Payments (public) ──────────────────────────────────────────────────────
router.post('/payments/initialize', rateLimit(10, 60_000), publicPaymentController.initialize)
router.get('/payments/:reference/verify', publicPaymentController.verify)
router.post('/payments/webhook', publicPaymentController.webhook)
router.post('/payments/:reference/confirm-transfer', publicPaymentController.confirmTransfer)
router.post('/payments/charge', rateLimit(10, 60_000), publicPaymentController.charge)
router.post('/payments/submit-pin', publicPaymentController.submitPin)
router.post('/payments/submit-otp', publicPaymentController.submitOtp)
router.post('/payments/submit-phone', publicPaymentController.submitPhone)
router.post('/payments/submit-birthday', publicPaymentController.submitBirthday)

// ── Misc ───────────────────────────────────────────────────────────────────
router.get('/hotel', async (c) => c.json({ hotel: 'KEO Experience Hotel' }))
router.get('/gallery', async (c) => c.json({ gallery: [] }))

// ── Admin routes ───────────────────────────────────────────────────────────
router.route('/admin/auth', adminAuthRouter)
router.route('/admin/bookings', adminBookingRouter)
router.route('/admin/revenue', adminRevenueRouter)
router.route('/admin/services', adminServicesRouter)
router.route('/admin/settings', adminSettingsRouter)
router.route('/admin/dashboard', adminDashboardRouter)
router.route('/admin/staff', adminStaffRouter)

export default router