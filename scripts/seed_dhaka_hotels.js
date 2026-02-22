require('dotenv').config();
const db = require('../src/config/db');

const dhakaHotels = [
    {
        name: 'InterContinental Dhaka',
        description: 'An iconic luxury hotel in Dhaka, offering premium amenities, diverse dining options, and a prestigious atmosphere in the heart of the city.',
        starRating: 5,
        location: { city: 'Dhaka', country: 'Bangladesh' },
        websiteLink: 'https://www.ihg.com/intercontinental/hotels/us/en/dhaka/dachb/hoteldetail',
        status: 'active'
    },
    {
        name: 'Radisson Blu Water Garden Hotel',
        description: 'Set amidst seven acres of lush gardens, this hotel provides a serene escape with world-class facilities near the international airport.',
        starRating: 5,
        location: { city: 'Dhaka', country: 'Bangladesh' },
        websiteLink: 'https://www.radissonhotels.com/en-us/hotels/radisson-blu-dhaka',
        status: 'active'
    },
    {
        name: 'Pan Pacific Sonargaon Dhaka',
        description: 'A landmark of hospitality in Bangladesh, offering traditional charm combined with modern luxury for business and leisure travelers.',
        starRating: 5,
        location: { city: 'Dhaka', country: 'Bangladesh' },
        websiteLink: 'https://www.panpacific.com/en/hotels-and-resorts/pp-sonargaon-dhaka.html',
        status: 'active'
    },
    {
        name: 'The Westin Dhaka',
        description: 'Experience renewal at The Westin Dhaka, located in the prime business district of Gulshan, featuring sophisticated rooms and signature wellness programs.',
        starRating: 5,
        location: { city: 'Dhaka', country: 'Bangladesh' },
        websiteLink: 'https://www.marriott.com/hotels/travel/dacwi-the-westin-dhaka/',
        status: 'active'
    },
    {
        name: 'Le Méridien Dhaka',
        description: 'A modern luxury hotel that blends European style with local culture, situated near the airport and featuring rooftop pools and fine dining.',
        starRating: 5,
        location: { city: 'Dhaka', country: 'Bangladesh' },
        websiteLink: 'https://www.marriott.com/hotels/travel/dacmd-le-meridien-dhaka/',
        status: 'active'
    }
];

const seedDhakaHotels = async () => {
    console.log('Starting Dhaka hotel seeding...');
    for (const hotel of dhakaHotels) {
        const query = 'INSERT INTO Hotel (Name, Description, StarRating, Location, WebsiteLink, Status) VALUES (?, ?, ?, ?, ?, ?)';
        const params = [
            hotel.name,
            hotel.description,
            hotel.starRating,
            JSON.stringify(hotel.location),
            hotel.websiteLink,
            hotel.status
        ];

        db.query(query, params, (err, result) => {
            if (err) {
                console.error(`Error seeding ${hotel.name}:`, err);
            } else {
                console.log(`Successfully seeded ${hotel.name}`);
            }
        });
    }
};

seedDhakaHotels().then(() => {
    console.log('Dhaka seeding process initiated...');
});
