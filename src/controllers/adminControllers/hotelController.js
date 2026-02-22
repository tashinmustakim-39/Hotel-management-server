const db = require('../../config/db');

// Get all active hotels
exports.getHotels = (req, res) => {
    const query = "SELECT * FROM Hotel WHERE Status = 'active';";

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching hotels:", err);
            return res.status(500).send("Error fetching hotels.");
        }

        const parsedResults = results.map(hotel => {
            let parsedLocation = hotel.Location;
            try {
                if (typeof hotel.Location === "string") {
                    // Check if it looks like a JSON object/array before parsing, 
                    // or just try parsing and fallback
                    if (hotel.Location.startsWith('{') || hotel.Location.startsWith('[')) {
                        parsedLocation = JSON.parse(hotel.Location);
                    }
                }
            } catch (e) {
                console.error("Error parsing location for hotel " + hotel.HotelID, e);
                // Keep original string if parse fails
            }

            return {
                ...hotel,
                Location: parsedLocation,
                HotelImage: hotel.HotelImage ? hotel.HotelImage.toString('base64') : null
            };
        });

        res.json(parsedResults);
    });
};

// Add a new hotel
exports.addHotel = (req, res) => {
    const { name, description, starRating, location, status } = req.body;
    const hotelImage = req.file ? req.file.buffer : null;

    if (!name || !description || !starRating || !location || !status || !hotelImage) {
        return res.status(400).send("All fields including image are required.");
    }

    const sql = "INSERT INTO Hotel (Name, Description, StarRating, Location, Status, HotelImage) VALUES (?, ?, ?, ?, ?, ?)";

    // Parse location if it's sent as a stringified JSON (common in multipart/form-data)
    let parsedLocation = location;
    try {
        if (typeof location === 'string') {
            parsedLocation = JSON.parse(location);
        }
    } catch (e) {
        console.error("Error parsing location:", e);
        // If it's not valid JSON, we'll treat it as a simple string
    }

    db.query(sql, [name, description, starRating, JSON.stringify(parsedLocation), status, hotelImage], (err, result) => {
        if (err) {
            console.error("Error adding hotel:", err);
            res.status(500).send("Error adding hotel");
        } else {
            res.status(201).send("Hotel added successfully");
        }
    });
};

// Deactivate a hotel
exports.deactivateHotel = (req, res) => {
    const hotelId = req.params.id;
    const sql = "UPDATE Hotel SET Status = 'inactive' WHERE HotelID = ?";

    db.query(sql, [hotelId], (err, result) => {
        if (err) {
            console.error("Error deactivating hotel:", err);
            res.status(500).send("Error deactivating hotel");
        } else {
            res.status(200).send("Hotel deactivated successfully");
        }
    });
};

// Update a hotel
exports.updateHotel = (req, res) => {
    const hotelId = req.params.id;
    const { name, description, starRating, location } = req.body;
    const hotelImage = req.file ? req.file.buffer : null;

    if (!name || !description || !starRating || !location) {
        return res.status(400).send("All hotel details are required");
    }

    let parsedLocation = location;
    try {
        if (typeof location === 'string') {
            parsedLocation = JSON.parse(location);
        }
    } catch (e) {
        console.error("Error parsing location:", e); // Might be already an object or regular string if not JSON
    }


    let sql;
    let params;

    if (hotelImage) {
        sql = `
            UPDATE Hotel 
            SET Name = ?, Description = ?, StarRating = ?, Location = ?, HotelImage = ?
            WHERE HotelID = ?
        `;
        params = [name, description, starRating, JSON.stringify(parsedLocation), hotelImage, hotelId];
    } else {
        sql = `
            UPDATE Hotel 
            SET Name = ?, Description = ?, StarRating = ?, Location = ?
            WHERE HotelID = ?
        `;
        params = [name, description, starRating, JSON.stringify(parsedLocation), hotelId];
    }

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error("Error updating hotel:", err);
            return res.status(500).send("Error updating hotel");
        }
        res.status(200).send("Hotel updated successfully");
    });
};
