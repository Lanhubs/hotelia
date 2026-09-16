import { Hono } from 'hono'
import publicEventController from '../../controllers/publicEventController'
import { rateLimit } from '../../middlewares/rateLimit'

const router = new Hono()

router.get('/', publicEventController.getPastEvents.bind(publicEventController))
router.get('/:slug', publicEventController.getEventBySlug.bind(publicEventController))
router.post('/:id/book', rateLimit(10, 60_000), publicEventController.createBooking.bind(publicEventController))
router.get('/bookings/:reference', publicEventController.getBookingByReference.bind(publicEventController))
router.post('/bookings/:reference/cancel', publicEventController.cancelBooking.bind(publicEventController))

export default router