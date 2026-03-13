import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const STATUS_STEPS = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
const STEP_LABELS = ['Order Placed', 'Confirmed', 'Preparing', 'On the Way', 'Delivered'];
// Fixed Emojis mapping
const STEP_ICONS = ['📋', '✅', '👨‍🍳', '🛵', '🎉'];

const getStatusColor = (status) => {
    switch (status) {
        case 'Delivered': return { bg: '#d1fae5', text: '#065f46' };
        case 'Cancelled': return { bg: '#fee2e2', text: '#dc2626' };
        case 'Out for Delivery': return { bg: '#dbeafe', text: '#1e40af' };
        case 'Preparing': return { bg: '#ffedd5', text: '#c2410c' };
        case 'Confirmed': return { bg: '#cffafe', text: '#0e7490' };
        default: return { bg: '#fef9c3', text: '#92400e' };
    }
};

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || \'http://localhost:5000\'}/api/orders`);
                setOrders(res.data);
            } catch (err) {
                console.error('Error fetching orders:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner-border" style={{ width: '3rem', height: '3rem' }} role="status" />
        </div>
    );

    return (
        <div className="orders-page">
            <div className="container">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <span className="section-label">Your Account</span>
                        <h1 style={{ fontWeight: 800, fontSize: '1.8rem', color: 'var(--text-dark)', marginTop: 8 }}>Order History &amp; Tracking</h1>
                        <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
                    </div>
                    <Link to="/" className="btn-primary-custom" style={{ padding: '11px 24px' }}>Order More Food</Link>
                </motion.div>

                {/* Empty State */}
                {orders.length === 0 ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        style={{ background: '#fff', borderRadius: 20, padding: '60px 40px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ fontSize: '4.5rem', marginBottom: 16 }}>🍽️</div>
                        <h3 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: 8 }}>No orders yet</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Hungry? Order some delicious food now!</p>
                        <Link to="/" className="btn-primary-custom">Browse Restaurants</Link>
                    </motion.div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <AnimatePresence>
                            {orders.map((order, idx) => {
                                const stepIdx = STATUS_STEPS.indexOf(order.orderStatus);
                                const progress = ((stepIdx + 1) / STATUS_STEPS.length) * 100;
                                const statusColor = getStatusColor(order.orderStatus);
                                const isCancelled = order.orderStatus === 'Cancelled';

                                return (
                                    <motion.div
                                        key={order._id}
                                        initial={{ opacity: 0, y: 24 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.06 }}
                                        className="order-card"
                                    >
                                        {/* Card Header */}
                                        <div className="order-card-header">
                                            <div>
                                                <div className="order-meta-label">Order ID</div>
                                                <div className="order-meta-val order-id-val">#{order._id.slice(-8).toUpperCase()}</div>
                                            </div>
                                            <div>
                                                <div className="order-meta-label">Restaurant</div>
                                                <div className="order-meta-val">🏪 {order.restaurantName}</div>
                                            </div>
                                            <div>
                                                <div className="order-meta-label">Customer</div>
                                                <div className="order-meta-val">{order.customerName}</div>
                                            </div>
                                            <div>
                                                <div className="order-meta-label">Total</div>
                                                <div className="order-meta-val price-tag">₹{order.totalAmount}</div>
                                            </div>
                                            <div>
                                                <div className="order-meta-label">Payment</div>
                                                <div className="order-meta-val" style={{ fontSize: '0.82rem' }}>💵 {order.paymentMethod}</div>
                                            </div>
                                            <div className="order-status-badge" style={{ background: statusColor.bg, color: statusColor.text }}>
                                                ● {order.orderStatus}
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="order-body">
                                            <div className="row g-4">
                                                {/* Tracking */}
                                                <div className="col-lg-7">
                                                    <h6 style={{ fontWeight: 700, marginBottom: 20, fontSize: '0.9rem', color: 'var(--text-dark)' }}>
                                                        📍 Live Order Tracking
                                                    </h6>
                                                    {isCancelled ? (
                                                        <div style={{ background: '#fee2e2', borderRadius: 12, padding: '16px 20px', color: '#dc2626', fontWeight: 600 }}>
                                                            ❌ This order was cancelled.
                                                        </div>
                                                    ) : (
                                                        <div className="tracking-bar-wrap">
                                                            <div className="tracking-bar-bg">
                                                                <motion.div
                                                                    className="tracking-bar-fill"
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${progress}%` }}
                                                                    transition={{ duration: 1, ease: 'easeOut' }}
                                                                />
                                                            </div>
                                                            <div className="tracking-steps">
                                                                {STEP_LABELS.map((label, i) => {
                                                                    const done = stepIdx >= i;
                                                                    return (
                                                                        <div key={label} className="tracking-step">
                                                                            <div style={{ fontSize: '1.3rem', marginBottom: 6, opacity: done ? 1 : 0.3 }}>{STEP_ICONS[i]}</div>
                                                                            <div className={`tracking-dot ${done ? 'done' : ''}`} />
                                                                            <span className={`tracking-step-label ${done ? 'done' : ''}`}>{label}</span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div style={{ background: '#f9fafb', borderRadius: 12, padding: '14px 16px', marginTop: 16 }}>
                                                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: '0.85rem' }}>
                                                            <div><span style={{ color: 'var(--text-muted)' }}>📍 Address:</span> <strong>{order.deliveryAddress}</strong></div>
                                                            <div><span style={{ color: 'var(--text-muted)' }}>📞 Phone:</span> <strong>{order.phone}</strong></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Items */}
                                                <div className="col-lg-5">
                                                    <h6 style={{ fontWeight: 700, marginBottom: 14, fontSize: '0.9rem', color: 'var(--text-dark)' }}>
                                                        🍽️ Ordered Items
                                                    </h6>
                                                    <div style={{ maxHeight: 220, overflowY: 'auto', paddingRight: 4 }}>
                                                        {order.items.map((item, i) => (
                                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                                                                {item.imageUrl && (
                                                                    <img src={item.imageUrl} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                                                                )}
                                                                <div style={{ flex: 1 }}>
                                                                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.name}</div>
                                                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Qty: {item.quantity}</div>
                                                                </div>
                                                                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--primary)' }}>₹{item.price * item.quantity}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontWeight: 800, fontSize: '0.92rem' }}>
                                                        <span>Total</span>
                                                        <span className="price-tag">₹{order.totalAmount}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
