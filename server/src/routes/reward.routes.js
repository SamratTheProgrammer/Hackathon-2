const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Middleware to check auth (and admin role in real app)
// const authenticate = require('../middleware/auth');
// router.use(authenticate);

// --- Rewards ---

// Create a new Reward
const jwt = require('jsonwebtoken');

// Middleware to authenticate user
const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Authentication required' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// --- Rewards ---

// Redeem Points
router.post('/redeem', authenticate, async (req, res) => {
    try {
        const result = await prisma.$transaction(async (prismaTx) => {
            const user = await prismaTx.user.findUnique({ where: { id: req.userId } });

            if (!user || user.points <= 0) {
                throw new Error('No points to redeem');
            }

            const pointsToRedeem = user.points;
            if (pointsToRedeem < 10) { // Minimum threshold? Let's say 10 points = 1 Rupee, so maybe min 10?
                throw new Error('Minimum 10 points required to redeem');
            }

            const redemptionAmount = Math.floor(pointsToRedeem / 10);

            if (redemptionAmount <= 0) {
                throw new Error('Insufficient points for redemption (Min 10)');
            }

            const remainingPoints = pointsToRedeem % 10; // Keep remainder? Or just zero out?
            // "Redeem All" usually implies taking everything.
            // If 15 points -> 1 Rupee. Remaining 5 points?
            // Let's keep the remainder.
            const pointsDeducted = user.points - remainingPoints;

            // Update User
            await prismaTx.user.update({
                where: { id: req.userId },
                data: {
                    points: remainingPoints,
                    balance: { increment: redemptionAmount }
                }
            });

            // Create Transaction Record
            const transaction = await prismaTx.transaction.create({
                data: {
                    userId: req.userId,
                    amount: redemptionAmount,
                    type: 'credit',
                    to: 'Reward Redemption',
                    status: 'Success'
                }
            });

            // Create Notification
            await prismaTx.notification.create({
                data: {
                    userId: req.userId,
                    title: "Rewards Redeemed",
                    message: `You redeemed ${pointsDeducted} points for ₹${redemptionAmount}.`,
                    type: "reward",
                    relatedId: transaction.id
                }
            });

            return { redemptionAmount, pointsLeft: remainingPoints, transaction };
        });

        res.json({
            message: 'Redemption successful',
            amount: result.redemptionAmount,
            points: result.pointsLeft,
            transaction: result.transaction
        });

    } catch (error) {
        console.error("Redemption error:", error);
        res.status(400).json({ message: error.message || 'Redemption failed' });
    }
});

// Create a new Reward
router.post('/', async (req, res) => {
    try {
        const { title, description, points, image } = req.body;
        if (!title || !points) {
            return res.status(400).json({ message: 'Title and points are required' });
        }

        const reward = await prisma.reward.create({
            data: {
                title,
                description: description || '',
                points: parseInt(points),
                image
            }
        });
        res.status(201).json(reward);
    } catch (error) {
        console.error("Error creating reward:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all Rewards
router.get('/', async (req, res) => {
    try {
        const rewards = await prisma.reward.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(rewards);
    } catch (error) {
        console.error("Error fetching rewards:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a Reward
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.reward.delete({
            where: { id }
        });
        res.json({ message: 'Reward deleted successfully' });
    } catch (error) {
        console.error("Error deleting reward:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// --- Coupons ---

// Create a new Coupon
router.post('/coupons', async (req, res) => {
    try {
        const { code, discount, title, expiryDate } = req.body;
        if (!code || !discount) {
            return res.status(400).json({ message: 'Code and discount are required' });
        }

        const coupon = await prisma.coupon.create({
            data: {
                code,
                discount,
                title,
                expiryDate: expiryDate ? new Date(expiryDate) : null
            }
        });
        res.status(201).json(coupon);
    } catch (error) {
        console.error("Error creating coupon:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all Coupons
router.get('/coupons', async (req, res) => {
    try {
        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(coupons);
    } catch (error) {
        console.error("Error fetching coupons:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a Coupon
router.delete('/coupons/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.coupon.delete({
            where: { id }
        });
        res.json({ message: 'Coupon deleted successfully' });
    } catch (error) {
        console.error("Error deleting coupon:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
