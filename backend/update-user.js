import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const user = await prisma.user.update({
        where: { email: 'test@gmail.com' },
        data: { name: 'test' }
    });
    console.log('Updated user:', user);
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
