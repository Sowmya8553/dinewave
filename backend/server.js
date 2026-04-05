const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Sanitize FRONTEND_URL - trim whitespace/newlines to prevent ERR_INVALID_CHAR in headers
const frontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.trim() : '*';

app.use(cors({
    origin: frontendUrl,
    credentials: true
}));
app.use(express.json());

// DB Connection - cached for serverless
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dinewave';

let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb && mongoose.connection.readyState === 1) {
        return cachedDb;
    }
    const db = await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 30000,
        bufferCommands: true,
    });
    cachedDb = db;
    console.log('MongoDB connected successfully to DineWave DB');
    return db;
}

// Middleware to ensure DB connection before handling requests
app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (err) {
        console.error('MongoDB connection error:', err);
        res.status(500).json({ message: 'Database connection failed', error: err.message });
    }
});

// Routes
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/reservations', require('./routes/reservation'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/orders', require('./routes/orders'));

app.get('/', (req, res) => res.send('DineWave API is running.'));

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`DineWave server running on port ${PORT}`));
}

module.exports = app;
