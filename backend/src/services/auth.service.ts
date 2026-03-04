import prisma from '../prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthService {
    async register(data: { name: string; email: string; phone?: string; password: string }) {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw { status: 400, message: 'Email already exists' };
        }

        const password_hash = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                password_hash,
                role: 'customer',
            },
        });

        const { password_hash: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async login(data: { email: string; password: string }) {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (!user || !user.password_hash) {
            throw { status: 401, message: 'Invalid credentials' };
        }

        const isMatch = await bcrypt.compare(data.password, user.password_hash);

        if (!isMatch) {
            throw { status: 401, message: 'Invalid credentials' };
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        );

        const { password_hash: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }
}
