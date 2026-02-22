import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, CreditCard, Hotel, AlertCircle } from 'lucide-react';

const Dashboard = ({ user }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5001/api/bookings/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBookings(response.data.bookings || []);
            } catch (err) {
                console.error('Failed to fetch bookings');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    return (
        <div className="container" style={{ paddingTop: '3rem' }}>
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome, {user.name}</h1>
                <p style={{ color: 'var(--text-muted)' }}>Manage your luxury stays and recent activity</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <section>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={24} color="var(--primary)" />
                        Your Recent Bookings
                    </h2>

                    {loading ? (
                        <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>Loading bookings...</div>
                    ) : bookings.length === 0 ? (
                        <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
                            <Hotel size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <p style={{ color: 'var(--text-muted)' }}>You don't have any bookings yet.</p>
                            <button style={{ marginTop: '1.5rem', color: 'var(--primary)', fontWeight: 600 }}>Browse Rooms</button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {bookings.map(booking => (
                                <div key={booking.id} className="glass" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Room #{booking.room_number || booking.room_id}</h4>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Booked on {new Date(booking.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <span style={{ padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', background: booking.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.1)', color: booking.status === 'active' ? 'var(--success)' : 'var(--text-muted)' }}>
                                        {booking.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section>
                    <div className="glass" style={{ padding: '2rem', marginBottom: '2rem', background: 'linear-gradient(135deg, var(--surface) 0%, #1e1b4b 100%)' }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CreditCard size={20} color="var(--secondary)" />
                            Premium Balance
                        </h3>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>$0.00</div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Member since Feb 2026</p>
                    </div>

                    <div className="glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                        <AlertCircle color="var(--secondary)" size={24} />
                        <div>
                            <h4 style={{ color: 'var(--secondary)', marginBottom: '0.25rem' }}>Verify Account</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Complete your profile to unlock exclusive 5-star benefits and rewards.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
