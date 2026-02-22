import { Link } from 'react-router-dom';
import { Shield, Star, Clock, MapPin } from 'lucide-react';

const Home = () => {
    return (
        <div className="container" style={{ paddingTop: '4rem' }}>
            <section style={{ textAlign: 'center', marginBottom: '6rem' }}>
                <h1 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '1.5rem', background: 'linear-gradient(to right, #6366f1, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Experience Luxury <br /> Beyond Limits
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                    Book your stays at the world's most prestigious hotels with ease and elegance. Your journey to comfort starts here.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                    <Link to="/register" style={{ padding: '1rem 2.5rem', borderRadius: '12px', background: 'var(--primary)', color: 'white', fontWeight: 600, fontSize: '1.1rem', boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)' }}>
                        Get Started
                    </Link>
                    <Link to="/browse" style={{ padding: '1rem 2.5rem', borderRadius: '12px', border: '1px solid var(--border)', color: 'var(--text)', fontWeight: 600, fontSize: '1.1rem' }}>
                        View Rooms
                    </Link>
                </div>
            </section>

            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '6rem' }}>
                <div className="glass" style={{ padding: '2rem' }}>
                    <Shield color="var(--primary)" size={40} style={{ marginBottom: '1rem' }} />
                    <h3>Secure Booking</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Your data is protected with industry-leading encryption.</p>
                </div>
                <div className="glass" style={{ padding: '2rem' }}>
                    <Star color="var(--primary)" size={40} style={{ marginBottom: '1rem' }} />
                    <h3>5-Star Quality</h3>
                    <p style={{ color: 'var(--text-muted)' }}>We only partner with highly rated hotels worldwide.</p>
                </div>
                <div className="glass" style={{ padding: '2rem' }}>
                    <Clock color="var(--primary)" size={40} style={{ marginBottom: '1rem' }} />
                    <h3>24/7 Support</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Our concierge team is available anytime, anywhere.</p>
                </div>
            </section>
        </div>
    );
};

export default Home;
