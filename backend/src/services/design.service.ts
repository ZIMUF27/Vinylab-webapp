import prisma from '../prisma/client';

export class DesignService {
    async create(userId: string, data: { template_id: string; width: number; height: number; color: string; text_content: string }) {
        const template = await prisma.template.findUnique({
            where: { id: data.template_id }
        });

        if (!template) {
            throw { status: 404, message: 'Template not found' };
        }

        // Validation
        if (data.width < template.min_width || data.width > template.max_width) {
            throw { status: 400, message: `Width must be between ${template.min_width} and ${template.max_width}` };
        }
        if (data.height < template.min_height || data.height > template.max_height) {
            throw { status: 400, message: `Height must be between ${template.min_height} and ${template.max_height}` };
        }

        // Calculate Price
        const price_calculated = data.width * data.height * template.base_price;

        return prisma.design.create({
            data: {
                user_id: userId,
                template_id: data.template_id,
                width: data.width,
                height: data.height,
                color: data.color,
                text_content: data.text_content,
                price_calculated,
                status: 'draft'
            }
        });
    }

    async getByUser(userId: string) {
        return prisma.design.findMany({
            where: { user_id: userId },
            include: { template: true }
        });
    }

    async getById(id: string) {
        return prisma.design.findUnique({
            where: { id },
            include: { template: true, user: true }
        });
    }
}
