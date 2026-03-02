import { Response } from 'express';
import { DesignService } from '../services/design.service';
import { AuthRequest } from '../middleware/auth.middleware';

const designService = new DesignService();

export class DesignController {
    async create(req: AuthRequest, res: Response) {
        try {
            if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
            const design = await designService.create(req.user.id, req.body);
            res.status(201).json({ success: true, data: design });
        } catch (error: any) {
            res.status(error.status || 500).json({ success: false, message: error.message });
        }
    }

    async getMyDesigns(req: AuthRequest, res: Response) {
        try {
            if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
            const designs = await designService.getByUser(req.user.id);
            res.json({ success: true, data: designs });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getById(req: AuthRequest, res: Response) {
        try {
            const design = await designService.getById(req.params.id);
            if (!design) return res.status(404).json({ success: false, message: 'Design not found' });

            // Ownership check (only if customer)
            if (req.user?.role === 'customer' && design.user_id !== req.user.id) {
                return res.status(403).json({ success: false, message: 'Access denied' });
            }

            res.json({ success: true, data: design });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
