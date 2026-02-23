const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();

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

// Get current user details
router.get('/me', authenticate, async (req, res) => {
    try {
        console.log('GET /me called for userId:', req.userId);
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                name: true,
                email: true,
                mobile: true,
                dob: true,
                profilePhoto: true,
                balance: true,
                points: true,
                accountNumber: true,
                role: true,
                twoFactorEnabled: true,
                referralCode: true
            }
        });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Search user by mobile number
router.get('/search/:mobile', authenticate, async (req, res) => {
    try {
        const { mobile } = req.params;

        // Basic validation
        if (!mobile || mobile.length < 10) {
            return res.status(400).json({ message: 'Invalid mobile number' });
        }

        const user = await prisma.user.findFirst({
            where: { mobile: mobile },
            select: {
                id: true,
                name: true,
                mobile: true,
                profilePhoto: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Don't allow finding yourself for transfer?
        if (user.id === req.userId) {
            return res.status(400).json({ message: 'You cannot transfer money to yourself' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Search user by Account Number
router.get('/search-account/:accountNumber', authenticate, async (req, res) => {
    try {
        const { accountNumber } = req.params;

        // Basic validation
        if (!accountNumber || accountNumber.length < 10) {
            return res.status(400).json({ message: 'Invalid account number' });
        }

        const user = await prisma.user.findUnique({
            where: { accountNumber: accountNumber },
            select: {
                id: true,
                name: true,
                mobile: true,
                profilePhoto: true,
                accountNumber: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.id === req.userId) {
            return res.status(400).json({ message: 'You cannot transfer money to yourself' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Verify Bank Account and Link
router.post('/verify-bank-account', authenticate, async (req, res) => {
    try {
        const { accountNumber } = req.body;

        if (!accountNumber) {
            return res.status(400).json({ message: 'Account number is required' });
        }

        // Find user by account number
        const userWithAccount = await prisma.user.findUnique({
            where: { accountNumber: accountNumber }
        });

        if (!userWithAccount) {
            return res.status(404).json({ message: 'Invalid account number' });
        }

        // Get the current authenticated user
        const currentUser = await prisma.user.findUnique({
            where: { id: req.userId }
        });

        if (!currentUser) {
            return res.status(404).json({ message: 'Authenticated user not found' });
        }

        // Verify if the email matches
        if (userWithAccount.email !== currentUser.email) {
            return res.status(400).json({ message: 'Account verification failed: Email mismatch. This account does not belong to you.' });
        }

        // If successful, return the account details
        res.json({
            message: 'Bank account verified successfully',
            account: {
                accountNumber: userWithAccount.accountNumber,
                balance: userWithAccount.balance,
                name: userWithAccount.name
            }
        });

    } catch (error) {
        console.error('Bank verification error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Lookup account email by account number (Public for initial verification step)
router.post('/lookup-account', async (req, res) => {
    try {
        const { accountNumber } = req.body;

        if (!accountNumber) {
            return res.status(400).json({ message: 'Account number is required' });
        }

        const userWithAccount = await prisma.user.findUnique({
            where: { accountNumber: accountNumber },
            select: { id: true, name: true, email: true, mobile: true, profilePhoto: true }
        });

        if (!userWithAccount) {
            return res.status(404).json({ message: 'Account not found' });
        }

        res.json(userWithAccount);

    } catch (error) {
        console.error('Account lookup error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// OTP endpoints removed as they are now handled by EmailJS on the frontend

const upload = require('../middleware/upload');
const multer = require('multer');
const fs = require('fs');

// Update user profile (name and/or profile photo)
const uploadProfilePhoto = upload.single('profilePhoto');

router.put('/profile', authenticate, (req, res) => {
    uploadProfilePhoto(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: err.message });
        } else if (err) {
            return res.status(500).json({ message: 'File upload error' });
        }

        try {
            const updateData = {};

            // Update name if provided
            if (req.body.name) {
                updateData.name = req.body.name;
            }

            // Process profile photo to base64
            if (req.file) {
                const fileBuffer = fs.readFileSync(req.file.path);
                updateData.profilePhoto = `data:${req.file.mimetype};base64,${fileBuffer.toString('base64')}`;
                fs.unlinkSync(req.file.path); // Delete temp file
            }

            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ message: 'No data to update' });
            }

            const updatedUser = await prisma.user.update({
                where: { id: req.userId },
                data: updateData,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    mobile: true,
                    dob: true,
                    profilePhoto: true,
                    balance: true,
                    points: true,
                    accountNumber: true,
                    role: true,
                    twoFactorEnabled: true
                }
            });

            res.json({ message: 'Profile updated successfully', user: updatedUser });
        } catch (error) {
            console.error('Profile update error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
});

module.exports = router;
