import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // In a real app, we'd filter by user ID from auth. 
    // For now, we'll show all orders placed in this session/browser local storage or just all for demo.
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get('`http://localhost:5000/api/orders');
                // Sort by newest first
                setOrders(res.data);
            } catch (err) {
                console.error('Error fetching orders:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();

        // Poll for status updates every 10 seconds for "tracking" feel
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return '#16a34a';
            case 'Cancelled': return '#dc2626';
            case 'Out for Delivery': return '#2563eb';
            case 'Preparing': return '#ea580c';
            case 'Confirmed': return '#0891b2';
            default: return '#92400e';
        }
    };

    const getStepProgress = (status) => {
        const steps = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
        const currentIdx = steps.indexOf(status);
        return ((currentIdx + 1) / steps.length) * 100;
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh', marginTop: '70px' }}>
            <div className="spinner-border text-danger" role="status"></div>
        </div>
    );

    return (
        <div style={{ marginTop: '90px', minHeight: '80vh', background: 'var(--bg-secondary)' }} className="py-5">
            <div className="container">
                <div className="d-flex justify-content-between align-items-end mb-4">
                    <div>
                        <span className="section-label">Your Account</span>
                        <h2 className="fw-bold mt-1">Order History & Tracking</h2>
                    </div>
                    <Link to="/" className="btn btn-outline-custom btn-sm">Order More Food</Link>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center bg-white rounded-4 p-5 shadow-sm">
                        <div style={{ fontSize: '4rem' }}>🍽️</div>
                        <h4 className="mt-3 fw-bold">No orders yet</h4>
                        <p className="text-muted">Hungry? Order some delicious food now!</p>
                        <Link to="/" className="btn btn-primary-custom mt-2">Browse Restaurants</Link>
                    </div>
                ) : (
                    <div className="row g-4">
                        {orders.map((order) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="col-12"
                            >
                                <div className="bg-white rounded-4 shadow-sm overflow-hidden">
                                    {/* Header */}
                                    <div className="p-4 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-3" style={{ background: '#fafafa' }}>
                                        <div>
                                            <span className="text-muted small d-block">ORDER ID</span>
                                            <span className="fw-bold font-monospace">#{order._id.slice(-8).toUpperCase()}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted small d-block">RESTAURANT</span>
                                            <span className="fw-bold">{order.restaurantName}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted small d-block">TOTAL AMOUNT</span>
                                            <span className="price-tag">₹{order.totalAmount}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted small d-block">STATUS</span>
                                            <span className="badge rounded-pill" style={{ background: getStatusColor(order.orderStatus) + '20', color: getStatusColor(order.orderStatus), padding: '6px 14px' }}>
                                                ● {order.orderStatus}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <div className="row">
                                            {/* Tracking Progress */}
                                            <div className="col-lg-7 border-end">
                                                <h6 className="fw-bold mb-4">Live Track Status</h6>
                                                <div className="position-relative mb-5" style={{ padding: '0 10px' }}>
                                                    <div style={{ height: '4px', background: '#e5e7eb', width: '100%', borderRadius: '10px' }}>
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${getStepProgress(order.orderStatus)}%` }}
                                                            style={{ height: '100%', background: 'var(--primary)', borderRadius: '10px' }}
                                                        />
                                                    </div>
                                                    <div className="d-flex justify-content-between mt-3 text-center">
                                                        {['Order Placed', 'Confirmed', 'Preparing', 'On the Way', 'Delivered'].map((step, idx) => {
                                                            const steps = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
                                                            const isCompleted = steps.indexOf(order.orderStatus) >= idx;
                                                            return (
                                                                <div key={step} style={{ width: '20%' }}>
                                                                    <div style={{
                                                                        width: '12px', height: '12px', borderRadius: '50%', background: isCompleted ? 'var(--primary)' : '#e5e7eb',
                                                                        margin: '0 auto', marginBottom: '8px', position: 'relative', top: '-21px', border: '3px solid #fff', zIndex: 2
                                                                    }} />
                                                                    <span className="d-block small fw-600" style={{ color: isCompleted ? 'var(--text-dark)' : '#9ca3af', fontSize: '0.7rem' }}>
                                                                        {step}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                <div className="bg-light p-3 rounded-3 mt-4">
                                                    <p className="mb-1 small"><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                                                    <p className="mb-0 small"><strong>Phone:</strong> {order.phone}</p>
                                                </div>
                                            </div>

                                            {/* Items List */}
                                            <div className="col-lg-5 ps-lg-4 mt-4 mt-lg-0">
                                                <h6 className="fw-bold mb-3">Order Items</h6>
                                                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                    {order.items.map((item, i) => (
                                                        <div key={i} className="d-flex align-items-center gap-3 mb-2">
                                                            {item.imageUrl && <img src={item.imageUrl} alt="" style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />}
                                                            <div className="flex-grow-1">
                                                                <span className="small fw-600 d-block">{item.name}</span>
                                                                <span className="text-muted x-small">Qty: {item.quantity}</span>
                                                            </div>
                                                            <span className="small fw-bold">₹{item.price * item.quantity}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
