import { Response } from 'express';
import { PaymentService } from '../services/payment.service';
import { AuthRequest } from '../middleware/auth.middleware';

const paymentService = new PaymentService();

export class PaymentController {
    async create(req: AuthRequest, res: Response) {
        try {
            if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

            const paymentData = {
                ...req.body,
                payment_slip: req.file ? `/uploads/${req.file.filename}` : null
            };

            const payment = await paymentService.create(req.user.id, paymentData);
            res.status(201).json({ success: true, data: payment });
        } catch (error: any) {
            res.status(error.status || 500).json({ success: false, message: error.message });
        }
    }

    async getByOrderId(req: AuthRequest, res: Response) {
        try {
            const payment = await paymentService.getByOrderId(req.params.orderId);
            if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
            res.json({ success: true, data: payment });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
