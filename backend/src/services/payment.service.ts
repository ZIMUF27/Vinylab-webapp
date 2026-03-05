import prisma from '../prisma/client';

export class PaymentService {
    async create(userId: string, data: { order_id?: string; design_id?: string; payment_method: string; payment_slip?: string }) {
        if (data.design_id) {
            const design = await prisma.design.findUnique({
                where: { id: data.design_id }
            });

            if (!design) throw { status: 404, message: 'Design not found' };
            if (design.user_id !== userId) throw { status: 403, message: 'Unauthorized' };
            if (design.status === 'ordered') throw { status: 400, message: 'Design already ordered' };

            return prisma.$transaction(async (tx) => {
                const order = await tx.order.create({
                    data: {
                        design_id: data.design_id!,
                        total_price: design.price_calculated,
                        status: 'paid'
                    }
                });

                const payment = await tx.payment.create({
                    data: {
                        order_id: order.id,
                        amount: design.price_calculated,
                        payment_method: data.payment_method,
                        payment_slip: data.payment_slip || null,
                        payment_status: 'completed',
                        payment_time: new Date()
                    }
                });

                await tx.design.update({
                    where: { id: data.design_id },
                    data: { status: 'ordered' }
                });

                return payment;
            });
        }

        if (!data.order_id) {
            throw { status: 400, message: 'Order ID or Design ID is required' };
        }

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
                    order_id: data.order_id!,
                    amount: order.total_price,
                    payment_method: data.payment_method,
                    payment_slip: data.payment_slip || null,
                    payment_status: 'completed',
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
