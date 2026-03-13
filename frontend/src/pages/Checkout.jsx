import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, cartRestaurant, totalAmount, clearCart } = useCart();
    const [form, setForm] = useState({ customerName: '', phone: '', deliveryAddress: '' });
    const paymentMethod = 'COD';
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (cartItems.length === 0) {
        navigate('/');
        return null;
    }

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const placeOrder = async () => {
        setLoading(true);
        setError(null);
        const orderPayload = {
            customerName: form.customerName,
            phone: form.phone,
            deliveryAddress: form.deliveryAddress,
            restaurantId: cartRestaurant.id,
            restaurantName: cartRestaurant.name,
            items: cartItems.map(i => ({ menuItemId: i._id, name: i.name, price: i.price, quantity: i.quantity, imageUrl: i.imageUrl })),
            totalAmount,
            paymentMethod: 'COD',
            paymentStatus: 'Pending',
        };
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || \'http://localhost:5000\'}/api/orders`, orderPayload);
            clearCart();
            navigate('/order-success', { state: { method: 'COD', total: totalAmount, customerName: form.customerName } });
        } catch (err) {
            setError('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        placeOrder();
    };

    const deliveryFee = 0;
    const taxes = Math.round(totalAmount * 0.05);
    const grandTotal = totalAmount + deliveryFee + taxes;

    return (
        <div className="checkout-page">
            <div className="container">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="checkout-header"
                >
                    <div className="checkout-breadcrumb">
                        <span>🛒 Cart</span>
                        <span className="breadcrumb-sep">›</span>
                        <span className="breadcrumb-active">Checkout</span>
                        <span className="breadcrumb-sep">›</span>
                        <span>Confirmation</span>
                    </div>
                    <h1 className="checkout-title">Complete Your Order</h1>
                    <p className="checkout-subtitle">You're just one step away from delicious food!</p>
                </motion.div>

                <div className="checkout-grid">
                    {/* Left: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="checkout-form-col"
                    >
                        {/* Error */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="checkout-error"
                                >
                                    ⚠️ {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Delivery Details */}
                        <div className="checkout-card">
                            <div className="checkout-card-header">
                                <div className="checkout-step-badge">1</div>
                                <h2 className="checkout-section-title">Delivery Details</h2>
                            </div>
                            <form onSubmit={handleSubmit} id="checkout-form">
                                <div className="form-field">
                                    <label className="field-label">Full Name *</label>
                                    <input
                                        name="customerName"
                                        className="field-input"
                                        placeholder="Enter your full name"
                                        value={form.customerName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-field">
                                    <label className="field-label">Phone Number *</label>
                                    <input
                                        name="phone"
                                        type="tel"
                                        className="field-input"
                                        placeholder="+91 98765 43210"
                                        value={form.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-field">
                                    <label className="field-label">Delivery Address *</label>
                                    <textarea
                                        name="deliveryAddress"
                                        rows={3}
                                        className="field-input"
                                        placeholder="House No, Street, Area, City, Pincode"
                                        value={form.deliveryAddress}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Payment Method - COD Only */}
                        <div className="checkout-card">
                            <div className="checkout-card-header">
                                <div className="checkout-step-badge">2</div>
                                <h2 className="checkout-section-title">Payment Method</h2>
                            </div>
                            <div className="payment-cod-box">
                                <div className="payment-cod-icon">💵</div>
                                <div className="payment-cod-info">
                                    <div className="payment-cod-title">Cash on Delivery</div>
                                    <div className="payment-cod-desc">Pay with cash when your order arrives at your doorstep</div>
                                </div>
                                <div className="payment-cod-check">✔️</div>
                            </div>
                            <div className="cod-note">
                                🔒 Secure &amp; safe. Keep ₹{grandTotal.toFixed(0)} ready at the time of delivery.
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="checkout-summary-col"
                    >
                        <div className="summary-sticky">
                            <div className="checkout-card">
                                <div className="checkout-card-header">
                                    <h2 className="checkout-section-title">Order Summary</h2>
                                </div>

                                <div className="summary-restaurant-tag">
                                    🏪 {cartRestaurant?.name}
                                </div>

                                <div className="summary-items">
                                    {cartItems.map(item => (
                                        <div key={item._id} className="summary-item">
                                            <div className="summary-item-img-wrap">
                                                <img src={item.imageUrl} alt={item.name} className="summary-item-img" />
                                            </div>
                                            <div className="summary-item-info">
                                                <div className="summary-item-name">{item.name}</div>
                                                <div className="summary-item-qty">Qty: {item.quantity}</div>
                                            </div>
                                            <div className="summary-item-price">₹{(item.price * item.quantity).toFixed(0)}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="summary-breakdown">
                                    <div className="breakdown-row">
                                        <span>Subtotal</span>
                                        <span>₹{totalAmount.toFixed(0)}</span>
                                    </div>
                                    <div className="breakdown-row">
                                        <span>Delivery Fee</span>
                                        <span className="free-tag">FREE</span>
                                    </div>
                                    <div className="breakdown-row">
                                        <span>GST &amp; Taxes (5%)</span>
                                        <span>₹{taxes}</span>
                                    </div>
                                    <div className="breakdown-total">
                                        <span>Total Amount</span>
                                        <span className="total-price">₹{grandTotal.toFixed(0)}</span>
                                    </div>
                                </div>

                                <div className="summary-payment-method">
                                    💵 Cash on Delivery
                                </div>

                                <motion.button
                                    form="checkout-form"
                                    type="submit"
                                    className="place-order-btn"
                                    disabled={loading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {loading ? (
                                        <span className="btn-loading">
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            Processing...
                                        </span>
                                    ) : (
                                        '✅ Place Order (COD)'
                                    )}
                                </motion.button>

                                <div className="secure-badge">
                                    🔒 100% Secure Checkout
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
