import { Hono } from 'hono'
import { authMiddleware } from '../../middleware'
import staffController from '../../controllers/staffController'

const router = new Hono()

router.get('/', authMiddleware, staffController.listStaff.bind(staffController))
router.get('/role/:role', authMiddleware, staffController.getStaffByRole.bind(staffController))
router.put('/:id/profile', authMiddleware, staffController.updateProfile.bind(staffController))
router.put('/:id/password', authMiddleware, staffController.updatePassword.bind(staffController))
router.put('/:id/pin', authMiddleware, staffController.updatePin.bind(staffController))
router.post('/:id/verify-pin', authMiddleware, staffController.verifyPin.bind(staffController))

export default router
