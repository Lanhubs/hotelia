import { Hono } from 'hono'
import eventController from '../../controllers/eventController'
import { authMiddleware } from '../../middleware'
import { rateLimit } from '../../middlewares/rateLimit'

const router = new Hono()

router.get('/', authMiddleware, eventController.getEvents.bind(eventController))
router.get('/stats', authMiddleware, eventController.getStats.bind(eventController))
router.get('/:id', authMiddleware, eventController.getEvent.bind(eventController))
router.get('/:id/occurrences', authMiddleware, eventController.getEventOccurrences.bind(eventController))
router.get('/:id/bookings', authMiddleware, eventController.getEventBookings.bind(eventController))
router.post('/', authMiddleware, eventController.createEvent.bind(eventController))
router.put('/:id', authMiddleware, eventController.updateEvent.bind(eventController))
router.delete('/:id', authMiddleware, eventController.deleteEvent.bind(eventController))
router.put('/bookings/:bookingId', authMiddleware, eventController.updateBooking.bind(eventController))
router.post('/bookings/:bookingId/checkin', authMiddleware, eventController.checkInBooking.bind(eventController))
router.post('/bookings/:bookingId/cancel', authMiddleware, eventController.cancelBooking.bind(eventController))

export default router