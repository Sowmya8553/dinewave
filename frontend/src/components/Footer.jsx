import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="dw-footer py-4">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-md-4 mb-3 mb-md-0">
                        <span className="fw-bold fs-5">
                            <span style={{ background: 'var(--primary)', color: '#fff', padding: '2px 10px', borderRadius: '6px' }}>Dine</span>
                            <span style={{ color: 'var(--primary)' }}> Wave</span>
                        </span>
                        <p className="small mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                            Discover and dine at the best restaurants across India.
                        </p>
                    </div>
                    <div className="col-md-4 text-center mb-3 mb-md-0">
                        <div className="d-flex justify-content-center gap-4">
                            {[['/', 'Home'], ['/menu', 'Menu'], ['/my-orders', 'My Orders'], ['/about', 'About'], ['/contact', 'Contact']].map(([path, label]) => (
                                <Link key={path} to={path} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}
                                    onMouseOver={e => e.target.style.color = 'var(--primary-light)'}
                                    onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
                                >{label}</Link>
                            ))}
                        </div>
                    </div>
                    <div className="col-md-4 text-md-end">
                        <p className="small mb-0" style={{ color: 'rgba(255,255,255,0.4)' }}>
                            &copy; {new Date().getFullYear()} DineWave. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
