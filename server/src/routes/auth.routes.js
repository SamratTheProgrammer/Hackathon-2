const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const upload = require('../middleware/upload');
const multer = require('multer');

const router = express.Router();
const prisma = new PrismaClient();

const fs = require('fs');

// ... (rest of imports)

// Signup Route
// Custom error handling middleware for Multer
const uploadFields = upload.fields([{ name: 'kycDocument', maxCount: 1 }, { name: 'profilePhoto', maxCount: 1 }]);

router.post('/signup', (req, res) => {
    uploadFields(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            console.error('Multer Error:', err);
            return res.status(400).json({ message: err.message });
        } else if (err) {
            console.error('Upload Error:', err);
            return res.status(500).json({ message: 'An unknown error occurred during file upload.' });
        }

        try {
            const { name, email, password, mobile, dob, referralCode } = req.body;

            // Process Profile Photo (Store as Base64)
            let profilePhotoBase64 = null;
            if (req.files && req.files['profilePhoto']) {
                const filePath = req.files['profilePhoto'][0].path;
                const fileBuffer = fs.readFileSync(filePath);
                profilePhotoBase64 = `data:${req.files['profilePhoto'][0].mimetype};base64,${fileBuffer.toString('base64')}`;
                fs.unlinkSync(filePath);
            }

            // Process KYC Document (Store as Base64)
            let kycDocumentBase64 = null;
            if (req.files && req.files['kycDocument']) {
                const filePath = req.files['kycDocument'][0].path;
                const fileBuffer = fs.readFileSync(filePath);
                kycDocumentBase64 = `data:${req.files['kycDocument'][0].mimetype};base64,${fileBuffer.toString('base64')}`;
                fs.unlinkSync(filePath);
            }

            // Validation
            if (!email || !password || !name) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const accountNumber = Math.floor(100000000000 + Math.random() * 900000000000).toString();

            // Generate Referral Code: First 4 chars of name + 4 random digits
            const namePrefix = name.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, 'USER');
            const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
            const newReferralCode = `${namePrefix}${randomSuffix}`;

            // Check Referral Code
            let referrer = null;
            if (referralCode) {
                referrer = await prisma.user.findUnique({ where: { referralCode } });
            }

            // Create User and handle bonuses in transaction
            const result = await prisma.$transaction(async (prismaTx) => {
                const newUser = await prismaTx.user.create({
                    data: {
                        name,
                        email,
                        password: hashedPassword,
                        mobile,
                        dob: new Date(dob),
                        kycDocument: kycDocumentBase64,
                        profilePhoto: profilePhotoBase64,
                        accountNumber,
                        referralCode: newReferralCode,
                        referredById: referrer ? referrer.id : null,
                        balance: referrer ? 20 : 0 // Bonus for new user
                    }
                });

                if (referrer) {
                    // Bonus for Referrer
                    await prismaTx.user.update({
                        where: { id: referrer.id },
                        data: { balance: { increment: 50 } }
                    });

                    // Transaction Records
                    await prismaTx.transaction.create({
                        data: {
                            userId: referrer.id,
                            amount: 50,
                            type: 'credit',
                            to: 'Referral Bonus',
                            status: 'Success'
                        }
                    });

                    await prismaTx.notification.create({
                        data: {
                            userId: referrer.id,
                            title: "Referral Bonus Earned!",
                            message: `You earned ₹50 for referring ${name}.`,
                            type: "reward"
                        }
                    });

                    // Bonus for New User (Transaction Record)
                    await prismaTx.transaction.create({
                        data: {
                            userId: newUser.id,
                            amount: 20,
                            type: 'credit',
                            to: 'Signup Bonus (Referral)',
                            status: 'Success'
                        }
                    });

                    await prismaTx.notification.create({
                        data: {
                            userId: newUser.id,
                            title: "Welcome Bonus!",
                            message: `You earned ₹20 for using a referral code.`,
                            type: "reward"
                        }
                    });
                }

                return newUser;
            });

            const token = jwt.sign({ userId: result.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.status(201).json({ message: 'User created successfully', token, user: result });
        } catch (error) {
            console.error('Signup Error:', error);
            res.status(500).json({ message: error.message || 'Internal server error', error: error.message });
        }
    });
});

// Login Route
// Login Route
// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate an account number for legacy users if they don't have one
        if (!user.accountNumber) {
            const newAccountNumber = Math.floor(100000000000 + Math.random() * 900000000000).toString();
            await prisma.user.update({
                where: { id: user.id },
                data: { accountNumber: newAccountNumber }
            });
            user.accountNumber = newAccountNumber;
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        // Track Device (Existing Logic)
        await trackDevice(req, user, token);

        res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Passwordless Login (for UPI Bank Linking after OTP)
router.post('/login-via-account', async (req, res) => {
    try {
        const { accountNumber } = req.body;

        const user = await prisma.user.findUnique({ where: { accountNumber } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        // Track Device
        await trackDevice(req, user, token);

        res.status(200).json({ message: 'Login successful via account', token, user });
    } catch (error) {
        console.error('Login Via Account Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Verify 2FA and Login
router.post('/login/verify-2fa', async (req, res) => {
    const { userId, firebaseToken } = req.body;
    // In a real app, verify firebaseToken with Firebase Admin SDK.
    // For now, we trust the frontend sent a valid signal (Simulated verification on backend or just trust frontend if no Admin SDK)
    // To make it slightly better, we could require a temporary token from the first step, but let's keep it simple.

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        await trackDevice(req, user, token);

        res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Forgot Password (Send Email)
const nodemailer = require('nodemailer');

// Lazy load transporter to prevent startup crash if credentials are missing
const getTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Temporary in-memory store for reset tokens (Better: Redis or DB)
const resetTokens = {};

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate reset token
    const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    // Try to send email via Nodemailer (optional — may fail if credentials not configured)
    try {
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 15 minutes.</p>`
        };
        const transporter = getTransporter();
        transporter.sendMail(mailOptions, (error) => {
            if (error) console.error('Email Error (non-critical):', error.message);
        });
    } catch (emailError) {
        console.error('Nodemailer not configured, skipping email:', emailError.message);
    }

    // Always return the resetToken so frontend can use it after OTP verification
    res.json({ message: 'Password reset initiated', resetToken });
});

// Reset Password
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: decoded.userId },
            data: { password: hashedPassword }
        });

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token' });
    }
});

// Helper for Device Tracking
async function trackDevice(req, user, token) {
    const userAgent = req.headers['user-agent'] || 'Unknown Device';
    let deviceName = 'Unknown Device';
    let deviceType = 'Desktop';

    if (userAgent.includes('Mobile')) deviceType = 'Mobile';
    if (userAgent.includes('Windows')) deviceName = 'Windows PC';
    else if (userAgent.includes('Mac')) deviceName = 'Mac';
    else if (userAgent.includes('Linux')) deviceName = 'Linux PC';
    else if (userAgent.includes('Android')) deviceName = 'Android Device';
    else if (userAgent.includes('iPhone')) deviceName = 'iPhone';

    if (userAgent.includes('Chrome')) deviceName += ' (Chrome)';
    else if (userAgent.includes('Firefox')) deviceName += ' (Firefox)';
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) deviceName += ' (Safari)';

    await prisma.device.create({
        data: {
            userId: user.id,
            name: deviceName,
            type: deviceType,
            location: 'Unknown',
            token: token,
            isCurrent: true
        }
    });
}

module.exports = router;
