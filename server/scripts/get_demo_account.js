
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getDemoAccount() {
    try {
        const user = await prisma.user.findUnique({
            where: { email: 'demo_bank_user@example.com' }
        });
        if (user) {
            console.log(user.accountNumber);
        } else {
            console.log('USER_NOT_FOUND');
        }
    } catch (error) {
        console.log('ERROR');
    } finally {
        await prisma.$disconnect();
    }
}

getDemoAccount();
