import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const RestaurantCard = ({ restaurant, index = 0 }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            className="dw-card h-100 d-flex flex-column"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
        >
            {/* Image */}
            <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                <img
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#f3f4f6' }}
                    onError={(e) => {
                        if (!e.target.dataset.fallback) {
                            e.target.dataset.fallback = '1';
                            e.target.src = `https://source.unsplash.com/640x420/?${encodeURIComponent(restaurant.cuisine || 'restaurant food')}`;
                        }
                    }}
                />
                <div style={{
                    position: 'absolute', top: 12, left: 12
                }}>
                    <span className="location-badge">
                        📍 {restaurant.location}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex-grow-1 d-flex flex-column">
                <h4 className="fw-bold mb-1" style={{ color: 'var(--text-dark)' }}>{restaurant.name}</h4>
                <p className="small text-muted mb-1">
                    <span style={{ color: 'var(--primary)' }}>●</span> {restaurant.address}
                </p>
                {restaurant.rating && (
                    <p className="small mb-1" style={{ color: '#f59e0b', fontWeight: 600 }}>
                        {'★'.repeat(Math.round(restaurant.rating))}{'☆'.repeat(5 - Math.round(restaurant.rating))}
                        <span style={{ color: '#6b7280', marginLeft: '6px', fontWeight: 400 }}>{restaurant.rating}</span>
                    </p>
                )}
                <p className="text-muted small flex-grow-1 mt-2" style={{ lineHeight: '1.6' }}>
                    {restaurant.description}
                </p>
                <button
                    className="btn btn-primary-custom w-100 mt-3"
                    onClick={() => navigate(`/restaurants/${restaurant._id}`)}
                >
                    View Menu →
                </button>
            </div>
        </motion.div>
    );
};

export default RestaurantCard;
