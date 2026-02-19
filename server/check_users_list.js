
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listUsers() {
    try {
        const count = await prisma.user.count();
        console.log(`Total users in database: ${count}`);

        if (count > 0) {
            const users = await prisma.user.findMany({
                take: 5,
                select: { email: true, name: true }
            });
            console.log('First 5 users:', users);
        } else {
            console.log('Database appears to be empty.');
        }
    } catch (error) {
        console.error('Error listing users:', error);
    } finally {
        await prisma.$disconnect();
    }
}

listUsers();
