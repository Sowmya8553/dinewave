const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/orderController');

router.post('/', ctrl.createOrder);
router.post('/razorpay', ctrl.createRazorpayOrder);
router.get('/', ctrl.getOrders);
router.get('/:id', ctrl.getOrderById);
router.put('/:id/status', ctrl.updateOrderStatus);

module.exports = router;
