require('dotenv').config();
const db = require('./src/config/db');

console.log("Testing Room Insertion...");

// Dummy data matching controller expectations
const room = {
    room_number: "999",
    type: "Test",
    hotel_id: 1, // Assumes hotel with ID 1 exists (from previous tests)
    capacity: 2,
    price: 100,
    image: null, // Testing NULL image
    status: 'available'
};

const deleteSql = "DELETE FROM rooms WHERE room_number = ?";
db.query(deleteSql, [room.room_number], (err) => {
    if (err) console.error("Cleanup failed:", err);
    else console.log("Cleanup (delete 999) successful");

    const sql = `
        INSERT INTO rooms (room_number, type, hotel_id, capacity, price, image, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
        room.room_number,
        room.type,
        room.hotel_id,
        room.capacity,
        room.price,
        room.image,
        room.status
    ];

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error("Insert Failed:", err);
            process.exit(1);
        }
        console.log("Room Inserted Successfully. ID:", result.insertId);
        process.exit(0);
    });
});
