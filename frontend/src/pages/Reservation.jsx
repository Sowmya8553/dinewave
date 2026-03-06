import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Reservation = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [formData, setFormData] = useState({
        name: '', phoneNumber: '', email: '',
        date: '', time: '', guests: 2,
        restaurantId: '', restaurantName: ''
    });
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get('`http://localhost:5000/api/restaurants')
            .then(res => setRestaurants(res.data))
            .catch(() => { });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'restaurantId') {
            const r = restaurants.find(r => r._id === value);
            setFormData({ ...formData, restaurantId: value, restaurantName: r ? r.name : '' });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);
        try {
            await axios.post('`http://localhost:5000/api/reservations', formData);
            setStatus('success');
            setFormData({ name: '', phoneNumber: '', email: '', date: '', time: '', guests: 2, restaurantId: '', restaurantName: '' });
        } catch (err) {
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-5" style={{ marginTop: '70px', minHeight: '80vh', background: 'var(--bg-secondary)' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-4 p-5 shadow-sm"
                        >
                            <div className="text-center mb-5">
                                <span className="section-label">Reservations</span>
                                <h2 className="section-title mt-2">Book a Table</h2>
                                <p className="text-muted">Reserve your exceptional dining experience.</p>
                            </div>

                            <AnimatePresence>
                                {status === 'success' && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0 }}
                                        className="alert border-0 rounded-3 mb-4" style={{ background: '#d4edda', color: '#155724' }}>
                                        ✅ Your reservation has been submitted! We will confirm via email.
                                    </motion.div>
                                )}
                                {status === 'error' && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0 }}
                                        className="alert border-0 rounded-3 mb-4" style={{ background: '#f8d7da', color: '#721c24' }}>
                                        ❌ Something went wrong. Please try again.
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-600">Full Name *</label>
                                        <input type="text" name="name" className="form-control form-control-dw" value={formData.name} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-600">Phone Number *</label>
                                        <input type="tel" name="phoneNumber" className="form-control form-control-dw" value={formData.phoneNumber} onChange={handleChange} required />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label fw-600">Email Address *</label>
                                        <input type="email" name="email" className="form-control form-control-dw" value={formData.email} onChange={handleChange} required />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label fw-600">Select Restaurant *</label>
                                        <select name="restaurantId" className="form-control form-control-dw" value={formData.restaurantId} onChange={handleChange} required>
                                            <option value="">-- Choose a Restaurant --</option>
                                            {restaurants.map(r => (
                                                <option key={r._id} value={r._id}>{r.name} — {r.location}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-600">Date *</label>
                                        <input type="date" name="date" className="form-control form-control-dw" value={formData.date} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-600">Time *</label>
                                        <input type="time" name="time" className="form-control form-control-dw" value={formData.time} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-600">No. of Guests *</label>
                                        <input type="number" name="guests" min="1" max="20" className="form-control form-control-dw" value={formData.guests} onChange={handleChange} required />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary-custom w-100 mt-4 py-3" disabled={loading}>
                                    {loading ? 'Submitting...' : 'Confirm Reservation →'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reservation;
