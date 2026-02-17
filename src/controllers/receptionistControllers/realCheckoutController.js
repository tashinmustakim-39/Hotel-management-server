const db = require('../../config/db');

function adjustDate(date) {
    if (!date) return null;
    let d = new Date(date);
    d.setDate(d.getDate() + 1); // Add 1 day
    return d.toISOString().split("T")[0]; // Return only the date part
}

exports.getCurrentGuests = (req, res) => {
    const hotelID = req.body.hotelID; // User snippet uses body, usually GET should use params/query but adhering to snippet

    // Adhering to snippet logic but adapting to our schema
    // bookings (b) links users (g) and rooms (r)
    // users table acts as Guest
    // rooms table has hotel_id directly

    const query = `
      SELECT
      u.id as GuestID,
      u.first_name as FirstName,
      u.last_name as LastName,
      u.email as EmailAddress,
      u.phone_number as PhoneNumber,
      b.check_in_date as CheckInDate,
      b.check_out_date as CheckOutDate,
      b.num_adults as NumAdults,
      b.num_children as NumChildren,
      r.room_number as RoomNumber,
      r.id as RoomID,
      r.image as RoomImage
    FROM users u
    INNER JOIN bookings b ON u.id = b.user_id
    INNER JOIN rooms r ON b.room_id = r.id
    WHERE r.hotel_id = ?
    AND CURDATE() BETWEEN b.check_in_date AND b.check_out_date
    `;

    db.query(query, [hotelID], (err, results) => {
        if (err) {
            console.error("Error fetching current guests:", err);
            res.status(500).send("Error fetching current guests.");
        } else {
            const mappedResults = results.map(guest => {
                guest.CheckInDate = adjustDate(guest.CheckInDate);
                guest.CheckOutDate = adjustDate(guest.CheckOutDate);
                if (guest.RoomImage) {
                    guest.RoomImage = Buffer.from(guest.RoomImage).toString('base64');
                }
                return guest;
            });
            res.send(mappedResults);
        }
    });
};

exports.filterGuests = (req, res) => {
    const { firstName, lastName, phoneNumber, email, guestID, fromDate, toDate, hotelID } = req.body;

    let query = `
      SELECT
        u.id as GuestID,
        u.first_name as FirstName,
        u.last_name as LastName,
        u.email as EmailAddress,
        u.phone_number as PhoneNumber,
        b.check_in_date as CheckInDate,
        b.check_out_date as CheckOutDate,
        b.num_adults as NumAdults,
        b.num_children as NumChildren,
        r.room_number as RoomNumber,
        r.id as RoomID,
        r.image as RoomImage
      FROM users u
      INNER JOIN bookings b ON u.id = b.user_id
      INNER JOIN rooms r ON b.room_id = r.id
      WHERE 1=1 
    `;
    // 'WHERE 1=1' allows appending AND conditions easily. 
    // Snippet had `WHERE g.FirstName <> 'System'`, we can add that if we have a system user, but for now generic.

    const params = [];

    if (firstName) {
        query += " AND u.first_name LIKE ?";
        params.push(`%${firstName}%`);
    }
    if (lastName) {
        query += " AND u.last_name LIKE ?";
        params.push(`%${lastName}%`);
    }
    if (phoneNumber) {
        query += " AND u.phone_number LIKE ?";
        params.push(`%${phoneNumber}%`);
    }
    if (email) {
        query += " AND u.email LIKE ?";
        params.push(`%${email}%`);
    }
    if (guestID) {
        query += " AND u.id = ?";
        params.push(guestID);
    }
    if (fromDate) {
        query += " AND b.check_in_date >= ?";
        params.push(fromDate);
    }
    if (toDate) {
        query += " AND b.check_out_date <= ?";
        params.push(toDate);
    }
    if (hotelID) {
        query += " AND r.hotel_id = ?";
        params.push(hotelID);
    }

    db.query(query, params, (err, results) => {
        if (err) {
            console.error("Error filtering guests:", err);
            res.status(500).send("Error filtering guests.");
        } else {
            const mappedResults = results.map(guest => {
                guest.CheckInDate = adjustDate(guest.CheckInDate);
                guest.CheckOutDate = adjustDate(guest.CheckOutDate);
                if (guest.RoomImage) {
                    guest.RoomImage = Buffer.from(guest.RoomImage).toString('base64');
                }
                return guest;
            });

            res.send(mappedResults);
        }
    });
};

