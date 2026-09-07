import { Hono } from 'hono'
import notificationController from '../controllers/notificationController'
import { authMiddleware } from '../middleware'

const router = new Hono()

router.get('/', authMiddleware, notificationController.getNotifications.bind(notificationController))
router.get('/unread-count', authMiddleware, notificationController.getUnreadCount.bind(notificationController))
router.post('/', authMiddleware, notificationController.createNotification.bind(notificationController))
router.patch('/:id/read', authMiddleware, notificationController.markAsRead.bind(notificationController))
router.patch('/read-all', authMiddleware, notificationController.markAllAsRead.bind(notificationController))
router.delete('/:id', authMiddleware, notificationController.deleteNotification.bind(notificationController))
router.delete('/', authMiddleware, notificationController.deleteAllNotifications.bind(notificationController))

export default router
