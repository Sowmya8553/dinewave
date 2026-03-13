import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const OrderSuccess = () => {
    const { state } = useLocation();
    const method = state?.method || 'COD';
    const total = state?.total || 0;
    const customerName = state?.customerName || 'Guest';
    const taxes = Math.round(total * 0.05);
    const grandTotal = total + taxes;

    useEffect(() => {
        window.scrollTo(0, 0);
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(() => { });
    }, []);

    return (
        <div className="success-page">
            <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="success-card"
            >
                {/* Animated Check */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.15 }}
                    className="success-icon-ring"
                >
                    <motion.svg
                        viewBox="0 0 24 24" width="42" height="42" fill="none"
                        stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    >
                        <motion.path
                            d="M5 13l4 4L19 7"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                        />
                    </motion.svg>
                </motion.div>

                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="success-greeting">
                    Hey {customerName} 👋
                </motion.p>

                <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="success-title">
                    Order Confirmed! 🎉
                </motion.h2>

                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                    className="success-subtitle">
                    We'll deliver your food soon. Please keep <strong>₹{grandTotal.toFixed(0)}</strong> ready for Cash on Delivery.
                </motion.p>

                {/* Details Card */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                    className="success-details">
                    <div>
                        <div className="success-detail-label">Payment</div>
                        <div className="success-detail-val">💵 Cash</div>
                    </div>
                    <div className="success-detail-sep" />
                    <div>
                        <div className="success-detail-label">Total</div>
                        <div className="success-detail-val" style={{ color: 'var(--primary)' }}>₹{grandTotal.toFixed(0)}</div>
                    </div>
                    <div className="success-detail-sep" />
                    <div>
                        <div className="success-detail-label">Status</div>
                        <div className="success-detail-val" style={{ color: '#22c55e' }}>✔️ Placed</div>
                    </div>
                </motion.div>

                {/* Estimated Time */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
                    style={{ background: 'rgba(230,57,70,0.06)', borderRadius: 12, padding: '12px 20px', marginBottom: 24, border: '1px solid rgba(230,57,70,0.12)' }}>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 3 }}>⏱️ Estimated Delivery</div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-dark)' }}>30 – 45 minutes</div>
                </motion.div>

                {/* CTA */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}>
                    <Link to="/my-orders" className="success-cta">Track My Order →</Link>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                    <Link to="/" className="success-back">← Back to Home</Link>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default OrderSuccess;
