import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isActive = (path) => location.pathname === path;
    const { totalItems } = useCart();

    // ── Search state ──
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searching, setSearching] = useState(false);
    const searchRef = useRef(null);
    const debounceRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // Close on route change
    useEffect(() => {
        setShowDropdown(false);
        setSearchQuery('');
    }, [location.pathname]);

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }
        // Debounce
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            setSearching(true);
            try {
                const [rRes, mRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/restaurants`),
                    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/menu`)
                ]);
                const q = query.toLowerCase();

                const matchedRestaurants = rRes.data
                    .filter(r =>
                        r.name.toLowerCase().includes(q) ||
                        r.cuisine?.toLowerCase().includes(q) ||
                        r.location?.toLowerCase().includes(q)
                    )
                    .slice(0, 4)
                    .map(r => ({ ...r, _type: 'restaurant' }));

                const matchedMenus = mRes.data
                    .filter(m =>
                        m.name.toLowerCase().includes(q) ||
                        m.category?.toLowerCase().includes(q) ||
                        m.description?.toLowerCase().includes(q)
                    )
                    .slice(0, 5)
                    .map(m => ({ ...m, _type: 'dish' }));

                setSearchResults([...matchedRestaurants, ...matchedMenus]);
                setShowDropdown(true);
            } catch (err) {
                console.error('Search error', err);
            } finally {
                setSearching(false);
            }
        }, 280);
    };

    const handleSelect = (result) => {
        setShowDropdown(false);
        setSearchQuery('');
        if (result._type === 'restaurant') {
            navigate(`/restaurants/${result._id}`);
        } else {
            // For a dish, navigate to its restaurant page
            const restId = typeof result.restaurantId === 'object'
                ? result.restaurantId._id
                : result.restaurantId;
            navigate(`/restaurants/${restId}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setShowDropdown(false);
            setSearchQuery('');
        }
    };

    return (
        <motion.nav
            initial={{ y: -80 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="navbar navbar-expand-lg fixed-top dw-navbar"
        >
            <div className="container">
                {/* Brand */}
                <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
                    <span style={{
                        background: 'var(--primary)',
                        color: '#fff',
                        padding: '4px 12px',
                        borderRadius: '8px',
                        fontSize: '1.3rem',
                        fontWeight: 800,
                    }}>Dine</span>
                    <span style={{ color: 'var(--primary)', fontSize: '1.3rem', fontWeight: 800 }}>Wave</span>
                </Link>

                <button
                    className="navbar-toggler border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    {/* ── Search Bar ── */}
                    <div ref={searchRef} className="mx-auto position-relative" style={{ width: '100%', maxWidth: '320px' }}>
                        <div style={{ position: 'relative' }}>
                            <span style={{
                                position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                                color: '#9ca3af', fontSize: '1rem', pointerEvents: 'none'
                            }}>🔍</span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                                onKeyDown={handleKeyDown}
                                placeholder="Search restaurants or dishes..."
                                style={{
                                    width: '100%',
                                    padding: '8px 36px 8px 36px',
                                    borderRadius: '50px',
                                    border: '1.5px solid #e5e7eb',
                                    fontSize: '0.85rem',
                                    outline: 'none',
                                    background: '#f9fafb',
                                    transition: 'border-color 0.2s, box-shadow 0.2s',
                                }}
                                onFocusCapture={(e) => {
                                    e.target.style.borderColor = 'var(--primary)';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(200,16,46,0.1)';
                                    e.target.style.background = '#fff';
                                }}
                                onBlurCapture={(e) => {
                                    e.target.style.borderColor = '#e5e7eb';
                                    e.target.style.boxShadow = 'none';
                                    e.target.style.background = '#f9fafb';
                                }}
                            />
                            {searching && (
                                <span style={{
                                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                                }}>
                                    <span className="spinner-border spinner-border-sm" style={{ color: 'var(--primary)', width: '14px', height: '14px', borderWidth: '2px' }} />
                                </span>
                            )}
                            {searchQuery && !searching && (
                                <button
                                    onClick={() => { setSearchQuery(''); setShowDropdown(false); setSearchResults([]); }}
                                    style={{
                                        position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                                        background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer',
                                        fontSize: '1rem', lineHeight: 1, padding: 0
                                    }}
                                >×</button>
                            )}
                        </div>

                        {/* ── Dropdown Results ── */}
                        <AnimatePresence>
                            {showDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.18 }}
                                    style={{
                                        position: 'absolute',
                                        top: 'calc(100% + 8px)',
                                        left: 0,
                                        right: 0,
                                        background: '#fff',
                                        borderRadius: '14px',
                                        boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                                        zIndex: 9999,
                                        overflow: 'hidden',
                                        border: '1px solid #f0f0f0',
                                    }}
                                >
                                    {searchResults.length === 0 ? (
                                        <div style={{ padding: '16px', textAlign: 'center', color: '#9ca3af', fontSize: '0.85rem' }}>
                                            No results for "{searchQuery}"
                                        </div>
                                    ) : (
                                        <>
                                            {/* Restaurants group */}
                                            {searchResults.filter(r => r._type === 'restaurant').length > 0 && (
                                                <>
                                                    <div style={{ padding: '8px 14px 4px', fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                                        Restaurants
                                                    </div>
                                                    {searchResults.filter(r => r._type === 'restaurant').map(r => (
                                                        <button
                                                            key={r._id}
                                                            onClick={() => handleSelect(r)}
                                                            style={{
                                                                display: 'flex', alignItems: 'center', gap: '10px',
                                                                width: '100%', padding: '10px 14px',
                                                                background: 'none', border: 'none', cursor: 'pointer',
                                                                textAlign: 'left', transition: 'background 0.15s',
                                                            }}
                                                            onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
                                                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                                        >
                                                            <img
                                                                src={r.imageUrl}
                                                                alt={r.name}
                                                                style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                                                                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7ed9d87077?w=100&q=60'; }}
                                                            />
                                                            <div>
                                                                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1a1a1a' }}>{r.name}</div>
                                                                <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>📍 {r.location} · {r.cuisine}</div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </>
                                            )}

                                            {/* Dishes group */}
                                            {searchResults.filter(r => r._type === 'dish').length > 0 && (
                                                <>
                                                    <div style={{ padding: '8px 14px 4px', fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', borderTop: searchResults.filter(r => r._type === 'restaurant').length > 0 ? '1px solid #f3f4f6' : 'none' }}>
                                                        Dishes
                                                    </div>
                                                    {searchResults.filter(r => r._type === 'dish').map(m => (
                                                        <button
                                                            key={m._id}
                                                            onClick={() => handleSelect(m)}
                                                            style={{
                                                                display: 'flex', alignItems: 'center', gap: '10px',
                                                                width: '100%', padding: '10px 14px',
                                                                background: 'none', border: 'none', cursor: 'pointer',
                                                                textAlign: 'left', transition: 'background 0.15s',
                                                            }}
                                                            onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
                                                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                                        >
                                                            <img
                                                                src={m.imageUrl}
                                                                alt={m.name}
                                                                style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                                                                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=60'; }}
                                                            />
                                                            <div>
                                                                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1a1a1a' }}>{m.name}</div>
                                                                <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>🍽️ {m.category} · ₹{m.price}</div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </>
                                            )}
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ── Nav Links ── */}
                    <ul className="navbar-nav align-items-center gap-1 ms-auto">
                        {[['/', 'Home'], ['/menu', 'Menu'], ['/my-orders', 'My Orders'], ['/about', 'About'], ['/contact', 'Contact']].map(([path, label]) => (
                            <li className="nav-item" key={path}>
                                <Link
                                    className="nav-link px-3"
                                    style={{ color: isActive(path) ? 'var(--primary)' : 'var(--text-dark)', fontWeight: isActive(path) ? 700 : 500 }}
                                    to={path}
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}

                        {/* Cart Icon */}
                        <li className="nav-item ms-1">
                            <Link to="/cart" style={{ position: 'relative', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                                <span style={{ fontSize: '1.5rem' }}>🛒</span>
                                {totalItems > 0 && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '-6px',
                                        right: '-8px',
                                        background: 'var(--primary)',
                                        color: '#fff',
                                        borderRadius: '50%',
                                        width: '20px',
                                        height: '20px',
                                        fontSize: '0.7rem',
                                        fontWeight: 700,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        lineHeight: 1
                                    }}>
                                        {totalItems > 9 ? '9+' : totalItems}
                                    </span>
                                )}
                            </Link>
                        </li>

                        <li className="nav-item ms-2">
                            <Link className="btn btn-primary-custom" to="/reservation">Book a Table</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
