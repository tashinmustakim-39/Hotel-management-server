import { Link, useNavigate } from 'react-router-dom';
import { Hotel, User, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    return (
        <nav className="glass" style={{ margin: '1rem 2rem', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '1rem', zIndex: 100 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                <Hotel size={32} />
                <span>GrandStay</span>
            </Link>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <Link to="/" style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Home</Link>
                <Link to="/browse" style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Browse</Link>
                {user ? (
                    <>
                        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                            <LayoutDashboard size={20} />
                            Dashboard
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingLeft: '1rem', borderLeft: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={18} color="white" />
                                </div>
                                <span style={{ fontWeight: 600 }}>{user.name}</span>
                            </div>
                            <button onClick={handleLogout} style={{ color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <LogOut size={20} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to="/login" style={{ padding: '0.5rem 1.5rem', borderRadius: '8px', border: '1px solid var(--primary)', color: 'var(--primary)', fontWeight: 600 }}>Login</Link>
                        <Link to="/register" style={{ padding: '0.5rem 1.5rem', borderRadius: '8px', background: 'var(--primary)', color: 'white', fontWeight: 600 }}>Register</Link>
                    </div>
                )}
            </div>
        </nav >
    );
};

export default Navbar;
