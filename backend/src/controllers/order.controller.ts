import { Response } from 'express';
import { OrderService } from '../services/order.service';
import { AuthRequest } from '../middleware/auth.middleware';

const orderService = new OrderService();

export class OrderController {
    async create(req: AuthRequest, res: Response) {
        try {
            if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
            const order = await orderService.create(req.user.id, req.body.design_id);
            res.status(201).json({ success: true, data: order });
        } catch (error: any) {
            res.status(error.status || 500).json({ success: false, message: error.message });
        }
    }

    async getMyOrders(req: AuthRequest, res: Response) {
        try {
            if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
            const orders = await orderService.getMyOrders(req.user.id);
            res.json({ success: true, data: orders });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getAll(req: AuthRequest, res: Response) {
        try {
            const orders = await orderService.getAll();
            res.json({ success: true, data: orders });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async updateStatus(req: AuthRequest, res: Response) {
        try {
            const order = await orderService.updateStatus(req.params.id, req.body.status);
            res.json({ success: true, data: order });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async delete(req: AuthRequest, res: Response) {
        try {
            await orderService.delete(req.params.id);
            res.json({ success: true, message: 'Order deleted successfully' });
        } catch (error: any) {
            res.status(error.status || 500).json({ success: false, message: error.message });
        }
    }
}
