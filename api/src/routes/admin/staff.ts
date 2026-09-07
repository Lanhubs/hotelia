import { Hono } from 'hono'
import staffController from '../../controllers/staffController'

const router = new Hono()

router.get('/', staffController.listStaff.bind(staffController))
router.get('/role/:role', staffController.getStaffByRole.bind(staffController))
router.put('/:id/profile', staffController.updateProfile.bind(staffController))
router.put('/:id/password', staffController.updatePassword.bind(staffController))
router.put('/:id/pin', staffController.updatePin.bind(staffController))
router.post('/:id/verify-pin', staffController.verifyPin.bind(staffController))

export default router
