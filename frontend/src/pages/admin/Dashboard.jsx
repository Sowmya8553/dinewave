import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CITIES = ['Chennai', 'Bangalore', 'Hyderabad', 'Coimbatore'];
const CATEGORIES = ['Starters', 'Main Course', 'Desserts', 'Drinks'];

// ─ axios with JWT ─
const api = (token) => axios.create({
    baseURL: '`http://localhost:5000',
    headers: { Authorization: `Bearer ${token}` }
});

const Dashboard = () => {
    const navigate = useNavigate();
    const [token] = useState(localStorage.getItem('adminToken'));
    const [activeTab, setActiveTab] = useState('restaurants');
    const [restaurants, setRestaurants] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [orders, setOrders] = useState([]);

    // Restaurant form state
    const [restForm, setRestForm] = useState({ name: '', imageUrl: '', location: 'Chennai', address: '', description: '', cuisine: 'Multi-Cuisine', rating: 4.0 });
    // Menu form state
    const [menuForm, setMenuForm] = useState({ name: '', description: '', price: '', category: 'Starters', imageUrl: '', restaurantId: '' });

    useEffect(() => {
        if (!token) { navigate('/admin'); return; }
        fetchAll();
    }, []);

    const fetchAll = async () => {
        try {
            const [rRes, mRes, rvRes, cRes, oRes] = await Promise.all([
                axios.get('`http://localhost:5000/api/restaurants'),
                axios.get('`http://localhost:5000/api/menu'),
                api(token).get('/api/reservations'),
                api(token).get('/api/contact'),
                axios.get('`http://localhost:5000/api/orders'),
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
            await axios.put(``http://localhost:5000/api/orders/${orderId}/status`, { orderStatus: newStatus });
            fetchAll();
        } catch { alert('Failed to update order status'); }
    };

    const handleLogout = () => { localStorage.removeItem('adminToken'); navigate('/admin'); };

    // ── Restaurant CRUD ──
    const handleAddRestaurant = async (e) => {
        e.preventDefault();
        try {
            await api(token).post('/api/restaurants', restForm);
            setRestForm({ name: '', imageUrl: '', location: 'Chennai', address: '', description: '', cuisine: 'Multi-Cuisine', rating: 4.0 });
            fetchAll();
        } catch (err) { alert('Failed to add restaurant'); }
    };

    const handleDeleteRestaurant = async (id) => {
        if (!window.confirm('Delete this restaurant?')) return;
        try { await api(token).delete(`/api/restaurants/${id}`); fetchAll(); }
        catch { alert('Failed to delete'); }
    };

    // ── Menu CRUD ──
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
        { key: 'restaurants', label: '🏪 Restaurants' },
        { key: 'menu', label: '🍽️ Menu Items' },
        { key: 'orders', label: `📦 Orders${orders.length ? ` (${orders.length})` : ''}` },
        { key: 'reservations', label: '📅 Reservations' },
        { key: 'messages', label: '✉️ Messages' },
    ];

    const inputStyle = {
        border: '1.5px solid #e5e7eb',
        borderRadius: '8px',
        padding: '8px 12px',
        width: '100%',
        outline: 'none',
        fontFamily: 'Inter, sans-serif'
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'Inter, sans-serif' }}>
            {/* Header */}
            <div style={{ background: 'var(--primary)', color: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: '1.5rem' }}>
                    <span style={{ background: '#fff', color: 'var(--primary)', padding: '2px 10px', borderRadius: '6px' }}>Dine</span>
                    <span> Wave Admin</span>
                </div>
                <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: '8px', padding: '6px 18px', cursor: 'pointer' }}>Logout</button>
            </div>

            <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
                {/* Sidebar */}
                <div style={{ width: '220px', background: '#fff', borderRight: '1px solid #e5e7eb', padding: '24px 0', flexShrink: 0 }}>
                    {tabs.map(t => (
                        <button key={t.key} onClick={() => setActiveTab(t.key)}
                            style={{
                                display: 'block', width: '100%', textAlign: 'left',
                                padding: '12px 24px', border: 'none', cursor: 'pointer', fontWeight: 600,
                                background: activeTab === t.key ? 'rgba(200,16,46,0.08)' : 'transparent',
                                color: activeTab === t.key ? 'var(--primary)' : '#374151',
                                borderRight: activeTab === t.key ? '3px solid var(--primary)' : '3px solid transparent'
                            }}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Main Area */}
                <div style={{ flex: 1, padding: '32px' }}>

                    {/* ── Restaurants Tab ── */}
                    {activeTab === 'restaurants' && (
                        <div>
                            <h4 style={{ color: 'var(--primary)', marginBottom: '24px' }}>Manage Restaurants</h4>
                            {/* Add Form */}
                            <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', marginBottom: '28px', border: '1px solid #e5e7eb' }}>
                                <h6 style={{ fontWeight: 700, marginBottom: '16px' }}>Add New Restaurant</h6>
                                <form onSubmit={handleAddRestaurant}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <input placeholder="Restaurant Name *" style={inputStyle} value={restForm.name} onChange={e => setRestForm({ ...restForm, name: e.target.value })} required />
                                        <select style={inputStyle} value={restForm.location} onChange={e => setRestForm({ ...restForm, location: e.target.value })}>
                                            {CITIES.map(c => <option key={c}>{c}</option>)}
                                        </select>
                                        <input placeholder="Image URL *" style={inputStyle} value={restForm.imageUrl} onChange={e => setRestForm({ ...restForm, imageUrl: e.target.value })} required />
                                        <input placeholder="Address *" style={inputStyle} value={restForm.address} onChange={e => setRestForm({ ...restForm, address: e.target.value })} required />
                                        <input placeholder="Cuisine (e.g. Italian, Indian) *" style={inputStyle} value={restForm.cuisine} onChange={e => setRestForm({ ...restForm, cuisine: e.target.value })} required />
                                        <input type="number" step="0.1" min="0" max="5" placeholder="Rating (0-5) *" style={inputStyle} value={restForm.rating} onChange={e => setRestForm({ ...restForm, rating: e.target.value })} required />
                                        <textarea placeholder="Description *" rows={2} style={{ ...inputStyle, gridColumn: '1/-1' }} value={restForm.description} onChange={e => setRestForm({ ...restForm, description: e.target.value })} required />
                                    </div>
                                    <button type="submit" style={{ marginTop: '12px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer', fontWeight: 600 }}>
                                        Add Restaurant
                                    </button>
                                </form>
                            </div>
                            {/* List */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                                {restaurants.map(r => (
                                    <div key={r._id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                                        <img src={r.imageUrl} alt={r.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                                        <div style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div>
                                                    <strong>{r.name}</strong>
                                                    <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: '4px 0' }}>📍 {r.location} — {r.address}</p>
                                                </div>
                                                <button onClick={() => handleDeleteRestaurant(r._id)}
                                                    style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '0.8rem' }}>
                                                    Delete
                                                </button>
                                            </div>
                                            <p style={{ color: '#6b7280', fontSize: '0.82rem', marginTop: '8px' }}>{r.description}</p>
                                        </div>
                                    </div>
                                ))}
                                {restaurants.length === 0 && <p style={{ color: '#6b7280' }}>No restaurants added yet. Add one above!</p>}
                            </div>
                        </div>
                    )}

                    {/* ── Menu Items Tab ── */}
                    {activeTab === 'menu' && (
                        <div>
                            <h4 style={{ color: 'var(--primary)', marginBottom: '24px' }}>Manage Menu Items</h4>
                            {/* Add Form */}
                            <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', marginBottom: '28px', border: '1px solid #e5e7eb' }}>
                                <h6 style={{ fontWeight: 700, marginBottom: '16px' }}>Add New Menu Item</h6>
                                <form onSubmit={handleAddMenuItem}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <select style={inputStyle} value={menuForm.restaurantId} onChange={e => setMenuForm({ ...menuForm, restaurantId: e.target.value })} required>
                                            <option value="">-- Select Restaurant --</option>
                                            {restaurants.map(r => <option key={r._id} value={r._id}>{r.name} ({r.location})</option>)}
                                        </select>
                                        <select style={inputStyle} value={menuForm.category} onChange={e => setMenuForm({ ...menuForm, category: e.target.value })}>
                                            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                        </select>
                                        <input placeholder="Dish Name *" style={inputStyle} value={menuForm.name} onChange={e => setMenuForm({ ...menuForm, name: e.target.value })} required />
                                        <input type="number" placeholder="Price (₹) *" style={inputStyle} value={menuForm.price} onChange={e => setMenuForm({ ...menuForm, price: e.target.value })} required />
                                        <input placeholder="Image URL *" style={{ ...inputStyle, gridColumn: '1/-1' }} value={menuForm.imageUrl} onChange={e => setMenuForm({ ...menuForm, imageUrl: e.target.value })} required />
                                        <textarea placeholder="Description *" rows={2} style={{ ...inputStyle, gridColumn: '1/-1' }} value={menuForm.description} onChange={e => setMenuForm({ ...menuForm, description: e.target.value })} required />
                                    </div>
                                    <button type="submit" style={{ marginTop: '12px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer', fontWeight: 600 }}>
                                        Add Item
                                    </button>
                                </form>
                            </div>
                            {/* List */}
                            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                    <thead>
                                        <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                            {['Dish', 'Category', 'Restaurant', 'Price', 'Action'].map(h => (
                                                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {menuItems.map(item => {
                                            const rest = restaurants.find(r => r._id === (item.restaurantId?._id || item.restaurantId));
                                            return (
                                                <tr key={item._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <img src={item.imageUrl} alt="" style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                                                            {item.name}
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        <span style={{ background: 'rgba(200,16,46,0.1)', color: 'var(--primary)', padding: '3px 10px', borderRadius: '50px', fontSize: '0.78rem', fontWeight: 600 }}>{item.category}</span>
                                                    </td>
                                                    <td style={{ padding: '12px 16px', color: '#6b7280' }}>{rest ? rest.name : 'Unknown'}</td>
                                                    <td style={{ padding: '12px 16px', color: 'var(--primary)', fontWeight: 700 }}>₹{item.price}</td>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        <button onClick={() => handleDeleteMenuItem(item._id)}
                                                            style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {menuItems.length === 0 && (
                                            <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>No menu items yet.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ── Reservations Tab ── */}
                    {activeTab === 'reservations' && (
                        <div>
                            <h4 style={{ color: 'var(--primary)', marginBottom: '24px' }}>Reservations ({reservations.length})</h4>
                            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                    <thead>
                                        <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                            {['Guest', 'Phone', 'Email', 'Restaurant', 'Date', 'Time', 'Guests', 'Status'].map(h => (
                                                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reservations.map(r => (
                                            <tr key={r._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                <td style={{ padding: '12px 16px' }}>{r.name}</td>
                                                <td style={{ padding: '12px 16px', color: '#6b7280' }}>{r.phoneNumber}</td>
                                                <td style={{ padding: '12px 16px', color: '#6b7280' }}>{r.email}</td>
                                                <td style={{ padding: '12px 16px' }}><strong>{r.restaurantName}</strong></td>
                                                <td style={{ padding: '12px 16px', color: '#6b7280' }}>{new Date(r.date).toLocaleDateString()}</td>
                                                <td style={{ padding: '12px 16px', color: '#6b7280' }}>{r.time}</td>
                                                <td style={{ padding: '12px 16px', color: 'var(--primary)', fontWeight: 700 }}>{r.guests}</td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <span style={{ background: r.status === 'Confirmed' ? '#d1fae5' : r.status === 'Cancelled' ? '#fee2e2' : '#fef3c7', color: r.status === 'Confirmed' ? '#065f46' : r.status === 'Cancelled' ? '#dc2626' : '#92400e', padding: '3px 10px', borderRadius: '50px', fontSize: '0.78rem', fontWeight: 600 }}>{r.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                        {reservations.length === 0 && (
                                            <tr><td colSpan={8} style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>No reservations yet.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ── Orders Tab ── */}
                    {activeTab === 'orders' && (
                        <div>
                            <h4 style={{ color: 'var(--primary)', marginBottom: '24px' }}>Customer Orders ({orders.length})</h4>
                            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                    <thead>
                                        <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                            {['Customer', 'Phone', 'Restaurant', 'Items', 'Total', 'Payment', 'Status', 'Update'].map(h => (
                                                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(o => (
                                            <tr key={o._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <strong>{o.customerName}</strong>
                                                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#6b7280' }}>{o.deliveryAddress}</p>
                                                </td>
                                                <td style={{ padding: '12px 16px', color: '#6b7280' }}>{o.phone}</td>
                                                <td style={{ padding: '12px 16px' }}><strong>{o.restaurantName}</strong></td>
                                                <td style={{ padding: '12px 16px', color: '#374151', fontSize: '0.82rem' }}>
                                                    {o.items?.map(i => `${i.name} ×${i.quantity}`).join(', ')}
                                                </td>
                                                <td style={{ padding: '12px 16px', color: 'var(--primary)', fontWeight: 700 }}>₹{o.totalAmount}</td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <span style={{ background: o.paymentMethod === 'Online' ? '#ede9fe' : '#fef9c3', color: o.paymentMethod === 'Online' ? '#6d28d9' : '#854d0e', padding: '3px 8px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 600 }}>
                                                        {o.paymentMethod} · {o.paymentStatus}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <span style={{ background: o.orderStatus === 'Delivered' ? '#d1fae5' : o.orderStatus === 'Cancelled' ? '#fee2e2' : o.orderStatus === 'Pending' ? '#fef3c7' : '#dbeafe', color: o.orderStatus === 'Delivered' ? '#065f46' : o.orderStatus === 'Cancelled' ? '#dc2626' : o.orderStatus === 'Pending' ? '#92400e' : '#1e40af', padding: '3px 10px', borderRadius: '50px', fontSize: '0.78rem', fontWeight: 600 }}>
                                                        {o.orderStatus}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <select
                                                        value={o.orderStatus}
                                                        onChange={e => handleUpdateOrderStatus(o._id, e.target.value)}
                                                        style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '4px 8px', fontSize: '0.82rem', cursor: 'pointer' }}
                                                    >
                                                        {['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map(s => (
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                        {orders.length === 0 && (
                                            <tr><td colSpan={8} style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>No orders yet.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ── Messages Tab ── */}
                    {activeTab === 'messages' && (
                        <div>
                            <h4 style={{ color: 'var(--primary)', marginBottom: '24px' }}>Contact Messages ({messages.length})</h4>
                            <div style={{ display: 'grid', gap: '12px' }}>
                                {messages.map(m => (
                                    <div key={m._id} style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <strong>{m.name}</strong>
                                            <span style={{ color: '#6b7280', fontSize: '0.82rem' }}>{m.email}</span>
                                        </div>
                                        <p style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '8px' }}>{m.subject}</p>
                                        <p style={{ color: '#374151', margin: 0 }}>{m.message}</p>
                                    </div>
                                ))}
                                {messages.length === 0 && <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px' }}>No messages yet.</p>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
