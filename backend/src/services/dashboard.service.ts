import prisma from '../prisma/client';

export class DashboardService {
    async getStats() {
        const totalOrders = await prisma.order.count();
        const paidOrders = await prisma.order.count({
            where: {
                status: {
                    not: 'pending_payment'
                }
            }
        });

        const revenueResult = await prisma.payment.aggregate({
            _sum: {
                amount: true
            },
            where: {
                payment_status: 'completed'
            }
        });

        const totalCustomers = await prisma.user.count({
            where: { role: 'customer' }
        });

        return {
            totalOrders,
            paidOrders,
            totalRevenue: revenueResult._sum.amount || 0,
            totalCustomers
        };
    }
}
