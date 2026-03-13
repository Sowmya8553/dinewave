import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || \'http://localhost:5000\'}/api/contact`, formData);
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch {
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginTop: '70px', minHeight: '80vh', background: 'var(--bg-secondary)' }} className="py-5">
            <div className="container">
                <div className="text-center mb-5">
                    <span className="section-label">Get In Touch</span>
                    <h2 className="section-title mt-2">Contact Us</h2>
                    <p className="text-muted">Have questions? We'd love to hear from you.</p>
                </div>
                <div className="row g-5 justify-content-center">
                    {/* Contact Info */}
                    <div className="col-lg-4">
                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                            {[{ icon: '📍', title: 'Our Locations', info: 'Chennai | Bangalore | Hyderabad | Coimbatore' },
                            { icon: '📧', title: 'Email', info: 'hello@dinewave.in' },
                            { icon: '📞', title: 'Phone', info: '+91 98765 43210' }
                            ].map(({ icon, title, info }) => (
                                <div key={title} className="d-flex gap-3 mb-4">
                                    <div style={{ fontSize: '2rem', minWidth: '2.5rem' }}>{icon}</div>
                                    <div>
                                        <h6 className="fw-bold mb-1">{title}</h6>
                                        <p className="text-muted small mb-0">{info}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                    {/* Form */}
                    <div className="col-lg-7">
                        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-4 p-5 shadow-sm">
                            <AnimatePresence>
                                {status === 'success' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="alert mb-4" style={{ background: '#d4edda', color: '#155724', border: 'none' }}>
                                        ✅ Message sent! We'll get back to you soon.
                                    </motion.div>
                                )}
                                {status === 'error' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="alert mb-4" style={{ background: '#f8d7da', color: '#721c24', border: 'none' }}>
                                        ❌ Error sending message. Please try again.
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-600">Name</label>
                                        <input name="name" className="form-control form-control-dw" value={formData.name} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-600">Email</label>
                                        <input type="email" name="email" className="form-control form-control-dw" value={formData.email} onChange={handleChange} required />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label fw-600">Subject</label>
                                        <input name="subject" className="form-control form-control-dw" value={formData.subject} onChange={handleChange} required />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label fw-600">Message</label>
                                        <textarea name="message" rows="5" className="form-control form-control-dw" value={formData.message} onChange={handleChange} required />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary-custom w-100 mt-4 py-3" disabled={loading}>
                                    {loading ? 'Sending...' : 'Send Message →'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
