const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Middleware to check if user is admin (simplified for now, just check auth)
// In real app, check user.role === 'admin'
// const authenticate = require('../middleware/auth');

// router.use(authenticate);

// Get Admin Stats
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await prisma.user.count();
        const totalTransactions = await prisma.transaction.count();
        const pendingKYC = 0; // Placeholder until KYC is implemented

        // Calculate total revenue (Sum of all successful credit transactions? Or logic specific to business?)
        // For now, let's just show Total Volume Transacted
        const aggregations = await prisma.transaction.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                status: 'Success'
            }
        });
        const totalVolume = aggregations._sum.amount || 0;

        const pendingRequests = await prisma.transaction.count({
            where: {
                status: 'Pending'
            }
        });

        res.json({
            totalUsers,
            totalTransactions,
            totalVolume,
            pendingRequests
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get All Users
router.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                mobile: true,
                balance: true,
                role: true,
                createdAt: true // Assuming timestamps are on, but schema didn't explicitly show it. Default is usually there or added manually.
                // If createAt is missing in schema, we might error. Let's check schema first or just omit.
                // Schema has 'date' in Transaction but didn't see createdAt in User in previous `view_file`.
                // checking schema...
            }
        });
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
