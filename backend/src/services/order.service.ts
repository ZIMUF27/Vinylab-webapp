import prisma from '../prisma/client';

export class OrderService {
    async create(userId: string, designId: string) {
        const design = await prisma.design.findUnique({
            where: { id: designId }
        });

        if (!design) {
            throw { status: 404, message: 'Design not found' };
        }

        if (design.user_id !== userId) {
            throw { status: 403, message: 'Design does not belong to user' };
        }

        if (design.status === 'ordered') {
            throw { status: 400, message: 'This design has already been ordered' };
        }

        // Use transaction to ensure both status update and order creation happen
        return prisma.$transaction(async (tx) => {
            // Update design status
            await tx.design.update({
                where: { id: designId },
                data: { status: 'ordered' }
            });

            // Create order
            return tx.order.create({
                data: {
                    design_id: designId,
                    total_price: design.price_calculated,
                    status: 'pending_payment'
                }
            });
        });
    }

    async getMyOrders(userId: string) {
        return prisma.order.findMany({
            where: {
                design: {
                    user_id: userId
                }
            },
            include: {
                design: {
                    include: {
                        template: true
                    }
                },
                payment: true
            }
        });
    }

    async getAll() {
        return prisma.order.findMany({
            include: {
                design: {
                    include: {
                        user: true,
                        template: true
                    }
                },
                payment: true
            }
        });
    }

    async updateStatus(id: string, status: any) {
        return prisma.order.update({
            where: { id },
            data: { status }
        });
    }

    async delete(id: string) {
        const order = await prisma.order.findUnique({
            where: { id },
            include: { design: true }
        });

        if (!order) {
            throw { status: 404, message: 'Order not found' };
        }

        return prisma.$transaction(async (tx) => {
            // Delete associated payment if exists
            await tx.payment.deleteMany({
                where: { order_id: id }
            });

            // Delete order
            await tx.order.delete({
                where: { id }
            });

            // Revert design status to 'draft' so it can be ordered again or edited
            await tx.design.update({
                where: { id: order.design_id },
                data: { status: 'draft' }
            });

            return { success: true };
        });
    }
}
