import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const count = await prisma.template.count();
    console.log('Template count:', count);
    const templates = await prisma.template.findMany();
    console.log('Templates:', JSON.stringify(templates, null, 2));
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
