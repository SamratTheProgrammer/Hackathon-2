const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'app-secret-key-2024';

// POST /api/app-auth/signup — Create a new app user (separate from DigiDhan bank)
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, mobile, dob } = req.body;

        if (!name || !email || !password || !mobile) {
            return res.status(400).json({ message: 'Name, email, password, and mobile are required' });
        }

        // Check if app user already exists
        const existingUser = await prisma.appUser.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'An account with this email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create app user
        const user = await prisma.appUser.create({
            data: {
                name,
                email,
                password: hashedPassword,
                mobile,
                dob: dob ? new Date(dob) : null,
            }
        });

        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email, type: 'app' }, JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            message: 'Account created successfully',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
            }
        });
    } catch (error) {
        console.error('App Signup Error:', error);
        res.status(500).json({ message: 'Server error during signup' });
    }
});

// POST /api/app-auth/login — Login an existing app user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find app user
        const user = await prisma.appUser.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'No account found with this email' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email, type: 'app' }, JWT_SECRET, { expiresIn: '30d' });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
            }
        });
    } catch (error) {
        console.error('App Login Error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// GET /api/app-auth/me — Get current app user profile
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: 'No token provided' });

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        if (decoded.type !== 'app') {
            return res.status(401).json({ message: 'Invalid token type' });
        }

        const user = await prisma.appUser.findUnique({ where: { id: decoded.id } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
        });
    } catch (error) {
        console.error('App Me Error:', error);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
});

// PUT /api/app-auth/profile — Update app user profile
router.put('/profile', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: 'No token provided' });

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        if (decoded.type !== 'app') {
            return res.status(401).json({ message: 'Invalid token type' });
        }

        const { name } = req.body;
        const updateData = {};
        if (name) updateData.name = name;

        const user = await prisma.appUser.update({
            where: { id: decoded.id },
            data: updateData,
        });

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
            }
        });
    } catch (error) {
        console.error('App Profile Update Error:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
});

// POST /api/app-auth/forgot-password — Check if app user exists and return reset token
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const user = await prisma.appUser.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ message: 'No account found with this email' });

        // Generate a reset token
        const resetToken = jwt.sign({ id: user.id, email: user.email, type: 'app-reset' }, JWT_SECRET, { expiresIn: '15m' });

        res.json({ message: 'User verified', resetToken });
    } catch (error) {
        console.error('App Forgot Password Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/app-auth/reset-password — Reset password using reset token
router.post('/reset-password', async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;
        if (!resetToken || !newPassword) return res.status(400).json({ message: 'Token and new password are required' });

        const decoded = jwt.verify(resetToken, JWT_SECRET);
        if (decoded.type !== 'app-reset') {
            return res.status(401).json({ message: 'Invalid reset token' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.appUser.update({
            where: { id: decoded.id },
            data: { password: hashedPassword },
        });

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('App Reset Password Error:', error);
        res.status(400).json({ message: 'Invalid or expired reset token' });
    }
});

module.exports = router;

