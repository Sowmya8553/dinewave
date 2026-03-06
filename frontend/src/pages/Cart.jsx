import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cartItems, cartRestaurant, updateQuantity, removeFromCart, totalAmount, clearCart } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh', marginTop: '70px' }}>
                <div style={{ fontSize: '5rem' }}>🛒</div>
                <h3 className="fw-bold mt-3">Your cart is empty</h3>
                <p className="text-muted">Add dishes from a restaurant to get started</p>
                <Link to="/" className="btn btn-primary-custom mt-3 px-5">Browse Restaurants</Link>
            </div>
        );
    }

    return (
        <div style={{ marginTop: '70px', minHeight: '80vh', background: 'var(--bg-secondary)' }} className="py-5">
            <div className="container">
                <div className="row g-4">
                    {/* Cart Items */}
                    <div className="col-lg-8">
                        <div className="bg-white rounded-4 p-4 shadow-sm">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4 className="fw-bold mb-0">Your Cart</h4>
                                <div>
                                    <span className="location-badge me-3">🏪 {cartRestaurant?.name}</span>
                                    <button onClick={clearCart} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                                        Clear Cart
                                    </button>
                                </div>
                            </div>

                            <AnimatePresence>
                                {cartItems.map(item => (
                                    <motion.div
                                        key={item._id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="d-flex align-items-center gap-3 py-3 border-bottom"
                                    >
                                        <img src={item.imageUrl} alt={item.name}
                                            style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }} />
                                        <div className="flex-grow-1">
                                            <h6 className="fw-bold mb-0">{item.name}</h6>
                                            <span style={{ color: 'var(--primary)', fontSize: '0.8rem' }}>{item.category}</span>
                                        </div>
                                        {/* Quantity Controls */}
                                        <div className="d-flex align-items-center gap-2">
                                            <button onClick={() => updateQuantity(item._id, -1)}
                                                style={{ width: '30px', height: '30px', border: '1.5px solid var(--primary)', background: 'none', borderRadius: '50%', cursor: 'pointer', color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                                            <span style={{ fontWeight: 700, width: '24px', textAlign: 'center' }}>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item._id, 1)}
                                                style={{ width: '30px', height: '30px', border: '1.5px solid var(--primary)', background: 'var(--primary)', borderRadius: '50%', cursor: 'pointer', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                                        </div>
                                        <div style={{ minWidth: '70px', textAlign: 'right' }}>
                                            <span className="price-tag">₹{(item.price * item.quantity).toFixed(0)}</span>
                                        </div>
                                        <button onClick={() => removeFromCart(item._id)}
                                            style={{ background: '#fee2e2', border: 'none', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', color: '#dc2626', fontSize: '1rem' }}>🗑️</button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="col-lg-4">
                        <div className="bg-white rounded-4 p-4 shadow-sm sticky-top" style={{ top: '90px' }}>
                            <h5 className="fw-bold mb-4">Order Summary</h5>
                            {cartItems.map(item => (
                                <div key={item._id} className="d-flex justify-content-between mb-2 small">
                                    <span>{item.name} × {item.quantity}</span>
                                    <span>₹{(item.price * item.quantity).toFixed(0)}</span>
                                </div>
                            ))}
                            <hr />
                            <div className="d-flex justify-content-between fw-bold mb-4">
                                <span>Total</span>
                                <span className="price-tag fs-5">₹{totalAmount.toFixed(0)}</span>
                            </div>
                            <button className="btn btn-primary-custom w-100 py-3 fw-bold" onClick={() => navigate('/checkout')}>
                                Proceed to Checkout →
                            </button>
                            <Link to="/" className="btn btn-outline-custom w-100 mt-2">Add More Items</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
