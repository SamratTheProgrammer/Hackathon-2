const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();

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

// Helper: Process Rewards (Points & Cashback)
const processRewards = async (userId, prismaTx) => {
    try {
        // 1. Add Random Points (e.g., 5 to 50 pts per transaction)
        const randomPoints = Math.floor(Math.random() * (50 - 5 + 1)) + 5;
        await prismaTx.user.update({
            where: { id: userId },
            data: { points: { increment: randomPoints } }
        });

        // 2. Check for Cashback (every 5th successful transaction)
        const count = await prismaTx.transaction.count({
            where: {
                userId: userId,
                status: 'Success'
            }
        });

        if (count > 0 && count % 5 === 0) {
            const cashbackAmount = Math.floor(Math.random() * 5) + 1; // 1 to 5

            // Create Cashback Transaction
            await prismaTx.transaction.create({
                data: {
                    userId: userId,
                    amount: cashbackAmount,
                    type: 'credit',
                    to: 'Cashback Reward',
                    status: 'Success'
                }
            });

            // Add to Balance
            await prismaTx.user.update({
                where: { id: userId },
                data: { balance: { increment: cashbackAmount } }
            });

            // Create Notification for Cashback
            await prismaTx.notification.create({
                data: {
                    userId: userId,
                    title: "Cashback Received!",
                    message: `You won ₹${cashbackAmount} cashback on your 5th transaction!`,
                    type: "reward",
                    relatedId: null // or transaction ID if we had it handy, typically created above
                }
            });

            return { pointsAdded: randomPoints, cashback: cashbackAmount };
        }

        return { pointsAdded: randomPoints, cashback: 0 };
    } catch (error) {
        console.error("Error processing rewards:", error);
        return null;
    }
};

// Get user transactions
router.get('/', authenticate, async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany({
            where: { userId: req.userId },
            orderBy: { date: 'desc' },
            take: 20 // Limit to last 20 transactions
        });
        res.json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get ALL transactions (Admin only)
router.get('/all', async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany({
            include: { user: { select: { name: true, email: true } } },
            orderBy: { date: 'desc' }
        });
        res.json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get ALL pending transactions (Admin only)
router.get('/pending', async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany({
            where: { status: 'Pending' },
            include: { user: { select: { name: true, email: true, mobile: true } } },
            orderBy: { date: 'desc' }
        });
        res.json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Create a new transaction (Add Money / Send Money / P2P)
router.post('/', authenticate, async (req, res) => {
    try {
        const { amount, type, to, status, receiverMobile } = req.body;

        if (!amount || !type) {
            return res.status(400).json({ message: 'Amount and type are required' });
        }

        // Default status
        let txStatus = status;
        if (!txStatus) {
            txStatus = type === 'credit' ? 'Pending' : 'Success';
        }

        const result = await prisma.$transaction(async (prismaTx) => {
            // 1. P2P Transfer Logic (Debit from Sender, Credit to Receiver)
            if (type === 'debit' && receiverMobile) {
                // Find Receiver
                const receiver = await prismaTx.user.findFirst({ where: { mobile: receiverMobile } });
                if (!receiver) {
                    throw new Error('Receiver not found');
                }
                if (receiver.id === req.userId) {
                    throw new Error('Cannot transfer to self');
                }

                // Check Sender Balance
                const sender = await prismaTx.user.findUnique({ where: { id: req.userId } });
                if (sender.balance < parseFloat(amount)) {
                    throw new Error('Insufficient balance');
                }

                // Debit Sender
                await prismaTx.user.update({
                    where: { id: req.userId },
                    data: { balance: { decrement: parseFloat(amount) } }
                });

                // Credit Receiver
                await prismaTx.user.update({
                    where: { id: receiver.id },
                    data: { balance: { increment: parseFloat(amount) } }
                });

                // Create Debit Transaction for Sender
                const senderTx = await prismaTx.transaction.create({
                    data: {
                        userId: req.userId,
                        amount: parseFloat(amount),
                        type: 'debit',
                        to: receiver.name || receiverMobile,
                        remarks: req.body.remarks,
                        status: 'Success'
                    }
                });

                // Create Credit Transaction for Receiver
                const receiverTx = await prismaTx.transaction.create({
                    data: {
                        userId: receiver.id,
                        amount: parseFloat(amount),
                        type: 'credit',
                        to: sender.name || 'P2P Transfer',
                        remarks: req.body.remarks,
                        status: 'Success'
                    }
                });

                // Create Notification for Receiver
                await prismaTx.notification.create({
                    data: {
                        userId: receiver.id,
                        title: "Money Received",
                        message: `You received ₹${amount} from ${sender.name || 'a user'}.`,
                        type: "transaction",
                        relatedId: receiverTx.id
                    }
                });

                // Process Rewards for Sender
                const rewards = await processRewards(req.userId, prismaTx);

                return { transaction: senderTx, rewards };
            }

            // 2. Standard Transaction Logic (Add Money / Withdrawal / Bill Pay)

            // Check balance for debit
            if (type === 'debit') {
                const user = await prismaTx.user.findUnique({ where: { id: req.userId } });
                if (user.balance < parseFloat(amount)) {
                    throw new Error('Insufficient balance');
                }

                // Deduct balance
                await prismaTx.user.update({
                    where: { id: req.userId },
                    data: { balance: { decrement: parseFloat(amount) } }
                });
            }

            // Create Transaction
            const transaction = await prismaTx.transaction.create({
                data: {
                    userId: req.userId,
                    amount: parseFloat(amount),
                    type,
                    to: to || 'Self',
                    remarks: req.body.remarks,
                    status: txStatus
                }
            });

            // Handle Credit Balance Update (If Success - e.g. Add Money)
            if (type === 'credit' && txStatus === 'Success') {
                await prismaTx.user.update({
                    where: { id: req.userId },
                    data: { balance: { increment: parseFloat(amount) } }
                });
            }

            // Process Rewards if Success
            let rewards = null;
            if (txStatus === 'Success') {
                rewards = await processRewards(req.userId, prismaTx);
            }

            return { transaction, rewards };
        }, { maxWait: 10000, timeout: 20000 });

        // Get updated balance to return
        const updatedUser = await prisma.user.findUnique({ where: { id: req.userId } });

        res.status(201).json({
            message: 'Transaction successful',
            transaction: result.transaction,
            newBalance: updatedUser.balance,
            rewards: result.rewards
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
});

// Update transaction status (Approve/Reject)
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, rejectionReason } = req.body;

        if (!['Success', 'Failed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const transaction = await prisma.transaction.findUnique({ where: { id } });
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

        if (transaction.status !== 'Pending') {
            return res.status(400).json({ message: 'Transaction is not pending' });
        }

        const result = await prisma.$transaction(async (prismaTx) => {
            // Update transaction
            const updatedTx = await prismaTx.transaction.update({
                where: { id },
                data: { status, rejectionReason }
            });

            // If Approved (Success) and it was a credit, add to user balance
            if (status === 'Success' && transaction.type === 'credit') {
                await prismaTx.user.update({
                    where: { id: transaction.userId },
                    data: { balance: { increment: transaction.amount } }
                });

                // Process Rewards
                await processRewards(transaction.userId, prismaTx);
            }

            return updatedTx;
        }, { maxWait: 10000, timeout: 20000 });

        res.json({ message: `Transaction ${status}`, transaction: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
