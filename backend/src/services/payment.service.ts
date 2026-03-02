import prisma from '../prisma/client';

export class PaymentService {
    async create(userId: string, data: { order_id: string; payment_method: string }) {
        const order = await prisma.order.findUnique({
            where: { id: data.order_id },
            include: {
                design: true
            }
        });

        if (!order) {
            throw { status: 404, message: 'Order not found' };
        }

        if (order.design.user_id !== userId) {
            throw { status: 403, message: 'Unauthorized' };
        }

        if (order.status !== 'pending_payment') {
            throw { status: 400, message: 'Order is not in pending payment status' };
        }

        return prisma.$transaction(async (tx) => {
            const payment = await tx.payment.create({
                data: {
                    order_id: data.order_id,
                    amount: order.total_price,
                    payment_method: data.payment_method,
                    payment_status: 'completed', // Autocomplete for demo
                    payment_time: new Date()
                }
            });

            await tx.order.update({
                where: { id: data.order_id },
                data: { status: 'paid' }
            });

            return payment;
        });
    }

    async getByOrderId(orderId: string) {
        return prisma.payment.findUnique({
            where: { order_id: orderId }
        });
    }
}
