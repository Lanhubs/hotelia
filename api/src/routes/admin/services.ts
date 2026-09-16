import { Hono } from 'hono'
import serviceController from '../../controllers/serviceController'
import { authMiddleware } from '../../middleware'

const router = new Hono()

router.get('/menu', authMiddleware, serviceController.getServiceMenu.bind(serviceController))
router.get('/menu/:slug', authMiddleware, serviceController.getService.bind(serviceController))
router.post('/menu', authMiddleware, serviceController.createMenuItem.bind(serviceController))
router.put('/menu/:id', authMiddleware, serviceController.updateMenuItem.bind(serviceController))
router.delete('/menu/:id', authMiddleware, serviceController.deleteMenuItem.bind(serviceController))
router.post('/orders', authMiddleware, serviceController.createServiceOrder.bind(serviceController))
router.get('/orders', authMiddleware, serviceController.getServiceOrders.bind(serviceController))
router.post('/orders/:id/status', authMiddleware, serviceController.updateServiceOrderStatus.bind(serviceController))

export default router