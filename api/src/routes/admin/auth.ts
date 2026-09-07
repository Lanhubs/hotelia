import { Hono } from 'hono'
import authController from '../../controllers/authController'

const router = new Hono()

router.post('/login', authController.login.bind(authController))
router.get('/me', authController.getCurrentUser.bind(authController))

export default router