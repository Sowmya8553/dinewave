import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <div style={{ marginTop: '70px', minHeight: '80vh' }}>
            {/* Hero */}
            <div style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                color: '#fff',
                padding: '80px 0',
                textAlign: 'center'
            }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <span style={{ fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase', opacity: 0.8 }}>About Us</span>
                    <h1 className="display-4 fw-bold mt-2">About DineWave</h1>
                    <p style={{ maxWidth: '550px', margin: '0 auto', opacity: 0.85, fontSize: '1.1rem' }}>
                        India's premier restaurant discovery and reservation platform.
                    </p>
                </motion.div>
            </div>

            <div className="container py-5">
                <div className="row g-5 align-items-center">
                    <div className="col-lg-6">
                        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                            <span className="section-label">Our Mission</span>
                            <h2 className="section-title mt-2">Connecting You to Great Food</h2>
                            <p className="text-muted mt-3" style={{ lineHeight: '1.8' }}>
                                DineWave was founded with a simple mission: to make extraordinary dining experiences accessible to everyone.
                                We partner with the finest restaurants across Chennai, Bangalore, Hyderabad, and Coimbatore to bring
                                you curated choices, seamless reservations, and an unforgettable culinary journey.
                            </p>
                            <p className="text-muted" style={{ lineHeight: '1.8' }}>
                                Whether you're looking for a romantic dinner, a family celebration, or a business lunch, DineWave
                                connects you to the perfect restaurant with just a few clicks.
                            </p>
                        </motion.div>
                    </div>
                    <div className="col-lg-6">
                        <div className="row g-3">
                            {[
                                { icon: '🏪', title: '50+ Restaurants', desc: 'Carefully curated dining venues across 4 cities' },
                                { icon: '📍', title: '4 Cities', desc: 'Chennai, Bangalore, Hyderabad & Coimbatore' },
                                { icon: '📅', title: 'Easy Reservations', desc: 'Book your table in under 60 seconds' },
                                { icon: '⭐', title: 'Premium Quality', desc: 'Only the best dining experiences, guaranteed' }
                            ].map(({ icon, title, desc }) => (
                                <div className="col-6" key={title}>
                                    <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} viewport={{ once: true }}
                                        className="p-4 text-center" style={{ background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
                                        <div style={{ fontSize: '2.5rem' }}>{icon}</div>
                                        <h6 className="fw-bold mt-2 mb-1">{title}</h6>
                                        <p className="text-muted small mb-0">{desc}</p>
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
