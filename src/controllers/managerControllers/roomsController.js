const db = require('../../config/db');

// Get Available Rooms
exports.getAvailableRooms = async (req, res) => {
    const hotelID = req.params.hotelID;

    // Adapted to use 'rooms' table and 'type' column as per user description
    // Assuming 'type' contains the class name directly
    const sql = `
        SELECT id, room_number, price, capacity, type, image
        FROM rooms
        WHERE hotel_id = ? AND status = 'available'
    `;

    try {
        const [rows] = await db.promise().query(sql, [hotelID]);

        const rooms = rows.map(room => ({
            ...room,
            image: room.image ? room.image.toString('base64') : null
        }));

        res.status(200).json(rooms);
    } catch (err) {
        console.error("Error fetching available rooms:", err);
        res.status(500).send("Error fetching available rooms");
    }
};

// Get Room Classes
exports.getRoomClasses = (req, res) => {
    const sql = "SELECT * FROM room_class";

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching room classes:", err);
            res.status(500).send("Error fetching room classes");
        } else {
            res.status(200).json(result);
        }
    });
};

// Add New Room
exports.addRoom = async (req, res) => {
    // Mapping: RoomClassID -> type (assuming frontend sends type name or we handle it)
    // The user's snippet used: hotelID, roomNumber, roomClassID, maxOccupancy, basePrice
    // Our DB has: hotel_id, room_number, type, capacity, price
    const { hotelID, roomNumber, type, capacity, price } = req.body;
    const roomImage = req.file ? req.file.buffer : null;

    try {
        if (!hotelID || !roomNumber || !type || !capacity || !price || !roomImage) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        await db.promise().query(
            `INSERT INTO rooms (room_number, type, hotel_id, capacity, price, image, status)
             VALUES (?, ?, ?, ?, ?, ?, 'available')`,
            [roomNumber, type, hotelID, capacity, price, roomImage]
        );

        res.status(201).json({ message: 'Room added successfully' });
    } catch (err) {
        console.error('Add Room Error:', err);
        res.status(500).json({ error: 'Failed to add room', details: err.message });
    }
};

// Update Room
exports.updateRoom = (req, res) => {
    const { type, price, capacity } = req.body; // Expecting 'type', 'price', 'capacity' from body
    const roomID = req.params.roomID;
    const roomImage = req.file ? req.file.buffer : null;

    // Dynamic update query to handle optional image
    let sql = `UPDATE rooms SET type = ?, price = ?, capacity = ?`;
    let params = [type, price, capacity];

    if (roomImage) {
        sql += `, image = ?`;
        params.push(roomImage);
    }

    sql += ` WHERE id = ?`;
    params.push(roomID);

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error("Error updating room:", err);
            return res.status(500).send("Error updating room details");
        } else {
            res.status(200).send("Room updated successfully");
        }
    });
};

// Mark Room Occupied (Used by Admin)
exports.markRoomOccupied = (req, res) => {
    const roomId = req.params.id;

    // 1. Check room exists
    const checkSql = `
    SELECT status
    FROM rooms
    WHERE id = ?
  `;

    db.query(checkSql, [roomId], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        if (results[0].status === 'occupied') {
            return res.status(400).json({
                success: false,
                message: 'Room is already occupied'
            });
        }

        // 2. Mark room occupied
        const updateSql = `
      UPDATE rooms
      SET status = 'occupied'
      WHERE id = ?
    `;

        db.query(updateSql, [roomId], (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: err.message });
            }

            res.json({
                success: true,
                message: 'Room marked as occupied'
            });
        });
    });
};