exports.getCheckoutToday = (req, res) => {
    const hotelID = req.body.hotelID;

    const query = `
    SELECT
      u.id as GuestID,
      u.first_name as FirstName,
      u.last_name as LastName,
      u.email as EmailAddress,
      u.phone_number as PhoneNumber,
      b.id as BookingID,
      b.check_in_date as CheckInDate,
      b.check_out_date as CheckOutDate,
      b.num_adults as NumAdults,
      b.num_children as NumChildren,
      r.room_number as RoomNumber,
      r.id as RoomID,
      r.image as RoomImage
    FROM users u
    INNER JOIN bookings b ON u.id = b.user_id
    INNER JOIN rooms r ON b.room_id = r.id
    WHERE DATE(b.check_out_date) <= CURDATE()
      AND r.hotel_id = ? 
      AND (b.payment_status = 'Pending' OR b.payment_status IS NULL)
  `;

    db.query(query, [hotelID], (err, results) => {
        if (err) {
            console.error("Error fetching today's checkouts:", err);
            res.status(500).send("Error fetching today's checkouts.");
        } else {
            const mappedResults = results.map(guest => {
                guest.CheckInDate = adjustDate(guest.CheckInDate);
                guest.CheckOutDate = adjustDate(guest.CheckOutDate);
                if (guest.RoomImage) {
                    guest.RoomImage = Buffer.from(guest.RoomImage).toString('base64');
                }
                return guest;
            });
            res.send(mappedResults);
        }
    });
};

exports.filterCheckout = (req, res) => {
    const {
        hotelID,
        firstName,
        lastName,
        email,
        phoneNumber,
        guestID,
        nid, // Assuming NID might be added to users later, or ignoring if not present
        dateOfBirth // Assuming DOB might be added later
    } = req.body;

    let query = `
    SELECT
      u.id as GuestID,
      u.first_name as FirstName,
      u.last_name as LastName,
      u.email as EmailAddress,
      u.phone_number as PhoneNumber,
      b.id as BookingID,
      b.check_in_date as CheckInDate,
      b.check_out_date as CheckOutDate,
      r.room_number as RoomNumber
    FROM users u
    INNER JOIN bookings b ON u.id = b.user_id
    INNER JOIN rooms r ON b.room_id = r.id
    WHERE DATE(b.check_out_date) <= CURDATE() 
      AND (b.payment_status = 'Pending' OR b.payment_status IS NULL)
  `;

    const params = [];

    if (hotelID) {
        query += " AND r.hotel_id = ?";
        params.push(hotelID);
    }
    if (firstName) {
        query += " AND u.first_name LIKE ?";
        params.push(`%${firstName}%`);
    }
    if (lastName) {
        query += " AND u.last_name LIKE ?";
        params.push(`%${lastName}%`);
    }
    if (email) {
        query += " AND u.email LIKE ?";
        params.push(`%${email}%`);
    }
    if (phoneNumber) {
        query += " AND u.phone_number LIKE ?";
        params.push(`%${phoneNumber}%`);
    }
    if (guestID) {
        query += " AND u.id = ?";
        params.push(guestID);
    }

    db.query(query, params, (err, results) => {
        if (err) {
            console.error("Error filtering checkouts:", err);
            return res.status(500).send("Error filtering checkouts.");
        }

        const mappedResults = results.map(guest => ({
            ...guest,
            CheckInDate: adjustDate(guest.CheckInDate),
            CheckOutDate: adjustDate(guest.CheckOutDate),
        }));

        res.send(mappedResults);
    });
};

