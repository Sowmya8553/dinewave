import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const RestaurantCard = ({ restaurant, index = 0 }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            className="dw-card h-100 d-flex flex-column"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
        >
            {/* Image */}
            <div style={{ height: '210px', overflow: 'hidden', position: 'relative' }}>
                <img
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#f3f4f6' }}
                    onError={(e) => {
                        if (!e.target.dataset.fallback) {
                            e.target.dataset.fallback = '1';
                            e.target.src = `https://images.unsplash.com/photo-1517248135467-4c7ed9d87077?w=640&q=80`;
                        }
                    }}
                />
                {/* Location badge */}
                <div style={{ position: 'absolute', top: 12, left: 12 }}>
                    <span className="location-badge">📍 {restaurant.location}</span>
                </div>
                {/* Rating badge */}
                {restaurant.rating && (
                    <div style={{
                        position: 'absolute', top: 12, right: 12,
                        background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
                        color: '#fff', borderRadius: '8px', padding: '4px 10px',
                        fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                        ⭐ {restaurant.rating}
                    </div>
                )}
                {/* Cuisine tag */}
                {restaurant.cuisine && (
                    <div style={{
                        position: 'absolute', bottom: 12, right: 12,
                        background: 'var(--primary)', color: '#fff',
                        borderRadius: '6px', padding: '3px 10px',
                        fontSize: '0.72rem', fontWeight: 700,
                    }}>
                        {restaurant.cuisine}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex-grow-1 d-flex flex-column" style={{ position: 'relative', zIndex: 1 }}>
                <h4 className="fw-bold mb-1" style={{ fontSize: '1.05rem', color: 'var(--text-dark)' }}>
                    {restaurant.name}
                </h4>
                <p className="small mb-2" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ color: 'var(--primary)', fontSize: '0.7rem' }}>●</span>
                    {restaurant.address}
                </p>
                <p className="text-muted small flex-grow-1" style={{ lineHeight: '1.6', fontSize: '0.83rem' }}>
                    {restaurant.description?.slice(0, 90)}{restaurant.description?.length > 90 ? '…' : ''}
                </p>

                <motion.button
                    className="btn-primary-custom w-100 mt-3"
                    style={{ justifyContent: 'center', borderRadius: '12px', padding: '11px' }}
                    onClick={() => navigate(`/restaurants/${restaurant._id}`)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                >
                    View Menu →
                </motion.button>
            </div>
        </motion.div>
    );
};

export default RestaurantCard;
