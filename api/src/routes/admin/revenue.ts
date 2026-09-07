import { Hono } from 'hono'
import revenueController from '../../controllers/revenueController'
import { authMiddleware } from '../../middleware'

const router = new Hono()

router.get('/dashboard', authMiddleware, revenueController.getDashboard.bind(revenueController))
router.get('/transactions', authMiddleware, revenueController.getTransactions.bind(revenueController))
router.get('/reports', authMiddleware, revenueController.getReports.bind(revenueController))

export default router