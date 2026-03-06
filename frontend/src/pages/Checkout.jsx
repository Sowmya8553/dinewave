import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, cartRestaurant, totalAmount, clearCart } = useCart();
    const [form, setForm] = useState({ customerName: '', phone: '', deliveryAddress: '' });
    const [paymentMethod, setPaymentMethod] = useState('COD');
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
            paymentMethod,
            paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Pending',
        };
        try {
            if (paymentMethod === 'COD') {
                await axios.post('`http://localhost:5000/api/orders', orderPayload);
                clearCart();
                navigate('/order-success', { state: { method: 'COD', total: totalAmount, customerName: form.customerName } });
            } else {
                // Razorpay
                const rpRes = await axios.post('`http://localhost:5000/api/orders/razorpay', { amount: totalAmount });
                const { orderId, amount: rpAmount, currency } = rpRes.data;

                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID',
                    amount: rpAmount,
                    currency,
                    name: 'DineWave',
                    description: `Order from ${cartRestaurant.name}`,
                    order_id: orderId,
                    handler: async (response) => {
                        const finalOrder = {
                            ...orderPayload,
                            paymentStatus: 'Paid',
                            razorpayOrderId: orderId,
                            razorpayPaymentId: response.razorpay_payment_id,
                        };
                        await axios.post('`http://localhost:5000/api/orders', finalOrder);
                        clearCart();
                        navigate('/order-success', { state: { method: 'Online', total: totalAmount, customerName: form.customerName } });
                    },
                    prefill: { name: form.customerName, contact: form.phone },
                    theme: { color: '#C8102E' }
                };
                const rzp = new window.Razorpay(options);
                rzp.open();
            }
        } catch (err) {
            setError('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Load Razorpay script if online payment (PhonePe, Paytm, or Online)
        if (paymentMethod !== 'COD' && !window.Razorpay) {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => placeOrder();
            document.body.appendChild(script);
        } else {
            placeOrder();
        }
    };

    return (
        <div style={{ marginTop: '70px', minHeight: '80vh', background: 'var(--bg-secondary)' }} className="py-5">
            <div className="container">
                <div className="text-center mb-5">
                    <span className="section-label">Checkout</span>
                    <h2 className="section-title mt-2">Complete Your Order</h2>
                </div>

                <div className="row g-4">
                    {/* Form */}
                    <div className="col-lg-7">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-4 p-5 shadow-sm">
                            <h5 className="fw-bold mb-4">Delivery Details</h5>

                            <AnimatePresence>
                                {error && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="alert mb-4" style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '10px' }}>{error}</motion.div>)}
                            </AnimatePresence>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-600">Full Name *</label>
                                    <input name="customerName" className="form-control form-control-dw" value={form.customerName} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-600">Phone Number *</label>
                                    <input name="phone" type="tel" className="form-control form-control-dw" value={form.phone} onChange={handleChange} required />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-600">Delivery Address *</label>
                                    <textarea name="deliveryAddress" rows={3} className="form-control form-control-dw" value={form.deliveryAddress} onChange={handleChange} required />
                                </div>

                                <h5 className="fw-bold mb-3">Payment Method</h5>
                                <div className="row g-2 mb-4">
                                    {[
                                        ['COD', '💵 COD'],
                                        ['PhonePe', '📱 PhonePe'],
                                        ['Paytm', '💰 Paytm'],
                                        ['Online', '💳 Cards/NetBanking']
                                    ].map(([val, label]) => (
                                        <div className="col-6" key={val}>
                                            <button type="button" onClick={() => setPaymentMethod(val)}
                                                style={{
                                                    width: '100%', padding: '12px', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem',
                                                    border: paymentMethod === val ? '2px solid var(--primary)' : '2px solid #e5e7eb',
                                                    background: paymentMethod === val ? 'rgba(200,16,46,0.07)' : '#fff',
                                                    color: paymentMethod === val ? 'var(--primary)' : 'var(--text-dark)',
                                                    transition: 'all 0.2s'
                                                }}>
                                                {label}
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {paymentMethod === 'Online' && (
                                    <p className="text-muted small mb-4" style={{ background: '#f0fdf4', padding: '10px', borderRadius: '8px' }}>
                                        🔒 You will be redirected to Razorpay's secure payment page.
                                    </p>
                                )}

                                <button type="submit" className="btn btn-primary-custom w-100 py-3 fw-bold" disabled={loading}>
                                    {loading ? 'Processing...' : paymentMethod === 'COD' ? '✅ Place Order (COD)' : `💳 Pay with ${paymentMethod} ₹${totalAmount.toFixed(0)}`}
                                </button>
                            </form>
                        </motion.div>
                    </div>

                    {/* Order Summary */}
                    <div className="col-lg-5">
                        <div className="bg-white rounded-4 p-4 shadow-sm sticky-top" style={{ top: '90px' }}>
                            <h5 className="fw-bold mb-4">Order Summary</h5>
                            <div className="mb-3 pb-3 border-bottom">
                                <span className="location-badge">🏪 {cartRestaurant?.name}</span>
                            </div>
                            {cartItems.map(item => (
                                <div key={item._id} className="d-flex align-items-center gap-3 mb-3">
                                    <img src={item.imageUrl} alt={item.name} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                                    <div className="flex-grow-1">
                                        <p className="mb-0 fw-600 small">{item.name}</p>
                                        <span className="text-muted small">Qty: {item.quantity}</span>
                                    </div>
                                    <span className="fw-bold small">₹{(item.price * item.quantity).toFixed(0)}</span>
                                </div>
                            ))}
                            <hr />
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="fw-bold">Total Amount</span>
                                <span className="price-tag fs-4">₹{totalAmount.toFixed(0)}</span>
                            </div>
                            <p className="text-muted small mt-2 mb-0">
                                {paymentMethod === 'COD' ? '💵 Pay on delivery' : '💳 Secure online payment via Razorpay'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
