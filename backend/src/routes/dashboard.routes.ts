import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { roleGuard } from '../middleware/role.guard';

const router = Router();
const dashboardController = new DashboardController();

router.get('/stats', authenticateJWT, roleGuard(['admin']), dashboardController.getStats);

export default router;
