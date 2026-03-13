import React from 'react';
import { motion } from 'framer-motion';

const ModernCard = ({ item }) => {
    return (
        <motion.div
            className="glass-card h-100 d-flex flex-column"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <div style={{ position: 'relative', height: '220px', overflow: 'hidden', borderRadius: '10px', marginBottom: '15px' }}>
                <img
                    src={item.imageUrl}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    className="card-image-hover"
                />
                {item.category && (
                    <span
                        className="badge position-absolute top-0 end-0 m-2"
                        style={{ backgroundColor: 'var(--primary-color)', color: '#000', fontWeight: 'bold' }}
                    >
                        {item.category}
                    </span>
                )}
            </div>
            <div className="flex-grow-1">
                <h4 className="fw-bold mb-2 text-white">{item.name}</h4>
                <p className="text-muted small mb-3">{item.description}</p>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-auto border-top border-secondary pt-3" style={{ borderColor: 'var(--glass-border) !important' }}>
                <span className="fs-4 fw-bold" style={{ color: 'var(--primary-color)' }}>${item.price.toFixed(2)}</span>
                <button className="btn btn-sm btn-outline-light rounded-pill px-3 py-1" style={{ fontSize: '0.9rem' }}>
                    Add to Order
                </button>
            </div>
        </motion.div>
    );
};

export default ModernCard;

