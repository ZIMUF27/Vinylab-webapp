const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    // Create Admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
        where: { email: 'admin@vinylab.com' },
        update: {},
        create: {
            name: 'Super Admin',
            email: 'admin@vinylab.com',
            password_hash: adminPassword,
            role: 'admin',
        },
    });

    // Create Staff
    const staffPassword = await bcrypt.hash('staff123', 10);
    await prisma.user.upsert({
        where: { email: 'staff@vinylab.com' },
        update: {},
        create: {
            name: 'John Staff',
            email: 'staff@vinylab.com',
            password_hash: staffPassword,
            role: 'staff',
        },
    });

    // Create Templates
    const templates = [
        {
            name: 'Outdoor Vinyl Banner',
            min_width: 100,
            max_width: 1000,
            min_height: 50,
            max_height: 300,
            base_price: 0.05,
            material_type: 'Premium 13oz Vinyl',
        },
        {
            name: 'Window Decal',
            min_width: 20,
            max_width: 200,
            min_height: 20,
            max_height: 200,
            base_price: 0.08,
            material_type: 'Perforated Window Film',
        },
        {
            name: 'X-Stand Banner',
            min_width: 60,
            max_width: 80,
            min_height: 160,
            max_height: 180,
            base_price: 0.04,
            material_type: 'Matte PVC',
        }
    ];

    // Clean up existing data to avoid foreign key constraints
    await prisma.payment.deleteMany();
    await prisma.order.deleteMany();
    await prisma.design.deleteMany();
    await prisma.template.deleteMany();

    await prisma.template.createMany({ data: templates });

    console.log('Seed data created successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
