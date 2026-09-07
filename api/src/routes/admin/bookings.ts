import { Hono } from 'hono'
import bookingController from '../../controllers/bookingController'
import { authMiddleware } from '../../middleware'

const router = new Hono()

router.get('/', authMiddleware, bookingController.getBookings.bind(bookingController))
router.get('/:id', authMiddleware, bookingController.getBooking.bind(bookingController))
router.post('/:id/status', authMiddleware, bookingController.updateBookingStatus.bind(bookingController))
router.post('/:id/payment', authMiddleware, bookingController.recordPayment.bind(bookingController))
router.post('/:id/keycard', authMiddleware, bookingController.issueKeycard.bind(bookingController))

export default router