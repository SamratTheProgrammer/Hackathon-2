
const dotenv = require('dotenv');
dotenv.config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
    try {
        const email = 'samratsahaonline@gmail.com';
        console.log(`Checking for user with email: ${email}`);
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (user) {
            console.log('User found:', user);
            console.log('Password hash:', user.password);
        } else {
            console.log('User NOT found in database.');
        }
    } catch (error) {
        console.error('Error checking user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUser();
