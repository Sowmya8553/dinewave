import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import RestaurantCard from '../components/RestaurantCard';

const CITIES = ['Chennai', 'Bangalore', 'Hyderabad', 'Coimbatore'];

// Map approximate city center coords to city names for geolocation
const getCityFromCoords = (lat, lon) => {
    const cities = [
        { name: 'Chennai', lat: 13.07, lon: 80.27 },
        { name: 'Bangalore', lat: 12.97, lon: 77.59 },
        { name: 'Hyderabad', lat: 17.38, lon: 78.49 },
        { name: 'Coimbatore', lat: 11.01, lon: 76.97 }
    ];
    let closest = null, minDist = Infinity;
    cities.forEach(city => {
        const dist = Math.sqrt(Math.pow(lat - city.lat, 2) + Math.pow(lon - city.lon, 2));
        if (dist < minDist) { minDist = dist; closest = city.name; }
    });
    return closest;
};

const Home = () => {
    const [selectedCity, setSelectedCity] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [geoStatus, setGeoStatus] = useState('idle'); // idle | detecting | detected | denied

    // Auto-detect location on mount
    useEffect(() => {
        if (navigator.geolocation) {
            setGeoStatus('detecting');
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const city = getCityFromCoords(pos.coords.latitude, pos.coords.longitude);
                    setGeoStatus('detected');
                    setSelectedCity(city);
                },
                () => {
                    setGeoStatus('denied');
                },
                { timeout: 8000 }
            );
        } else {
            setGeoStatus('denied');
        }
    }, []);

    useEffect(() => {
        if (selectedCity) fetchRestaurants(selectedCity);
    }, [selectedCity]);

    const fetchRestaurants = async (city) => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/restaurants?location=${city}`);
            setRestaurants(res.data);
        } catch (err) {
            console.error('Failed to fetch restaurants', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* ── Hero ── */}
            <div
                className="position-relative d-flex align-items-center justify-content-center"
                style={{
                    minHeight: '100vh',
                    backgroundImage: 'url("https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1600&q=80")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            >
                <div className="hero-overlay position-absolute top-0 start-0 w-100 h-100" />
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9 }}
                    className="text-center text-white position-relative px-3"
                    style={{ zIndex: 2 }}
                >
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="mb-3">
                        <span style={{ background: 'var(--primary)', color: '#fff', padding: '6px 20px', borderRadius: '10px', fontSize: '2.8rem', fontWeight: 900, display: 'inline-block', marginRight: 8 }}>Dine</span>
                        <span style={{ fontSize: '2.8rem', fontWeight: 900 }}>Wave</span>
                    </motion.div>
                    <h2 className="fw-light mb-4" style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,0.85)' }}>
                        Discover & Reserve the finest restaurants near you
                    </h2>
                    <div className="d-flex gap-3 justify-content-center flex-wrap">
                        <Link to="/reservation" className="btn btn-primary-custom btn-lg px-5">Book a Table</Link>
                        <Link to="/menu" className="btn btn-light btn-lg px-5 rounded-pill">Explore Menu</Link>
                    </div>
                </motion.div>
            </div>

            {/* ── Location Section ── */}
            <div style={{ background: 'var(--bg-secondary)' }} className="py-5">
                <div className="container">
                    <div className="text-center mb-4">
                        <span className="section-label">📍 Location</span>
                        <h2 className="section-title mt-2">Find Restaurants Near You</h2>

                        {/* Geolocation status */}
                        {geoStatus === 'detecting' && (
                            <p className="text-muted mt-2">
                                <span className="spinner-border spinner-border-sm me-2" style={{ color: 'var(--primary)' }} />
                                Detecting your location...
                            </p>
                        )}
                        {geoStatus === 'detected' && (
                            <p style={{ color: '#16a34a', fontWeight: 600, marginTop: '8px' }}>
                                📍 Location detected: <strong>{selectedCity}</strong>
                            </p>
                        )}
                        {geoStatus === 'denied' && (
                            <p className="text-muted mt-2" style={{ fontSize: '0.9rem' }}>
                                📍 Location access denied — please select your city below
                            </p>
                        )}
                    </div>

                    {/* City Buttons */}
                    <div className="d-flex justify-content-center gap-3 flex-wrap mb-5">
                        {CITIES.map((city) => (
                            <motion.button
                                key={city}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedCity(city)}
                                className="d-flex flex-column align-items-center p-4 border rounded-4"
                                style={{
                                    minWidth: '140px', cursor: 'pointer',
                                    background: selectedCity === city ? 'var(--primary)' : '#fff',
                                    color: selectedCity === city ? '#fff' : 'var(--text-dark)',
                                    border: selectedCity === city ? '2px solid var(--primary)' : '2px solid #e5e7eb',
                                    transition: 'all 0.25s', fontWeight: 700, fontSize: '1rem'
                                }}
                            >
                                <span style={{ fontSize: '2rem', marginBottom: '6px' }}>
                                    {city === 'Chennai' ? '🌊' : city === 'Bangalore' ? '🌿' : city === 'Hyderabad' ? '🏰' : '🏔️'}
                                </span>
                                {city}
                            </motion.button>
                        ))}
                    </div>

                    {/* Results */}
                    <AnimatePresence>
                        {selectedCity && (
                            <motion.div key={selectedCity} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                                <h4 className="fw-bold mb-4 text-center">
                                    Restaurants in <span style={{ color: 'var(--primary)' }}>{selectedCity}</span>
                                </h4>
                                {loading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border" style={{ color: 'var(--primary)' }} role="status" />
                                    </div>
                                ) : restaurants.length > 0 ? (
                                    <div className="row g-4">
                                        {restaurants.map((r, i) => (
                                            <div className="col-12 col-md-6 col-lg-4" key={r._id}>
                                                <RestaurantCard restaurant={r} index={i} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-5">
                                        <p className="text-muted">No restaurants found in {selectedCity} yet.</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!selectedCity && geoStatus !== 'detecting' && (
                        <p className="text-center text-muted mt-2">👆 Select a city above to see restaurants</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
