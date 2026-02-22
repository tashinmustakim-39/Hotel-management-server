import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BrowseHotels from './pages/BrowseHotels';
import HotelRooms from './pages/HotelRooms';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userData = params.get('user');

    if (token && userData) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', userData);
      setUser(JSON.parse(userData));
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId="863870648837-0dr86ahu18ginimb854cfqbeu2oo86dj.apps.googleusercontent.com">
      <Router>
        <Navbar user={user} setUser={setUser} />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<BrowseHotels />} />
            <Route path="/hotel/:hotelId/:hotelName/rooms" element={<HotelRooms />} />
            <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
          </Routes>
        </main>
        <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
          <p>&copy; 2026 Hotel Management System. All rights reserved.</p>
        </footer>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
