import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cartItems, cartRestaurant, updateQuantity, removeFromCart, totalAmount, clearCart } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg,#FDF2F2 0%,#fff 60%)', paddingTop: '70px' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '16px', animation: 'float 3s ease-in-out infinite' }}>🛒</div>
                    <h2 style={{ fontWeight: 800, fontSize: '1.6rem', color: 'var(--text-dark)', marginBottom: '8px' }}>Your Cart is Empty</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '28px' }}>Looks like you haven't added anything yet. Let's fix that!</p>
                    <Link to="/" className="btn-primary-custom" style={{ padding: '13px 40px', fontSize: '1rem' }}>Browse Restaurants</Link>
                </motion.div>
            </div>
        );
    }

    const taxes = Math.round(totalAmount * 0.05);
    const grandTotal = totalAmount + taxes;

    return (
        <div className="cart-page">
            <div className="container">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="cart-header">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div>
                            <h1 className="cart-title">Your Cart 🛒</h1>
                            <p className="cart-subtitle">
                                <span className="location-badge">🏪 {cartRestaurant?.name}</span>
                                <span style={{ marginLeft: 10, color: 'var(--text-muted)', fontSize: '0.85rem' }}>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</span>
                            </p>
                        </div>
                        <button onClick={clearCart} style={{ background: '#fee2e2', border: 'none', color: '#dc2626', borderRadius: '8px', padding: '8px 18px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
                            🗑️ Clear Cart
                        </button>
                    </div>
                </motion.div>

                <div className="row g-4">
                    {/* Cart Items */}
                    <div className="col-lg-8">
                        <AnimatePresence>
                            {cartItems.map((item, idx) => (
                                <motion.div
                                    key={item._id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0 }}
                                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                                    className="cart-item-card"
                                >
                                    <div className="cart-item-inner">
                                        <img src={item.imageUrl} alt={item.name} className="cart-item-img"
                                            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=60'; }} />
                                        <div className="cart-item-info">
                                            <div className="cart-item-name">{item.name}</div>
                                            <div className="cart-item-cat">{item.category}</div>
                                            <div style={{ marginTop: 6, fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.82rem' }}>₹{item.price} each</div>
                                        </div>
                                        <div className="qty-controls">
                                            <button className="qty-btn qty-btn-minus" onClick={() => updateQuantity(item._id, -1)}>−</button>
                                            <span className="qty-count">{item.quantity}</span>
                                            <button className="qty-btn qty-btn-plus" onClick={() => updateQuantity(item._id, +1)}>+</button>
                                        </div>
                                        <div className="cart-item-price">₹{(item.price * item.quantity).toFixed(0)}</div>
                                        <button className="remove-btn" onClick={() => removeFromCart(item._id)} title="Remove">🗑️</button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Summary */}
                    <div className="col-lg-4">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="cart-summary-card">
                            <div className="cart-summary-title">Order Summary</div>

                            {cartItems.map(item => (
                                <div key={item._id} className="cart-summary-row">
                                    <span style={{ maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name} × {item.quantity}</span>
                                    <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toFixed(0)}</span>
                                </div>
                            ))}

                            <div style={{ background: '#fafafa', borderRadius: 12, padding: '14px 16px', margin: '16px 0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.88rem', color: 'var(--text-body)' }}>
                                    <span>Subtotal</span><span>₹{totalAmount.toFixed(0)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.88rem', color: 'var(--text-body)' }}>
                                    <span>Delivery</span><span style={{ color: '#16a34a', fontWeight: 700 }}>FREE</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-body)' }}>
                                    <span>GST (5%)</span><span>₹{taxes}</span>
                                </div>
                            </div>

                            <div className="cart-total-row">
                                <span>Grand Total</span>
                                <span className="price-tag" style={{ fontSize: '1.2rem' }}>₹{grandTotal.toFixed(0)}</span>
                            </div>

                            <motion.button
                                className="btn-primary-custom w-100 mt-4"
                                style={{ padding: '14px', fontSize: '1rem', borderRadius: 12, justifyContent: 'center' }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/checkout')}
                            >
                                Proceed to Checkout →
                            </motion.button>
                            <Link to="/" className="btn-outline-custom w-100 mt-2" style={{ justifyContent: 'center', borderRadius: 12 }}>
                                + Add More Items
                            </Link>

                            <div style={{ marginTop: 16, textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                🔒 Secure Checkout · Cash on Delivery
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
