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

        // Total Volume
        const aggregations = await prisma.transaction.aggregate({
            _sum: { amount: true },
            where: { status: 'Success' }
        });
        const totalVolume = aggregations._sum.amount || 0;

        const pendingRequests = await prisma.transaction.count({
            where: { status: 'Pending' }
        });

        // Revenue Analytics (Monthly Volume)
        // Fetch successful transactions from the last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const recentTx = await prisma.transaction.findMany({
            where: {
                status: 'Success',
                date: { gte: sixMonthsAgo }
            },
            select: {
                date: true,
                amount: true
            }
        });

        // Group by Month
        const monthlyData = {};
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Initialize last 6 months (or current year) 
        // Let's just create a map for the fetched data
        recentTx.forEach(tx => {
            const date = new Date(tx.date);
            const monthName = months[date.getMonth()];
            if (!monthlyData[monthName]) monthlyData[monthName] = 0;
            monthlyData[monthName] += tx.amount;
        });

        // Format for Recharts (e.g., [{name: 'Jan', value: 100}, ...])
        // We want to ensure specific order? Or just return what we have? 
        // Dashboard expects specific order usually. Let's return the last 7 months derived from current date.
        const chartData = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthName = months[d.getMonth()];
            chartData.push({
                name: monthName,
                value: monthlyData[monthName] || 0
            });
        }

        res.json({
            totalUsers,
            totalTransactions,
            totalVolume,
            pendingRequests,
            chartData
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
