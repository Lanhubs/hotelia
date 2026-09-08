import { Hono } from 'hono'
import { authMiddleware } from '../../middleware'
import authController from '../../controllers/authController'

const router = new Hono()

// Public - login
router.post('/login', authController.login.bind(authController))

// Protected - get current user
router.get('/me', authMiddleware, authController.getCurrentUser.bind(authController))

export default router