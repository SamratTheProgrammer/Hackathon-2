const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Middleware to check auth (and admin role in real app)
// const authenticate = require('../middleware/auth');
// router.use(authenticate);

// --- Rewards ---

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
