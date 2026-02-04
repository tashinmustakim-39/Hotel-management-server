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
