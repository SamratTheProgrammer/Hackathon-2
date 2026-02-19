const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const userRoutes = require('./routes/user.routes');
const transactionRoutes = require('./routes/transaction.routes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/rewards', require('./routes/reward.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/security', require('./routes/security.routes'));

app.get('/', (req, res) => {
    res.send('Bank Backend is running');
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
