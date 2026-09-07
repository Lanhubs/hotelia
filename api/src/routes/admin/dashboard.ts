import { Hono } from 'hono';
import dashboardController from '../../controllers/dashboardController';
import { authMiddleware } from '../../middleware';

const router = new Hono();

router.get('/overview', authMiddleware, dashboardController.getOverview.bind(dashboardController));

export default router;
