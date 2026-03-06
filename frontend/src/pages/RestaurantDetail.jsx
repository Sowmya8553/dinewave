import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const CATEGORIES = ['All', 'Starters', 'Main Course', 'Desserts', 'Drinks'];

const RestaurantDetail = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [rRes, mRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/restaurants/${id}`),
                    axios.get(`http://localhost:5000/api/menu?restaurantId=${id}`)
                ]);
                setRestaurant(rRes.data);
                setMenuItems(mRes.data);
            } catch (err) {
                console.error('Error loading restaurant', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleAddToCart = (item) => {
        addToCart(item, { id: restaurant._id, name: restaurant.name });
        setAdded(prev => ({ ...prev, [item._id]: true }));
        setTimeout(() => setAdded(prev => ({ ...prev, [item._id]: false })), 1500);
    };

    const filtered = filter === 'All' ? menuItems : menuItems.filter(m => m.category === filter);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="spinner-border" style={{ color: 'var(--primary)', width: '3rem', height: '3rem' }} />
        </div>
    );

    if (!restaurant) return (
        <div className="container text-center py-5" style={{ marginTop: '80px' }}>
            <h2>Restaurant not found</h2>
            <Link to="/" className="btn btn-primary-custom mt-3">Go Home</Link>
        </div>
    );

    return (
        <div style={{ marginTop: '70px' }}>
            {/* ── Hero ── */}
            <div style={{
                height: '380px',
                backgroundImage: `linear-gradient(to bottom, rgba(26,0,5,0.55), rgba(200,16,46,0.3)), url(${restaurant.imageUrl || '/images/hero_bg.png'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }} className="d-flex align-items-center">
                <div className="container">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="location-badge mb-3 d-inline-block">📍 {restaurant.location}</span>
                        <h1 className="display-4 fw-bold text-white mb-1">{restaurant.name}</h1>
                        <p className="text-white-50 mb-2">{restaurant.address}</p>
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <span style={{ color: '#fbbf24', fontWeight: 700 }}>
                                {'★'.repeat(Math.round(restaurant.rating || 4))}{'☆'.repeat(5 - Math.round(restaurant.rating || 4))} {restaurant.rating || '4.0'}
                            </span>
                            {restaurant.cuisine && <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>• {restaurant.cuisine}</span>}
                        </div>
                        <p className="text-white" style={{ maxWidth: '600px', opacity: 0.85 }}>{restaurant.description}</p>
                    </motion.div>
                </div>
            </div>

            {/* ── Menu Section ── */}
            <div className="container py-5">
                <div className="text-center mb-5">
                    <span className="section-label">Our Menu</span>
                    <h2 className="section-title mt-1">What We Serve</h2>
                </div>

                {/* Category Filters */}
                <div className="d-flex justify-content-center flex-wrap gap-2 mb-4">
                    {CATEGORIES.map(cat => (
                        <button key={cat} className={`cat-pill ${filter === cat ? 'active' : ''}`} onClick={() => setFilter(cat)}>
                            {cat}
                        </button>
                    ))}
                </div>

                {filtered.length > 0 ? (
                    <div className="row g-4">
                        {filtered.map((item, idx) => (
                            <div className="col-12 col-md-6 col-lg-4" key={item._id}>
                                <motion.div
                                    className="dw-card h-100 d-flex flex-column"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.06 }}
                                >
                                    <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#f3f4f6' }}
                                            onError={(e) => {
                                                if (!e.target.dataset.fallback) {
                                                    e.target.dataset.fallback = '1';
                                                    e.target.src = `https://source.unsplash.com/500x350/?${encodeURIComponent(item.name + ' food dish')}`;
                                                }
                                            }}
                                        />
                                        <span style={{
                                            position: 'absolute', top: 10, right: 10,
                                            background: 'rgba(200,16,46,0.9)', color: '#fff',
                                            fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '50px'
                                        }}>{item.category}</span>
                                    </div>
                                    <div className="p-4 flex-grow-1 d-flex flex-column">
                                        <h5 className="fw-bold mb-1">{item.name}</h5>
                                        <p className="text-muted small flex-grow-1">{item.description}</p>
                                        <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                            <span className="price-tag">₹{item.price}</span>
                                            <button
                                                className="btn btn-sm"
                                                onClick={() => handleAddToCart(item)}
                                                style={{
                                                    background: added[item._id] ? '#16a34a' : 'var(--primary)',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '50px',
                                                    padding: '6px 18px',
                                                    fontWeight: 700,
                                                    transition: 'background 0.3s',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {added[item._id] ? '✓ Added' : '+ Add to Cart'}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-5">
                        <p className="text-muted">No menu items in this category yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantDetail;
