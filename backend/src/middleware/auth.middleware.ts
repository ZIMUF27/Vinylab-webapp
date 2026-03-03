import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import prisma from '../prisma/client';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
        email?: string;
    };
}

export const authenticateJWT = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(403).json({ success: false, message: 'Invalid or expired token' });
        }

        let userRole = user.user_metadata?.['role'] || 'customer';

        // Custom Logic: Assign 'dev' role to specific user
        if (user.email === 'poo2461p@gmail.com') {
            userRole = 'dev';
        }

        // Sync with local database to satisfy Foreign Key constraints
        await prisma.user.upsert({
            where: { id: user.id },
            update: {
                email: user.email!,
                name: user.user_metadata?.['full_name'] || 'User',
                role: userRole as any
            },
            create: {
                id: user.id,
                email: user.email!,
                name: user.user_metadata?.['full_name'] || 'User',
                role: userRole as any,
                password_hash: '' // Not used with Supabase
            }
        });

        req.user = {
            id: user.id,
            role: userRole,
            email: user.email
        };
        next();
    } catch (err) {
        console.error('Auth Middleware Error:', err);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
