import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="dw-footer">
            <div className="container py-5">
                <div className="row g-5">
                    {/* Brand Column */}
                    <div className="col-lg-4">
                        <div className="footer-brand-name">
                            <span style={{ background: 'var(--primary)', color: '#fff', padding: '2px 10px', borderRadius: '7px' }}>Dine</span>
                            <span style={{ color: 'var(--primary-light)' }}> Wave</span>
                        </div>
                        <p className="footer-tagline">
                            India's premier restaurant discovery &amp; food ordering platform. Bringing the finest dining experiences to your doorstep.
                        </p>
                        <div className="footer-socials">
                            {[
                                { icon: '📘', label: 'Facebook' },
                                { icon: '📸', label: 'Instagram' },
                                { icon: '🐦', label: 'Twitter' },
                                { icon: '▶️', label: 'YouTube' },
                            ].map(({ icon, label }) => (
                                <a key={label} href="#" className="footer-social-btn" aria-label={label} title={label}>{icon}</a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-6 col-lg-2">
                        <div className="footer-col-title">Explore</div>
                        {[['/', 'Home'], ['/menu', 'Menu'], ['/about', 'About Us'], ['/contact', 'Contact']].map(([path, label]) => (
                            <Link key={path} to={path} className="footer-link">{label}</Link>
                        ))}
                    </div>

                    {/* Account */}
                    <div className="col-6 col-lg-2">
                        <div className="footer-col-title">Account</div>
                        {[['/my-orders', 'My Orders'], ['/cart', 'My Cart'], ['/reservation', 'Reservations'], ['/admin', 'Admin']].map(([path, label]) => (
                            <Link key={path} to={path} className="footer-link">{label}</Link>
                        ))}
                    </div>

                    {/* Cities */}
                    <div className="col-lg-4">
                        <div className="footer-col-title">We Serve</div>
                        <div className="row g-2">
                            {[
                                { city: 'Chennai', emoji: '🌊' },
                                { city: 'Bangalore', emoji: '🌿' },
                                { city: 'Hyderabad', emoji: '🏰' },
                                { city: 'Coimbatore', emoji: '🏔️' },
                            ].map(({ city, emoji }) => (
                                <div className="col-6" key={city}>
                                    <div style={{
                                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: '10px', padding: '10px 14px', fontSize: '0.85rem',
                                        color: 'rgba(255,255,255,0.6)', fontWeight: 500,
                                    }}>
                                        {emoji} {city}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '16px', padding: '14px', background: 'rgba(230,57,70,0.12)', borderRadius: '12px', border: '1px solid rgba(230,57,70,0.2)' }}>
                            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>📞 Customer Support</div>
                            <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>+91 98765 43210</div>
                            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Mon–Sun, 9 AM – 11 PM</div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <p className="footer-bottom-text mb-0">
                            &copy; {new Date().getFullYear()} DineWave. All rights reserved. Made with ❤️ in India.
                        </p>
                        <div className="d-flex gap-3">
                            {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map(t => (
                                <a key={t} href="#" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', transition: 'color 0.2s' }}
                                    onMouseOver={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
                                    onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.3)'}
                                >{t}</a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
