require('dotenv').config();
const db = require('../src/config/db');

const hotels = [
    {
        name: 'Burj Al Arab',
        description: 'The distinctive sail-shaped silhouette of Burj Al Arab Jumeirah is more than just a stunning hotel, it is a symbol of modern Dubai.',
        starRating: 5,
        location: { city: 'Dubai', country: 'UAE' },
        websiteLink: 'https://www.jumeirah.com/en/stay/dubai/burj-al-arab-jumeirah',
        status: 'active'
    },
    {
        name: 'Marina Bay Sands',
        description: 'An iconic resort in Singapore with the world\'s largest infinity pool on its roof, offering stunning city views and luxury shopping.',
        starRating: 5,
        location: { city: 'Singapore', country: 'Singapore' },
        websiteLink: 'https://www.marinabaysands.com/',
        status: 'active'
    },
    {
        name: 'The Ritz-Carlton Paris',
        description: 'Located in the heart of Paris, this legendary hotel offers an unmatched level of elegance and service in the City of Light.',
        starRating: 5,
        location: { city: 'Paris', country: 'France' },
        websiteLink: 'https://www.ritzparis.com/',
        status: 'active'
    },
    {
        name: 'Bellagio Las Vegas',
        description: 'The Bellagio is a luxury hotel and casino on the Las Vegas Strip, famous for its dancing fountains and elegant conservatory.',
        starRating: 5,
        location: { city: 'Las Vegas', country: 'USA' },
        websiteLink: 'https://bellagio.mgmresorts.com/',
        status: 'active'
    },
    {
        name: 'Hotel de Paris Monte-Carlo',
        description: 'A magical place where legendary luxury meets the glamour of the Riviera in the heart of Monaco\'s Place du Casino.',
        starRating: 5,
        location: { city: 'Monte-Carlo', country: 'Monaco' },
        websiteLink: 'https://www.montecarlosbm.com/en/hotel-monaco/hotel-de-paris-monte-carlo',
        status: 'active'
    }
];

const seedHotels = async () => {
    for (const hotel of hotels) {
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

seedHotels().then(() => {
    console.log('Seeding process initiated...');
});
