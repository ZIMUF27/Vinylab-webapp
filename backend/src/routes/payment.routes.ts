import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();
const paymentController = new PaymentController();

router.post('/', authenticateJWT, upload.single('slip'), paymentController.create);
router.get('/order/:orderId', authenticateJWT, paymentController.getByOrderId);

export default router;

