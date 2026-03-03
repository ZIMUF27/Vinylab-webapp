import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { roleGuard } from '../middleware/role.guard';

const router = Router();
const orderController = new OrderController();

router.post('/', authenticateJWT, orderController.create);
router.get('/my', authenticateJWT, orderController.getMyOrders);

// Staff, Admin, and Dev
router.get('/', authenticateJWT, roleGuard(['staff', 'admin', 'dev']), orderController.getAll);
router.patch('/:id/status', authenticateJWT, roleGuard(['staff', 'admin', 'dev']), orderController.updateStatus);

export default router;
