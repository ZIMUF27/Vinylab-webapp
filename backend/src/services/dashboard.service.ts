import prisma from '../prisma/client';

export class DashboardService {
    async getStats() {
        const totalOrders = await prisma.order.count();
        const totalCustomers = await prisma.user.count({
            where: { role: 'customer' }
        });

        // Time ranges
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        // Daily Revenue
        const dailyRevenue = await prisma.payment.aggregate({
            _sum: { amount: true },
            where: {
                payment_status: 'completed',
                payment_time: { gte: startOfDay }
            }
        });

        // Monthly Revenue
        const monthlyRevenue = await prisma.payment.aggregate({
            _sum: { amount: true },
            where: {
                payment_status: 'completed',
                payment_time: { gte: startOfMonth }
            }
        });

        // Yearly Revenue
        const yearlyRevenue = await prisma.payment.aggregate({
            _sum: { amount: true },
            where: {
                payment_status: 'completed',
                payment_time: { gte: startOfYear }
            }
        });

        // Total Revenue
        const totalRevenue = await prisma.payment.aggregate({
            _sum: { amount: true },
            where: { payment_status: 'completed' }
        });

        return {
            totalOrders,
            totalCustomers,
            dailyRevenue: dailyRevenue._sum.amount || 0,
            monthlyRevenue: monthlyRevenue._sum.amount || 0,
            yearlyRevenue: yearlyRevenue._sum.amount || 0,
            totalRevenue: totalRevenue._sum.amount || 0
        };
    }

    async getCustomerData() {
        return prisma.user.findMany({
            where: { role: 'customer' },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                created_at: true,
                _count: {
                    select: { designs: true }
                }
            },
            orderBy: { created_at: 'desc' }
        });
    }
}
