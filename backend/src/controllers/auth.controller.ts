import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
    async register(req: Request, res: Response) {
        try {
            const { name, email, phone, password } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ success: false, message: 'Missing required fields' });
            }
            const user = await authService.register({ name, email, phone, password });
            res.status(201).json({ success: true, data: user });
        } catch (error: any) {
            res.status(error.status || 500).json({ success: false, message: error.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ success: false, message: 'Email and password are required' });
            }
            const result = await authService.login({ email, password });
            res.status(200).json({ success: true, ...result });
        } catch (error: any) {
            res.status(error.status || 500).json({ success: false, message: error.message });
        }
    }
}
