const db = require('../../config/db');

/**
 * CREATE BOOKING (Step 12.3)
 * - checks room availability
 * - prevents double booking
 * - marks room as occupied
 */
// Helper to get or create user
const getOrCreateUser = async (guestDetails) => {
  const { email, name, phone } = guestDetails;
  // Check if user exists
  const [users] = await db.promise().query('SELECT id FROM users WHERE email = ?', [email]);
  if (users.length > 0) return users[0].id;

  // Create new user
  // Note: Provide default password or handle NULL if schema allows. Assuming '123456' for now.
  // Also assuming 'name' field exists, and splitting if needed or just using it.
  // Schema in realCheckoutController used `first_name`, `last_name`.
  const firstName = name.split(' ')[0];
  const lastName = name.split(' ').slice(1).join(' ') || '';

  // Check if 'users' table has 'password' and 'role'
  // This is valid based on typical schema.
  const insertSql = `INSERT INTO users (first_name, last_name, email, phone_number, password, role) VALUES (?, ?, ?, ?, '123456', 'user')`;
  const [result] = await db.promise().query(insertSql, [firstName, lastName, email, phone]);
  return result.insertId;
};

exports.createBooking = async (req, res) => {
  let userId = req.user.id;
  const { room_id, guestDetails } = req.body;

  try {
    // If guestDetails provided (and logic permits), use/create that user
    if (guestDetails && (req.user.role === 'receptionist' || req.user.role === 'manager' || req.user.role === 'admin')) {
      userId = await getOrCreateUser(guestDetails);
    }

    if (!room_id) {
      return res.status(400).json({ success: false, message: 'room_id is required' });
    }

    // 1. Check room availability
    const roomSql = `SELECT price, capacity, status FROM rooms WHERE id = ?`;
    const [roomResult] = await db.promise().query(roomSql, [room_id]);

    if (roomResult.length === 0) return res.status(404).json({ success: false, message: 'Room not found' });
    if (roomResult[0].status !== 'available') return res.status(400).json({ success: false, message: 'Room is not available' });

    // 2. Create booking
    const bookingSql = `INSERT INTO bookings (user_id, room_id, check_in_date, check_out_date, num_adults, num_children) VALUES (?, ?, ?, ?, ?, ?)`;

    const [result] = await db.promise().query(bookingSql, [
      userId,
      room_id,
      req.body.checkInDate,
      req.body.checkOutDate,
      req.body.adults || 1,
      req.body.children || 0
    ]);

    // 3. Mark room as occupied
    // NOTE: Only mark occupied if check-in is TODAY?
    // For now keeping legacy logic: Booking = Occupied immediately.
    await db.promise().query(`UPDATE rooms SET status = 'occupied' WHERE id = ?`, [room_id]);

    res.status(201).json({
      success: true,
      message: 'Room booked successfully',
      bookingId: result.insertId
    });

  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ success: false, message: err.message });
  }
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
  const userRole = req.user.role;

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

    // Allow cancellation if user owns booking OR is standard staff (receptionist/manager/admin)
    if (booking.user_id !== userId && !['receptionist', 'manager', 'admin'].includes(userRole)) {
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
      SET status = 'cancelled'
      WHERE id = ?
    `;

    db.query(cancelBookingSql, [bookingId], (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      // Mark room available ONLY if it was currently occupied? 
      // Actually, for future bookings, room status might not be 'occupied' yet.
      // But if it IS occupied, we should free it.
      const freeRoomSql = `
        UPDATE rooms
        SET status = 'available'
        WHERE id = ? AND status = 'occupied'
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

/**
 * CHECK AVAILABILITY
 * - Checks for rooms that do NOT have overlapping bookings
 * - Strict Capacity Check: Room capacity MUST match requested adults
 */
exports.checkAvailability = (req, res) => {
  const { hotelId, checkInDate, checkOutDate, adults, children } = req.body;

  if (!hotelId || !checkInDate || !checkOutDate) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  // Use provided adults count or default to 1.
  const requiredCapacity = adults || 1;

  const sql = `
    SELECT r.*
    FROM rooms r
    WHERE r.hotel_id = ?
    AND r.capacity = ? 
    AND r.id NOT IN (
      SELECT b.room_id 
      FROM bookings b 
      WHERE (b.check_in_date < ? AND b.check_out_date > ?)
      AND b.status NOT IN ('cancelled', 'completed')
    )
  `;

  db.query(sql, [hotelId, requiredCapacity, checkOutDate, checkInDate], (err, rooms) => {
    if (err) {
      console.error("Error Checking Availability:", err);
      return res.status(500).json({ success: false, message: err.message });
    }

    const roomsWithImages = rooms.map(room => ({
      ...room,
      image: room.image ? Buffer.from(room.image).toString('base64') : null
    }));

    res.json({
      success: true,
      rooms: roomsWithImages
    });
  });
};
