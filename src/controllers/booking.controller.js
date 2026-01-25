const db = require('../config/db');

exports.createBooking = (req, res) => {
  const userId = req.user.id;
  const { room_id, check_in, check_out } = req.body;

  if (!room_id || !check_in || !check_out) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }

  // Check if room is already booked
  const checkSql = `
    SELECT * FROM bookings
    WHERE room_id = ?
    AND (
      (check_in <= ? AND check_out >= ?)
      OR
      (check_in <= ? AND check_out >= ?)
    )
  `;

  db.query(
    checkSql,
    [room_id, check_in, check_in, check_out, check_out],
    (err, existing) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      if (existing.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Room already booked for selected dates'
        });
      }

      const insertSql = `
        INSERT INTO bookings (user_id, room_id, check_in, check_out)
        VALUES (?, ?, ?, ?)
      `;

      db.query(
        insertSql,
        [userId, room_id, check_in, check_out],
        (err, result) => {
          if (err) {
            return res.status(500).json({ success: false, message: err.message });
          }

          res.status(201).json({
            success: true,
            message: 'Room booked successfully',
            bookingId: result.insertId
          });
        }
      );
    }
  );
};

exports.getMyBookings = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT b.id, r.room_number, r.type, b.check_in, b.check_out
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    WHERE b.user_id = ?
  `;

  db.query(sql, [userId], (err, bookings) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    res.json({
      success: true,
      bookings
    });
  });
};
