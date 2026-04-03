import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('adminToken')) navigate('/admin/dashboard');
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/login`, { username, password });
            localStorage.setItem('adminToken', res.data.token);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a0005 0%, #C8102E 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Inter, sans-serif'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                    background: '#fff',
                    borderRadius: '20px',
                    padding: '48px',
                    width: '100%',
                    maxWidth: '420px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                }}
            >
                {/* Brand */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ marginBottom: '8px' }}>
                        <span style={{ background: '#C8102E', color: '#fff', padding: '4px 14px', borderRadius: '8px', fontSize: '1.6rem', fontWeight: 900 }}>Dine</span>
                        <span style={{ color: '#C8102E', fontSize: '1.6rem', fontWeight: 900 }}> Wave</span>
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '0.95rem', margin: 0 }}>Admin Portal</p>
                </div>

                {error && (
                    <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#374151', display: 'block', marginBottom: '6px' }}>Username</label>
                        <input
                            type="text"
                            style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: '10px', padding: '11px 14px', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box' }}
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            onFocus={e => e.target.style.borderColor = '#C8102E'}
                            onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                        />
                    </div>
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#374151', display: 'block', marginBottom: '6px' }}>Password</label>
                        <input
                            type="password"
                            style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: '10px', padding: '11px 14px', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box' }}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            onFocus={e => e.target.style.borderColor = '#C8102E'}
                            onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{ width: '100%', background: '#C8102E', color: '#fff', border: 'none', borderRadius: '10px', padding: '13px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? 'Signing in...' : 'Sign In â†’'}
                    </button>
                </form>
                <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.82rem', marginTop: '20px' }}>
                    Default credentials: admin / password123
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLogin;

