import { Hono } from 'hono';
import settingsController from '../../controllers/settingsController';
import { authMiddleware } from '../../middleware';

const router = new Hono();

router.get('/', authMiddleware, settingsController.getSettings.bind(settingsController));
router.post('/', authMiddleware, settingsController.updateSettings.bind(settingsController));

export default router;
