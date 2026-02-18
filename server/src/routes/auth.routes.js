const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const upload = require('../middleware/upload');
const multer = require('multer');

const router = express.Router();
const prisma = new PrismaClient();

// Signup Route
// Custom error handling middleware for Multer
const uploadFields = upload.fields([{ name: 'kycDocument', maxCount: 1 }, { name: 'profilePhoto', maxCount: 1 }]);

router.post('/signup', (req, res) => {
    uploadFields(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            console.error('Multer Error:', err);
            return res.status(400).json({ message: err.message });
        } else if (err) {
            // An unknown error occurred when uploading.
            console.error('Upload Error:', err);
            return res.status(500).json({ message: 'An unknown error occurred during file upload.' });
        }

        // Everything went fine.
        try {
            const { name, email, password, mobile, dob } = req.body;
            const kycDocument = req.files['kycDocument'] ? req.files['kycDocument'][0].path : null;
            const profilePhoto = req.files['profilePhoto'] ? req.files['profilePhoto'][0].path : null;

            // Validation
            if (!email || !password || !name) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    mobile,
                    dob: new Date(dob),
                    kycDocument,
                    profilePhoto
                }
            });

            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.status(201).json({ message: 'User created successfully', token, user });
        } catch (error) {
            console.error('Signup Error:', error);
            res.status(500).json({ message: error.message || 'Internal server error', error: error.message });
        }
    });
});

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

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
