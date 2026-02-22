import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, BedDouble, Users, Star, DollarSign, CheckCircle } from 'lucide-react';

const HotelRooms = () => {
    const { hotelId, hotelName } = useParams();
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/rooms/get-available-rooms/${hotelId}`);
                setRooms(response.data);
            } catch (err) {
                console.error('Error fetching rooms:', err);
                setError('Could not load rooms for this hotel.');
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, [hotelId]);

    const getRoomIcon = (type) => {
        if (!type) return '🛏️';
        const t = type.toLowerCase();
        if (t.includes('suite') || t.includes('penthouse')) return '👑';
        if (t.includes('deluxe')) return '⭐';
        return '🛏️';
    };

    return (
        <div className="hotel-rooms-page">
            {/* Header */}
            <div className="rooms-header glass-card">
                <button className="btn btn-outline btn-sm back-btn" onClick={() => navigate('/browse')}>
                    <ArrowLeft size={16} />
                    Back to Hotels
                </button>
                <div className="rooms-header-info">
                    <h1 className="rooms-hotel-name">{decodeURIComponent(hotelName)}</h1>
                    <p className="rooms-subtitle">
                        <CheckCircle size={16} style={{ color: 'var(--success)' }} />
                        {loading ? 'Loading rooms...' : `${rooms.length} available room${rooms.length !== 1 ? 's' : ''}`}
                    </p>
                </div>
            </div>

            {/* Rooms */}
            <div className="rooms-grid-section">
                {loading ? (
                    <div className="loading-state">
                        <div className="loader"></div>
                        <p>Fetching available rooms...</p>
                    </div>
                ) : error ? (
                    <div className="error-state glass-card">
                        <p>{error}</p>
                        <button className="btn btn-primary" onClick={() => navigate('/browse')}>Back to Hotels</button>
                    </div>
                ) : rooms.length === 0 ? (
                    <div className="empty-state glass-card">
                        <BedDouble size={64} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                        <h2>No rooms available</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                            All rooms at this hotel are currently occupied. Please check back later.
                        </p>
                        <button className="btn btn-primary" onClick={() => navigate('/browse')}>Browse Other Hotels</button>
                    </div>
                ) : (
                    <div className="room-cards-grid">
                        {rooms.map(room => (
                            <div key={room.id} className="room-card glass-card">
                                <div className="room-card-image">
                                    {room.image ? (
                                        <img src={`data:image/jpeg;base64,${room.image}`} alt={`Room ${room.room_number}`} />
                                    ) : (
                                        <div className="room-image-placeholder">
                                            <span className="room-icon">{getRoomIcon(room.type)}</span>
                                        </div>
                                    )}
                                    <div className="room-type-badge">{room.type || 'Standard'}</div>
                                </div>

                                <div className="room-card-body">
                                    <div className="room-card-header">
                                        <h3 className="room-number">Room {room.room_number}</h3>
                                        <div className="room-price">
                                            <DollarSign size={18} />
                                            <span>{parseFloat(room.price).toFixed(0)}</span>
                                            <span className="per-night">/ night</span>
                                        </div>
                                    </div>

                                    <div className="room-features">
                                        <div className="room-feature">
                                            <Users size={16} />
                                            <span>Up to {room.capacity} guest{room.capacity > 1 ? 's' : ''}</span>
                                        </div>
                                        <div className="room-feature">
                                            <Star size={16} fill="var(--secondary)" stroke="var(--secondary)" />
                                            <span>{room.type || 'Standard'}</span>
                                        </div>
                                    </div>

                                    <div className="room-amenities">
                                        <span className="amenity-tag">Free WiFi</span>
                                        <span className="amenity-tag">AC</span>
                                        <span className="amenity-tag">24hr Service</span>
                                        {(room.type?.toLowerCase().includes('suite') || room.type?.toLowerCase().includes('deluxe')) && (
                                            <span className="amenity-tag">Mini Bar</span>
                                        )}
                                    </div>

                                    <button className="btn btn-primary book-btn">
                                        Book Now — ${parseFloat(room.price).toFixed(0)}/night
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HotelRooms;