exports.paymentDone = (req, res) => {
    const { guestID, amount, bookingID } = req.body;

    // Ideally we need bookingID to be specific, but snippet uses guestID.
    // If multiple bookings exist for same guest? user snippet assumes one active booking.
    // I will use bookingID if provided, else find active booking for guest.

    const targetId = bookingID ? `id = ?` : `user_id = ? AND (payment_status = 'Pending' OR payment_status IS NULL)`;
    const idParam = bookingID || guestID;

    const updateBookingSql = `UPDATE bookings SET payment_status = 'Paid' WHERE ${targetId}`;

    db.query(updateBookingSql, [idParam], (err, result) => {
        if (err) {
            console.error("Error updating booking status:", err);
            return res.status(500).send("Error updating booking status");
        }

        // We need the BookingID for transaction logging if we only had guestID
        // But for simplicity/speed let's assume we have it or can get it. 
        // If we updated by guestID, we might have updated multiple? (Snippet logic)
        // Let's stick to snippet logic: "UPDATE Booking ... WHERE GuestID = ?"

        // Log transaction
        // Snippet inserts into Transactions selecting from Booking.
        // My Transaction table has BookingID column.

        // If we used bookingID:
        if (bookingID) {
            const transactionSql = `INSERT INTO Transactions (BookingID, AmountPaid) VALUES (?, ?)`;
            db.query(transactionSql, [bookingID, amount], (err) => {
                if (err) console.error("Error logging transaction:", err);
                else console.log("Transaction list updated");
            });
        } else {
            // If we used guestID, we need to find the booking ID(s) we just paid for?
            // Snippet: INSERT INTO Transactions ... SELECT BookingID ... WHERE GuestID = ?
            const transactionSql = `
                INSERT INTO Transactions (BookingID, AmountPaid)
                SELECT id, ? FROM bookings WHERE user_id = ? AND payment_status = 'Paid'
                ORDER BY check_out_date DESC LIMIT 1
            `; // Taking latest paid booking
            db.query(transactionSql, [amount, guestID], (err) => {
                if (err) console.error("Error logging transaction:", err);
                else console.log("Transaction list updated");
            });
        }

        // Update Room Status to Available?
        // Snippet had commented out room status update.
        // In my logic, room status 'occupied' is independent of payment, 
        // usually freed on actual checkout (cancelBooking or separate checkout endpoint).
        // But user snippet implies payment = done = room free? 
        // Snippet: "UPDATE Room SET Status = 'Available'..." (Commented out).
        // I will leave it alone unless requested, as `cancelBooking` frees the room.

        res.send("Done");
    });
};

exports.getBillingDetails = (req, res) => {
    const { guestID } = req.body;

    if (!guestID) {
        return res.status(400).send("GuestID is required.");
    }

    // 1. Get Payment amount (TotalBooking in snippet, but we calculate it dynamically? or store it?)
    // Snippet assumes `TotalBooking` exists in Booking table. We don't have it.
    // We have Transaction history or we calculate from room price * days.

    // 2. Calculate Room Charges
    const queryRoomCharges = `
      SELECT SUM(DATEDIFF(b.check_out_date, b.check_in_date) * r.price) AS RoomTotal
      FROM bookings b
      INNER JOIN rooms r ON b.room_id = r.id
      WHERE b.user_id = ? AND (b.payment_status = 'Pending' OR b.payment_status IS NULL)
    `;

    // 3. Calculate Feature Charges
    // Assuming Features table links to guest currently
    const queryFeatureCharges = `
      SELECT SUM(FeatureAdditionalPrice) AS FeatureTotal
      FROM Features
      WHERE GuestID = ?
    `;

    let response = {
        TotalBooking: 0,
        PaymentStatus: 'Pending',
        RoomTotal: 0,
        FeatureTotal: 0,
        AmountToBePaid: 0
    };

    db.query(queryRoomCharges, [guestID], (err, roomResults) => {
        if (err) {
            console.error("Error calculating room charges:", err);
            return res.status(500).send("Error calculating charges.");
        }

        response.RoomTotal = roomResults[0]?.RoomTotal ? parseFloat(roomResults[0].RoomTotal) : 0;

        db.query(queryFeatureCharges, [guestID], (err, featureResults) => {
            if (err) {
                console.error("Error calculating feature charges:", err);
                return res.status(500).send("Error calculating feature charges.");
            }

            response.FeatureTotal = featureResults[0]?.FeatureTotal ? parseFloat(featureResults[0].FeatureTotal) : 0;
            response.AmountToBePaid = response.RoomTotal + response.FeatureTotal;

            res.send(response);
        });
    });
};
