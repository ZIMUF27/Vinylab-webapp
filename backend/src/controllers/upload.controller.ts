import { Request, Response } from 'express';

export class UploadController {
    async uploadFile(req: Request, res: Response) {
        try {
            if (!req.file) {
                return res.status(400).json({ success: false, message: 'No file uploaded' });
            }

            const filePath = `/uploads/${req.file.filename}`;
            res.json({ success: true, filePath });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
