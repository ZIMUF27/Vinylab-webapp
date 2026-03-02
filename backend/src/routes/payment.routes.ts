import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();
const paymentController = new PaymentController();

router.post('/', authenticateJWT, paymentController.create);
router.get('/order/:orderId', authenticateJWT, paymentController.getByOrderId);

export default router;
