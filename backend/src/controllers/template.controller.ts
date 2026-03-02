import { Request, Response } from 'express';
import { TemplateService } from '../services/template.service';

const templateService = new TemplateService();

export class TemplateController {
    async getAll(req: Request, res: Response) {
        try {
            const templates = await templateService.getAll();
            res.json({ success: true, data: templates });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const template = await templateService.getById(req.params.id);
            if (!template) return res.status(404).json({ success: false, message: 'Template not found' });
            res.json({ success: true, data: template });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const template = await templateService.create(req.body);
            res.status(201).json({ success: true, data: template });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const template = await templateService.update(req.params.id, req.body);
            res.json({ success: true, data: template });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await templateService.delete(req.params.id);
            res.json({ success: true, message: 'Template deleted' });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}
