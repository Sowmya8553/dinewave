import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CITIES = ['Chennai', 'Bangalore', 'Hyderabad', 'Coimbatore'];
const CATEGORIES = ['Starters', 'Main Course', 'Desserts', 'Drinks'];

const api = (token) => axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    headers: { Authorization: `Bearer ${token}` }
});

const Dashboard = () => {
    const navigate = useNavigate();
    const [token] = useState(localStorage.getItem('adminToken'));
    const [activeTab, setActiveTab] = useState('overview');
    const [restaurants, setRestaurants] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [orders, setOrders] = useState([]);

    const [restForm, setRestForm] = useState({ name: '', imageUrl: '', location: 'Chennai', address: '', description: '', cuisine: 'Multi-Cuisine', rating: 4.0 });
    const [menuForm, setMenuForm] = useState({ name: '', description: '', price: '', category: 'Starters', imageUrl: '', restaurantId: '' });

    useEffect(() => {
        if (!token) { navigate('/admin'); return; }
        fetchAll();
    }, []);

    const fetchAll = async () => {
        try {
            const [rRes, mRes, rvRes, cRes, oRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/restaurants`),
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/menu`),
                api(token).get('/api/reservations'),
                api(token).get('/api/contact'),
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`),
            ]);
            setRestaurants(rRes.data);
            setMenuItems(mRes.data);
            setReservations(rvRes.data);
            setMessages(cRes.data);
            setOrders(oRes.data);
        } catch (err) { console.error(err); }
    };

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/${orderId}/status`, { orderStatus: newStatus });
            fetchAll();
        } catch { alert('Failed to update order status'); }
    };

    const handleLogout = () => { localStorage.removeItem('adminToken'); navigate('/admin'); };

    const handleAddRestaurant = async (e) => {
        e.preventDefault();
        try {
            await api(token).post('/api/restaurants', restForm);
            setRestForm({ name: '', imageUrl: '', location: 'Chennai', address: '', description: '', cuisine: 'Multi-Cuisine', rating: 4.0 });
            fetchAll();
        } catch { alert('Failed to add restaurant'); }
    };

    const handleDeleteRestaurant = async (id) => {
        if (!window.confirm('Delete this restaurant?')) return;
        try { await api(token).delete(`/api/restaurants/${id}`); fetchAll(); }
        catch { alert('Failed to delete'); }
    };

    const handleAddMenuItem = async (e) => {
        e.preventDefault();
        try {
            await api(token).post('/api/menu', { ...menuForm, price: parseFloat(menuForm.price) });
            setMenuForm({ name: '', description: '', price: '', category: 'Starters', imageUrl: '', restaurantId: '' });
            fetchAll();
        } catch { alert('Failed to add menu item'); }
    };

    const handleDeleteMenuItem = async (id) => {
        if (!window.confirm('Delete this item?')) return;
        try { await api(token).delete(`/api/menu/${id}`); fetchAll(); }
        catch { alert('Failed to delete'); }
    };

    const tabs = [
        { key: 'overview', label: '📊 Overview' },
        { key: 'restaurants', label: '🏪 Restaurants' },
        { key: 'menu', label: '🍽️ Menu Items' },
        { key: 'orders', label: `📦 Orders${orders.length ? ` (${orders.length})` : ''}` },
        { key: 'reservations', label: '📅 Reservations' },
        { key: 'messages', label: '✉️ Messages' },
    ];

    const statCards = [
        { icon: '🏪', label: 'Restaurants', value: restaurants.length, bg: 'rgba(230,57,70,0.1)', color: 'var(--primary)' },
        { icon: '🍽️', label: 'Menu Items', value: menuItems.length, bg: 'rgba(37,99,235,0.1)', color: '#2563eb' },
        { icon: '📦', label: 'Orders', value: orders.length, bg: 'rgba(16,185,129,0.1)', color: '#059669' },
        { icon: '📅', label: 'Reservations', value: reservations.length, bg: 'rgba(245,158,11,0.1)', color: '#d97706' },
    ];

    return (
        <div className="admin-layout">
            {/* Top Bar */}
            <div className="admin-topbar">
                <div className="admin-brand">
                    <span className="admin-brand-box">Dine</span>
                    <span>Wave Admin</span>
                </div>
                <button onClick={handleLogout} className="admin-logout-btn">Logout →</button>
            </div>

            <div className="admin-body">
                {/* Sidebar */}
                <div className="admin-sidebar">
                    {tabs.map(t => (
                        <button
                            key={t.key}
                            onClick={() => setActiveTab(t.key)}
                            className={`admin-sidebar-link ${activeTab === t.key ? 'active' : ''}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <div className="admin-main">

                    {/* ── Overview ── */}
                    {activeTab === 'overview' && (
                        <div>
                            <div className="admin-section-title">📊 Dashboard Overview</div>
                            <div className="admin-stats-row">
                                {statCards.map(s => (
                                    <div key={s.label} className="admin-stat-card">
                                        <div className="admin-stat-icon" style={{ background: s.bg, color: s.color }}>
                                            {s.icon}
                                        </div>
                                        <div>
                                            <div className="admin-stat-val" style={{ color: s.color }}>{s.value}</div>
                                            <div className="admin-stat-label">{s.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Recent Orders */}
                            <div className="admin-card">
                                <div className="admin-card-pad">
                                    <div className="admin-card-title">🕒 Recent Orders</div>
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                {['Customer', 'Restaurant', 'Total', 'Payment', 'Status'].map(h => <th key={h}>{h}</th>)}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.slice(0, 5).map(o => (
                                                <tr key={o._id}>
                                                    <td><strong>{o.customerName}</strong></td>
                                                    <td>{o.restaurantName}</td>
                                                    <td style={{ color: 'var(--primary)', fontWeight: 700 }}>₹{o.totalAmount}</td>
                                                    <td><span style={{ background: '#fef9c3', color: '#92400e', padding: '3px 10px', borderRadius: 50, fontSize: '0.78rem', fontWeight: 600 }}>💵 {o.paymentMethod}</span></td>
                                                    <td><span style={{ background: o.orderStatus === 'Delivered' ? '#d1fae5' : o.orderStatus === 'Pending' ? '#fef3c7' : '#dbeafe', color: o.orderStatus === 'Delivered' ? '#065f46' : o.orderStatus === 'Pending' ? '#92400e' : '#1e40af', padding: '3px 10px', borderRadius: 50, fontSize: '0.78rem', fontWeight: 600 }}>{o.orderStatus}</span></td>
                                                </tr>
                                            ))}
                                            {orders.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: 24, color: '#9ca3af' }}>No orders yet.</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Restaurants ── */}
                    {activeTab === 'restaurants' && (
                        <div>
                            <div className="admin-section-title">🏪 Manage Restaurants</div>
                            <div className="admin-card admin-card-pad" style={{ marginBottom: 24 }}>
                                <div className="admin-card-title">Add New Restaurant</div>
                                <form onSubmit={handleAddRestaurant}>
                                    <div className="admin-form-grid">
                                        <input placeholder="Restaurant Name *" className="admin-input" value={restForm.name} onChange={e => setRestForm({ ...restForm, name: e.target.value })} required />
                                        <select className="admin-input" value={restForm.location} onChange={e => setRestForm({ ...restForm, location: e.target.value })}>
                                            {CITIES.map(c => <option key={c}>{c}</option>)}
                                        </select>
                                        <input placeholder="Image URL *" className="admin-input" value={restForm.imageUrl} onChange={e => setRestForm({ ...restForm, imageUrl: e.target.value })} required />
                                        <input placeholder="Address *" className="admin-input" value={restForm.address} onChange={e => setRestForm({ ...restForm, address: e.target.value })} required />
                                        <input placeholder="Cuisine (e.g. Italian) *" className="admin-input" value={restForm.cuisine} onChange={e => setRestForm({ ...restForm, cuisine: e.target.value })} required />
                                        <input type="number" step="0.1" min="0" max="5" placeholder="Rating (0-5) *" className="admin-input" value={restForm.rating} onChange={e => setRestForm({ ...restForm, rating: e.target.value })} required />
                                        <textarea placeholder="Description *" rows={2} className="admin-input" style={{ gridColumn: '1/-1', resize: 'vertical' }} value={restForm.description} onChange={e => setRestForm({ ...restForm, description: e.target.value })} required />
                                    </div>
                                    <button type="submit" className="admin-btn-primary">+ Add Restaurant</button>
                                </form>
                            </div>
                            <div className="admin-rest-grid">
                                {restaurants.map(r => (
                                    <div key={r._id} className="admin-rest-card">
                                        <img src={r.imageUrl} alt={r.name} className="admin-rest-img" />
                                        <div className="admin-rest-body">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div>
                                                    <strong style={{ fontSize: '0.95rem' }}>{r.name}</strong>
                                                    <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: '4px 0 0' }}>📍 {r.location} — {r.address}</p>
                                                </div>
                                                <button onClick={() => handleDeleteRestaurant(r._id)} className="admin-btn-danger">Delete</button>
                                            </div>
                                            <div style={{ marginTop: 6 }}>
                                                <span style={{ background: 'rgba(230,57,70,0.08)', color: 'var(--primary)', padding: '3px 10px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 600 }}>{r.cuisine}</span>
                                                <span style={{ marginLeft: 6, color: '#f59e0b', fontSize: '0.82rem', fontWeight: 700 }}>★ {r.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {restaurants.length === 0 && <p style={{ color: '#6b7280' }}>No restaurants added yet.</p>}
                            </div>
                        </div>
                    )}

                    {/* ── Menu Items ── */}
                    {activeTab === 'menu' && (
                        <div>
                            <div className="admin-section-title">🍽️ Manage Menu Items</div>
                            <div className="admin-card admin-card-pad" style={{ marginBottom: 24 }}>
                                <div className="admin-card-title">Add New Menu Item</div>
                                <form onSubmit={handleAddMenuItem}>
                                    <div className="admin-form-grid">
                                        <select className="admin-input" value={menuForm.restaurantId} onChange={e => setMenuForm({ ...menuForm, restaurantId: e.target.value })} required>
                                            <option value="">-- Select Restaurant --</option>
                                            {restaurants.map(r => <option key={r._id} value={r._id}>{r.name} ({r.location})</option>)}
                                        </select>
                                        <select className="admin-input" value={menuForm.category} onChange={e => setMenuForm({ ...menuForm, category: e.target.value })}>
                                            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                        </select>
                                        <input placeholder="Dish Name *" className="admin-input" value={menuForm.name} onChange={e => setMenuForm({ ...menuForm, name: e.target.value })} required />
                                        <input type="number" placeholder="Price (₹) *" className="admin-input" value={menuForm.price} onChange={e => setMenuForm({ ...menuForm, price: e.target.value })} required />
                                        <input placeholder="Image URL *" className="admin-input" style={{ gridColumn: '1/-1' }} value={menuForm.imageUrl} onChange={e => setMenuForm({ ...menuForm, imageUrl: e.target.value })} required />
                                        <textarea placeholder="Description *" rows={2} className="admin-input" style={{ gridColumn: '1/-1', resize: 'vertical' }} value={menuForm.description} onChange={e => setMenuForm({ ...menuForm, description: e.target.value })} required />
                                    </div>
                                    <button type="submit" className="admin-btn-primary">+ Add Item</button>
                                </form>
                            </div>
                            <div className="admin-card">
                                <table className="admin-table">
                                    <thead>
                                        <tr>{['Dish', 'Category', 'Restaurant', 'Price', 'Action'].map(h => <th key={h}>{h}</th>)}</tr>
                                    </thead>
                                    <tbody>
                                        {menuItems.map(item => {
                                            const rest = restaurants.find(r => r._id === (item.restaurantId?._id || item.restaurantId));
                                            return (
                                                <tr key={item._id}>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                            <img src={item.imageUrl} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                                                            <span style={{ fontWeight: 600 }}>{item.name}</span>
                                                        </div>
                                                    </td>
                                                    <td><span style={{ background: 'rgba(230,57,70,0.1)', color: 'var(--primary)', padding: '3px 10px', borderRadius: 50, fontSize: '0.78rem', fontWeight: 600 }}>{item.category}</span></td>
                                                    <td style={{ color: '#6b7280' }}>{rest ? rest.name : 'Unknown'}</td>
                                                    <td style={{ color: 'var(--primary)', fontWeight: 700 }}>₹{item.price}</td>
                                                    <td><button onClick={() => handleDeleteMenuItem(item._id)} className="admin-btn-danger">Delete</button></td>
                                                </tr>
                                            );
                                        })}
                                        {menuItems.length === 0 && <tr><td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>No menu items yet.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ── Orders ── */}
                    {activeTab === 'orders' && (
                        <div>
                            <div className="admin-section-title">📦 Customer Orders ({orders.length})</div>
                            <div className="admin-card">
                                <div style={{ overflowX: 'auto' }}>
                                    <table className="admin-table">
                                        <thead>
                                            <tr>{['Customer', 'Phone', 'Restaurant', 'Items', 'Total', 'Payment', 'Status', 'Update'].map(h => <th key={h}>{h}</th>)}</tr>
                                        </thead>
                                        <tbody>
                                            {orders.map(o => (
                                                <tr key={o._id}>
                                                    <td>
                                                        <strong>{o.customerName}</strong>
                                                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 2, maxWidth: 150 }}>{o.deliveryAddress}</div>
                                                    </td>
                                                    <td style={{ color: '#6b7280' }}>{o.phone}</td>
                                                    <td><strong>{o.restaurantName}</strong></td>
                                                    <td style={{ fontSize: '0.82rem', color: '#374151', maxWidth: 180 }}>{o.items?.map(i => `${i.name} ×${i.quantity}`).join(', ')}</td>
                                                    <td style={{ color: 'var(--primary)', fontWeight: 700 }}>₹{o.totalAmount}</td>
                                                    <td><span style={{ background: '#fef9c3', color: '#92400e', padding: '3px 8px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 600 }}>💵 {o.paymentMethod}</span></td>
                                                    <td><span style={{ background: o.orderStatus === 'Delivered' ? '#d1fae5' : o.orderStatus === 'Cancelled' ? '#fee2e2' : o.orderStatus === 'Pending' ? '#fef3c7' : '#dbeafe', color: o.orderStatus === 'Delivered' ? '#065f46' : o.orderStatus === 'Cancelled' ? '#dc2626' : o.orderStatus === 'Pending' ? '#92400e' : '#1e40af', padding: '4px 10px', borderRadius: 50, fontSize: '0.78rem', fontWeight: 600 }}>{o.orderStatus}</span></td>
                                                    <td>
                                                        <select value={o.orderStatus} onChange={e => handleUpdateOrderStatus(o._id, e.target.value)} className="admin-status-select">
                                                            {['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                            {orders.length === 0 && <tr><td colSpan={8} style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>No orders yet.</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Reservations ── */}
                    {activeTab === 'reservations' && (
                        <div>
                            <div className="admin-section-title">📅 Reservations ({reservations.length})</div>
                            <div className="admin-card">
                                <div style={{ overflowX: 'auto' }}>
                                    <table className="admin-table">
                                        <thead>
                                            <tr>{['Guest', 'Phone', 'Email', 'Restaurant', 'Date', 'Time', 'Guests', 'Status'].map(h => <th key={h}>{h}</th>)}</tr>
                                        </thead>
                                        <tbody>
                                            {reservations.map(r => (
                                                <tr key={r._id}>
                                                    <td style={{ fontWeight: 600 }}>{r.name}</td>
                                                    <td style={{ color: '#6b7280' }}>{r.phoneNumber}</td>
                                                    <td style={{ color: '#6b7280' }}>{r.email}</td>
                                                    <td><strong>{r.restaurantName}</strong></td>
                                                    <td style={{ color: '#6b7280' }}>{new Date(r.date).toLocaleDateString()}</td>
                                                    <td style={{ color: '#6b7280' }}>{r.time}</td>
                                                    <td style={{ color: 'var(--primary)', fontWeight: 700 }}>{r.guests}</td>
                                                    <td><span style={{ background: r.status === 'Confirmed' ? '#d1fae5' : r.status === 'Cancelled' ? '#fee2e2' : '#fef3c7', color: r.status === 'Confirmed' ? '#065f46' : r.status === 'Cancelled' ? '#dc2626' : '#92400e', padding: '3px 10px', borderRadius: 50, fontSize: '0.78rem', fontWeight: 600 }}>{r.status}</span></td>
                                                </tr>
                                            ))}
                                            {reservations.length === 0 && <tr><td colSpan={8} style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>No reservations yet.</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Messages ── */}
                    {activeTab === 'messages' && (
                        <div>
                            <div className="admin-section-title">✉️ Contact Messages ({messages.length})</div>
                            <div style={{ display: 'grid', gap: 14 }}>
                                {messages.map(m => (
                                    <div key={m._id} className="admin-card admin-card-pad" style={{ borderLeft: '4px solid var(--primary)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                                            <strong style={{ fontSize: '0.95rem' }}>{m.name}</strong>
                                            <span style={{ color: '#6b7280', fontSize: '0.82rem' }}>{m.email}</span>
                                        </div>
                                        <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: 8, fontSize: '0.9rem' }}>{m.subject}</div>
                                        <p style={{ color: '#374151', margin: 0, fontSize: '0.88rem', lineHeight: 1.6 }}>{m.message}</p>
                                    </div>
                                ))}
                                {messages.length === 0 && (
                                    <div className="admin-card admin-card-pad" style={{ textAlign: 'center', color: '#6b7280', padding: 48 }}>
                                        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📬</div>
                                        No messages yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
