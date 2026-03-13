const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));
app.use(express.json());

// DB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dinewave';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully to DineWave DB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/reservations', require('./routes/reservation'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/orders', require('./routes/orders'));

app.get('/', (req, res) => res.send('DineWave API is running.'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`DineWave server running on port ${PORT}`));
