require('dotenv').config();
const db = require('./src/config/db');

const commonItems = [
    { name: 'Shampoo (Mini)', price: 1.50 },
    { name: 'Conditioner (Mini)', price: 1.50 },
    { name: 'Body Lotion (Mini)', price: 1.80 },
    { name: 'Soap Bar', price: 0.50 },
    { name: 'Toothpaste Kit', price: 1.20 },
    { name: 'Toilet Paper (Roll)', price: 0.80 },
    { name: 'Facial Tissues (Box)', price: 1.50 },
    { name: 'Bath Towel (White)', price: 12.00 },
    { name: 'Hand Towel (White)', price: 5.00 },
    { name: 'Bath Mat', price: 8.00 },
    { name: 'Light Bulb (LED 60W)', price: 3.50 },
    { name: 'Batteries (AA Pack)', price: 4.00 },
    { name: 'Cleaning Spray (Multi-surface)', price: 3.20 },
    { name: 'Trash Bags (Large)', price: 0.20 },
    { name: 'Bottled Water (500ml)', price: 0.40 },
    { name: 'Coffee Pods', price: 0.60 },
    { name: 'Tea Bags (Box)', price: 4.50 },
    { name: 'Sugar Packets (100ct)', price: 2.00 }
];

async function seedInventory() {
    try {
        const [hotels] = await db.promise().query('SELECT HotelID, Name FROM Hotel');
        console.log(`Found ${hotels.length} hotels.`);

        for (const hotel of hotels) {
            console.log(`Processing hotel: ${hotel.Name} (ID: ${hotel.HotelID})`);

            for (const item of commonItems) {
                // Check if item exists (by name)
                const [existing] = await db.promise().query(
                    'SELECT InventoryID FROM Inventory WHERE HotelID = ? AND ItemName = ?',
                    [hotel.HotelID, item.name]
                );

                if (existing.length === 0) {
                    await db.promise().query(
                        'INSERT INTO Inventory (HotelID, ItemName, Quantity, UnitPrice) VALUES (?, ?, 0, ?)',
                        [hotel.HotelID, item.name, item.price]
                    );
                    console.log(`  + Added: ${item.name} ($${item.price})`);
                } else {
                    console.log(`  - Exists: ${item.name}`);
                }
            }
        }
        console.log('Inventory seeding complete.');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding inventory:', err);
        process.exit(1);
    }
}

seedInventory();
