const db = require('../config/db');

exports.createRoom = (req, res) => {
  const { room_number, type, price, capacity } = req.body;

  if (!room_number || !type || !price || !capacity) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }

  const sql = `
    INSERT INTO rooms (room_number, type, price, capacity)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [room_number, type, price, capacity], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      roomId: result.insertId
    });
  });
};

exports.getAllRooms = (req, res) => {
  db.query('SELECT * FROM rooms', (err, rooms) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }

    res.json({
      success: true,
      rooms
    });
  });
};
