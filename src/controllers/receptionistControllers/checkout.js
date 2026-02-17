const db = require('../../config/db');

/**
 * CREATE BOOKING (Step 12.3)
 * - checks room availability
 * - prevents double booking
 * - marks room as occupied
 */
exports.createBooking = (req, res) => {
  const userId = req.user.id;
  const { room_id } = req.body;

  if (!room_id) {
    return res.status(400).json({
      success: false,
      message: 'room_id is required'
    });
  }

  // 1. Check room availability
  const roomSql = `
    SELECT price, capacity, status
    FROM rooms
    WHERE id = ?
  `;

  db.query(roomSql, [room_id], (err, roomResult) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    if (roomResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    if (roomResult[0].status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Room is not available'
      });
    }

    const { price, capacity } = roomResult[0];

    // 2. Create booking
    const bookingSql = `
      INSERT INTO bookings (user_id, room_id, check_in_date, check_out_date, num_adults, num_children)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      bookingSql,
      [userId, room_id, req.body.checkInDate, req.body.checkOutDate, req.body.adults || 1, req.body.children || 0],
      (err, result) => {
        if (err) {
          return res.status(500).json({ success: false, message: err.message });
        }

        // 3. Mark room as occupied
        const updateRoomSql = `
          UPDATE rooms
          SET status = 'occupied'
          WHERE id = ?
        `;

        db.query(updateRoomSql, [room_id], (err) => {
          if (err) {
            return res.status(500).json({ success: false, message: err.message });
          }

          res.status(201).json({
            success: true,
            message: 'Room booked successfully',
            bookingId: result.insertId
          });
        });
      }
    );
  });
};

/**
 * GET MY BOOKINGS
 */
exports.getMyBookings = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT *
    FROM bookings
    WHERE user_id = ?
    ORDER BY created_at DESC
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

/**
 * ADMIN: GET ALL BOOKINGS (Step 13)
 */
exports.getAllBookings = (req, res) => {
  const sql = `
    SELECT 
      b.id,
      u.name AS user_name,
      r.room_number,
      b.status,
      b.created_at
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN rooms r ON b.room_id = r.id
    ORDER BY b.created_at DESC
  `;

  db.query(sql, (err, bookings) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }

    res.json({
      success: true,
      bookings
    });
  });
};



exports.cancelBooking = (req, res) => {
  const bookingId = req.params.id;
  const userId = req.user.id;

  const findBookingSql = `
    SELECT id, room_id, user_id, status
    FROM bookings
    WHERE id = ?
  `;

  db.query(findBookingSql, [bookingId], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const booking = result[0];

    if (booking.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own bookings'
      });
    }

    if (booking.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Only active bookings can be cancelled'
      });
    }

    const cancelBookingSql = `
      UPDATE bookings
      SET status = 'completed'
      WHERE id = ?
    `;

    db.query(cancelBookingSql, [bookingId], (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      const freeRoomSql = `
        UPDATE rooms
        SET status = 'available'
        WHERE id = ?
      `;

      db.query(freeRoomSql, [booking.room_id], (err) => {
        if (err) {
          return res.status(500).json({ success: false, message: err.message });
        }

        res.json({
          success: true,
          message: 'Booking cancelled successfully'
        });
      });
    });
  });
};
