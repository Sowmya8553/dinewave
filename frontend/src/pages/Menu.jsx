import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const CATEGORIES = ['All', 'Starters', 'Main Course', 'Desserts', 'Drinks'];

const Menu = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [added, setAdded] = useState({});

    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/menu`);
                setItems(res.data);
            } catch (err) {
                console.error('Failed to fetch menu items', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);

    const handleAddToCart = (item) => {
        // restaurantId is now populated: { _id, name }
        const restaurant = typeof item.restaurantId === 'object'
            ? { id: item.restaurantId._id, name: item.restaurantId.name }
            : { id: item.restaurantId, name: 'Restaurant' };
        addToCart(item, restaurant);
        setAdded(prev => ({ ...prev, [item._id]: true }));
        setTimeout(() => setAdded(prev => ({ ...prev, [item._id]: false })), 1500);
    };

    const filteredItems = filter === 'All' ? items : items.filter(item => item.category === filter);

    return (
        <div className="container py-5" style={{ marginTop: '80px', minHeight: '80vh' }}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-5">
                <span className="section-label">Our Menu</span>
                <h1 className="section-title mt-2">A Culinary Journey</h1>
                <p className="text-muted">Explore dishes from all our restaurants</p>
            </motion.div>

            {/* Category Filters */}
            <div className="d-flex justify-content-center flex-wrap gap-2 mb-5">
                {CATEGORIES.map(cat => (
                    <button key={cat} className={`cat-pill ${filter === cat ? 'active' : ''}`} onClick={() => setFilter(cat)}>
                        {cat}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border" style={{ color: 'var(--primary)' }} role="status" />
                </div>
            ) : filteredItems.length > 0 ? (
                <div className="row g-4">
                    {filteredItems.map((item, idx) => (
                        <div className="col-12 col-md-6 col-lg-4" key={item._id}>
                            <motion.div
                                className="dw-card h-100 d-flex flex-column"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: idx * 0.07 }}
                            >
                                {/* Image */}
                                <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#f3f4f6' }}
                                        onError={(e) => {
                                            if (!e.target.dataset.fallback) {
                                                e.target.dataset.fallback = '1';
                                                e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';
                                            }
                                        }}
                                    />
                                    <span style={{
                                        position: 'absolute', top: 10, right: 10,
                                        background: 'rgba(200,16,46,0.9)', color: '#fff',
                                        fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '50px'
                                    }}>{item.category}</span>
                                </div>

                                {/* Content */}
                                <div className="p-4 flex-grow-1 d-flex flex-column">
                                    <h5 className="fw-bold mb-1">{item.name}</h5>
                                    <p className="text-muted small flex-grow-1">{item.description}</p>
                                    <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                        <span className="price-tag">₹{item.price}</span>
                                        <button
                                            onClick={() => handleAddToCart(item)}
                                            style={{
                                                background: added[item._id] ? '#16a34a' : 'var(--primary)',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '50px',
                                                padding: '6px 18px',
                                                fontWeight: 700,
                                                fontSize: '0.85rem',
                                                transition: 'background 0.3s',
                                                cursor: 'pointer',
                                                whiteSpace: 'nowrap'
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
                    <div style={{ fontSize: '3rem' }}>🍽️</div>
                    <p className="text-muted fs-5 mt-3">No items found in this category.</p>
                    <p className="small text-muted">Admin can add menu items from the dashboard.</p>
                </div>
            )}
        </div>
    );
};

export default Menu;
