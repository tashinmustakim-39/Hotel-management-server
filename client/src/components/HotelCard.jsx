import React from 'react';
import { Star, MapPin, ExternalLink, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HotelCard = ({ hotel, isRecommended }) => {
    const navigate = useNavigate();

    const handleBrowseRooms = () => {
        navigate(`/hotel/${hotel.HotelID}/${encodeURIComponent(hotel.Name)}/rooms`);
    };

    return (
        <div className={`hotel-card glass-card ${isRecommended ? 'is-recommended' : ''}`}>
            <div className="hotel-image-container">
                {hotel.HotelImage ? (
                    <img
                        src={`data:image/jpeg;base64,${hotel.HotelImage}`}
                        alt={hotel.Name}
                        className="hotel-card-image"
                    />
                ) : (
                    <div className="hotel-card-image-placeholder">
                        <MapPin size={48} className="text-muted" />
                    </div>
                )}
                <div className="hotel-rating">
                    <Star size={16} fill="var(--primary)" stroke="var(--primary)" />
                    <span>{hotel.StarRating}.0</span>
                </div>
                {isRecommended && (
                    <div className="hotel-badge">⚡ Near You</div>
                )}
            </div>

            <div className="hotel-info">
                <h3 className="hotel-name">{hotel.Name}</h3>
                <p className="hotel-location">
                    <MapPin size={14} />
                    {hotel.Location.city}, {hotel.Location.country}
                </p>
                <p className="hotel-description">{hotel.Description}</p>

                <div className="hotel-actions">
                    {hotel.WebsiteLink && (
                        <a
                            href={hotel.WebsiteLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline btn-sm"
                        >
                            <ExternalLink size={14} />
                            Official Site
                        </a>
                    )}
                    <button className="btn btn-primary btn-sm" onClick={handleBrowseRooms}>
                        Browse Rooms
                        <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HotelCard;
