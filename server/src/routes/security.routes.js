const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to authenticate user
const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Authentication required' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; // user id
        req.token = token; // current session token
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Get Security Settings
router.get('/settings', authenticate, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { twoFactorEnabled: true, autoLogout: true }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Security Settings
router.put('/settings', authenticate, async (req, res) => {
    try {
        const { twoFactorEnabled, autoLogout } = req.body;
        const user = await prisma.user.update({
            where: { id: req.userId },
            data: {
                ...(twoFactorEnabled !== undefined && { twoFactorEnabled }),
                ...(autoLogout !== undefined && { autoLogout })
            }
        });
        res.json({ message: 'Settings updated', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Change Password
router.post('/change-password', authenticate, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await prisma.user.findUnique({ where: { id: req.userId } });
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: req.userId },
            data: { password: hashedPassword }
        });

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Active Devices
router.get('/devices', authenticate, async (req, res) => {
    try {
        const devices = await prisma.device.findMany({
            where: { userId: req.userId },
            orderBy: { lastActive: 'desc' }
        });

        // Mark current device
        const devicesWithCurrent = devices.map(d => ({
            ...d,
            isCurrent: d.token === req.token
        }));

        res.json(devicesWithCurrent);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove Device
router.delete('/devices/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.device.deleteMany({
            where: { id, userId: req.userId } // Ensure user owns the device
        });
        res.json({ message: 'Device removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
