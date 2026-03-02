import prisma from '../prisma/client';

export class TemplateService {
    async getAll() {
        return prisma.template.findMany();
    }

    async getById(id: string) {
        return prisma.template.findUnique({ where: { id } });
    }

    async create(data: any) {
        return prisma.template.create({ data });
    }

    async update(id: string, data: any) {
        return prisma.template.update({ where: { id }, data });
    }

    async delete(id: string) {
        return prisma.template.delete({ where: { id } });
    }
}
