const Order = require('../models/Order');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET'
});

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const order = new Order(req.body);
        const saved = await order.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all orders (admin)
exports.getOrders = async (req, res) => {
    try {
        const filter = {};
        if (req.query.restaurantId) filter.restaurantId = req.query.restaurantId;
        const orders = await Order.find(filter).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single order
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update order status (admin)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus, paymentStatus } = req.body;
        const update = {};
        if (orderStatus) update.orderStatus = orderStatus;
        if (paymentStatus) update.paymentStatus = paymentStatus;
        const updated = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!updated) return res.status(404).json({ message: 'Order not found' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Create Razorpay order
exports.createRazorpayOrder = async (req, res) => {
    try {
        const { amount } = req.body; // amount in paise
        const options = {
            amount: Math.round(amount * 100), // convert to paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
        };
        const rpOrder = await razorpay.orders.create(options);
        res.json({ orderId: rpOrder.id, amount: rpOrder.amount, currency: rpOrder.currency });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create Razorpay order', error: err.message });
    }
};
