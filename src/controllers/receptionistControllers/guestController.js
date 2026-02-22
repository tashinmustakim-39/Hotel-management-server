const db = require('../../config/db');

// Get all guests (users with role 'user')
exports.getAllGuests = (req, res) => {
    const { search } = req.query;
    let sql = "SELECT id, name, email, phone, notes, created_at FROM users WHERE role = 'user'";
    const params = [];

    if (search) {
        sql += " AND (name LIKE ? OR email LIKE ?)";
        params.push(`%${search}%`, `%${search}%`);
    }

    sql += " ORDER BY name ASC";

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error("Error fetching guests:", err);
            return res.status(500).json({ success: false, message: "Error fetching guests" });
        }
        res.json({ success: true, guests: results });
    });
};

// Get single guest details including booking history
exports.getGuestDetails = (req, res) => {
    const guestId = req.params.id;

    // Parallel queries: Guest Details & Booking History
    const guestSql = "SELECT id, name, email, phone, notes, created_at FROM users WHERE id = ? AND role = 'user'";
    const bookingsSql = `
        SELECT b.id, b.check_in_date, b.check_out_date, b.total_price, b.status, r.room_number, r.type
        FROM bookings b
        JOIN rooms r ON b.room_id = r.id
        WHERE b.user_id = ?
        ORDER BY b.created_at DESC
    `;

    db.query(guestSql, [guestId], (err, guestResults) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error fetching guest details" });
        }
        if (guestResults.length === 0) {
            return res.status(404).json({ success: false, message: "Guest not found" });
        }

        const guest = guestResults[0];

        db.query(bookingsSql, [guestId], (err, bookingResults) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Error fetching booking history" });
            }

            res.json({
                success: true,
                guest: { ...guest, history: bookingResults }
            });
        });
    });
};

// Update Guest Profile (Notes/Preferences)
exports.updateGuestProfile = (req, res) => {
    const guestId = req.params.id;
    const { name, email, phone, notes } = req.body;

    const sql = "UPDATE users SET name = ?, email = ?, phone = ?, notes = ? WHERE id = ? AND role = 'user'";

    db.query(sql, [name, email, phone, notes, guestId], (err, result) => {
        if (err) {
            console.error("Error updating guest:", err);
            return res.status(500).json({ success: false, message: "Error updating guest profile" });
        }
        res.json({ success: true, message: "Guest profile updated successfully" });
    });
};
