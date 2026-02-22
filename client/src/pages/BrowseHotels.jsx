import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HotelCard from '../components/HotelCard';
import { Search, Filter, MapPin } from 'lucide-react';

const BrowseHotels = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [userLocation, setUserLocation] = useState('Dhaka, Bangladesh'); // Default to Dhaka as requested

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/hotels/get-hotels');
                setHotels(response.data);
            } catch (error) {
                console.error('Error fetching hotels:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, []);

    const filteredHotels = hotels.filter(hotel =>
        hotel.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.Location.city.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
        // Recommendation Logic: Prioritize user's location
        const [city] = userLocation.split(', ');
        const aMatch = a.Location.city === city;
        const bMatch = b.Location.city === city;

        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
    });

    return (
        <div className="browse-container">
            <header className="browse-header">
                <div className="hero-content">
                    <h1 className="hero-title animate-slide-up">Luxury Destinations</h1>
                    <p className="hero-subtitle animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        Experience the world's most iconic and prestigious hotels.
                    </p>
                </div>

                <div className="search-bar-container animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="search-input-wrapper glass-card">
                        <div className="location-selector">
                            <MapPin size={18} className="text-primary" />
                            <select
                                value={userLocation}
                                onChange={(e) => setUserLocation(e.target.value)}
                                className="location-select"
                            >
                                <option value="Dhaka, Bangladesh">Dhaka, Bangladesh</option>
                                <option value="Dubai, UAE">Dubai, UAE</option>
                                <option value="Singapore, Singapore">Singapore</option>
                                <option value="Paris, France">Paris, France</option>
                                <option value="Las Vegas, USA">Las Vegas, USA</option>
                                <option value="Monte-Carlo, Monaco">Monte-Carlo</option>
                            </select>
                        </div>
                        <div className="divider"></div>
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search by hotel name or city..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <button className="btn btn-primary search-btn">Search</button>
                    </div>
                </div>
            </header>

            <section className="hotels-grid-section">
                <div className="section-header">
                    <h2 className="section-title">Available Curations</h2>
                    <div className="filter-actions">
                        <button className="btn btn-outline btn-sm">
                            <Filter size={14} />
                            Filter
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="loader"></div>
                        <p>Curating your luxury experience...</p>
                    </div>
                ) : (
                    <div className="hotels-grid">
                        {filteredHotels.length > 0 ? (
                            filteredHotels.map(hotel => {
                                const [selectedCity] = userLocation.split(', ');
                                const isRecommended = hotel.Location.city === selectedCity;
                                return (
                                    <HotelCard key={hotel.HotelID} hotel={hotel} isRecommended={isRecommended} />
                                );
                            })
                        ) : (
                            <div className="no-results glass-card">
                                <Search size={48} className="text-muted" />
                                <h3>No hotels found</h3>
                                <p>Try adjusting your search terms to find your perfect stay.</p>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default BrowseHotels;
