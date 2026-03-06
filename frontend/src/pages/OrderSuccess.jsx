import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const method = state?.method || 'COD';
    const total = state?.total || 0;
    const customerName = state?.customerName || 'Guest';

    useEffect(() => {
        window.scrollTo(0, 0);
        // Play confirmation chime
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(() => { });
    }, []);

    return (
        <div
            style={{
                minHeight: '100vh',
                background: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '80px 16px 40px',
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{
                    background: '#fff',
                    borderRadius: '16px',
                    boxShadow: '0 10px 60px rgba(0,0,0,0.08)',
                    maxWidth: '480px',
                    width: '100%',
                    textAlign: 'center',
                    padding: '48px 36px 40px',
                }}
            >
                {/* ── Animated Check Circle ── */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.15 }}
                    style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        border: '3px solid #E91E63',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 28px',
                    }}
                >
                    {/* SVG Checkmark */}
                    <motion.svg
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ delay: 0.45, duration: 0.5 }}
                        viewBox="0 0 24 24"
                        width="38"
                        height="38"
                        fill="none"
                        stroke="#E91E63"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <motion.path
                            d="M5 13l4 4L19 7"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                        />
                    </motion.svg>
                </motion.div>

                {/* ── Greeting ── */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    style={{
                        fontSize: '1rem',
                        color: '#666',
                        marginBottom: '6px',
                        fontWeight: 400,
                    }}
                >
                    Hey {customerName},
                </motion.p>

                {/* ── Title ── */}
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    style={{
                        fontSize: '1.65rem',
                        fontWeight: 800,
                        color: '#1a1a1a',
                        marginBottom: '10px',
                        letterSpacing: '-0.3px',
                    }}
                >
                    Your Order is Confirmed!
                </motion.h2>

                {/* ── Subtitle ── */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    style={{
                        fontSize: '0.92rem',
                        color: '#999',
                        lineHeight: 1.7,
                        marginBottom: '28px',
                        maxWidth: '340px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}
                >
                    {method === 'COD'
                        ? 'We\'ll deliver your food soon. Please keep ₹' + total.toFixed(0) + ' ready for Cash on Delivery.'
                        : 'Payment of ₹' + total.toFixed(0) + ' received! Your delicious meal is now being prepared.'}
                </motion.p>

                {/* ── Order Details Mini Card ── */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    style={{
                        background: '#fafafa',
                        border: '1px solid #f0f0f0',
                        borderRadius: '12px',
                        padding: '16px 20px',
                        marginBottom: '28px',
                        display: 'flex',
                        justifyContent: 'space-around',
                        gap: '16px',
                    }}
                >
                    <div>
                        <p style={{ fontSize: '0.75rem', color: '#999', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Payment</p>
                        <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#333', marginBottom: 0 }}>
                            {method === 'COD' ? '💵 Cash' : '💳 Online'}
                        </p>
                    </div>
                    <div style={{ width: '1px', background: '#eee' }} />
                    <div>
                        <p style={{ fontSize: '0.75rem', color: '#999', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total</p>
                        <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#E91E63', marginBottom: 0 }}>₹{total.toFixed(0)}</p>
                    </div>
                    <div style={{ width: '1px', background: '#eee' }} />
                    <div>
                        <p style={{ fontSize: '0.75rem', color: '#999', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</p>
                        <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#22c55e', marginBottom: 0 }}>✓ Placed</p>
                    </div>
                </motion.div>

                {/* ── CTA Button ── */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.85 }}
                >
                    <Link
                        to="/my-orders"
                        style={{
                            display: 'inline-block',
                            background: '#E91E63',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            letterSpacing: '1.2px',
                            textTransform: 'uppercase',
                            padding: '14px 48px',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            boxShadow: '0 4px 15px rgba(233,30,99,0.25)',
                            transition: 'all 0.3s ease',
                            marginBottom: '14px',
                        }}
                        onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(233,30,99,0.35)'; }}
                        onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(233,30,99,0.25)'; }}
                    >
                        CHECK STATUS
                    </Link>
                </motion.div>

                {/* ── Secondary Link ── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    <Link
                        to="/"
                        style={{
                            display: 'inline-block',
                            marginTop: '12px',
                            fontSize: '0.85rem',
                            color: '#aaa',
                            textDecoration: 'none',
                            transition: 'color 0.2s',
                        }}
                        onMouseEnter={e => { e.target.style.color = '#E91E63'; }}
                        onMouseLeave={e => { e.target.style.color = '#aaa'; }}
                    >
                        ← Back to Home
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default OrderSuccess;
