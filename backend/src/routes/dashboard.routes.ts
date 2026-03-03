import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { roleGuard } from '../middleware/role.guard';

const router = Router();
const dashboardController = new DashboardController();

router.get('/stats', authenticateJWT, roleGuard(['admin', 'staff', 'dev']), dashboardController.getStats);
router.get('/customers', authenticateJWT, roleGuard(['admin', 'staff', 'dev']), dashboardController.getCustomers);

export default router;
