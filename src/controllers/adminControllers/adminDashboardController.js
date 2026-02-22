const db = require('../../config/db');

exports.getDashboardStats = async (req, res) => {
    try {
        console.log("Fetching dashboard stats...");

        // Helper function to promisify db.query
        const query = (sql) => {
            return new Promise((resolve, reject) => {
                db.query(sql, (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });
        };

        // Parallel Execution for Performance
        const [
            totalHotels,
            totalRooms,
            totalUsers,
            totalBookings,
            revenueData
        ] = await Promise.all([
            query("SELECT COUNT(*) as count FROM Hotel WHERE Status = 'active'"), // Note: Table is Hotel based on hotelController
            query("SELECT COUNT(*) as count FROM rooms"),
            query("SELECT COUNT(*) as count FROM users"),
            query("SELECT COUNT(*) as count FROM bookings"),
            // Revenue calc: Assuming bookings have a price or room price * days. 
            // For now, let's just count bookings as a proxy or use a simple join if plausible.
            // Let's stick to simple counts provided in the plan first to ensure stability.
            // If real revenue data is needed, we'd need to JOIN rooms and sum price * datediff.
            // Let's try a simple join for revenue if possible, else 0.
            query(`
                SELECT SUM(r.price * DATEDIFF(b.check_out_date, b.check_in_date)) as total 
                FROM bookings b 
                JOIN rooms r ON b.room_id = r.id 
                WHERE b.status != 'cancelled'
            `)
        ]);

        const stats = {
            hotels: totalHotels[0].count,
            rooms: totalRooms[0].count,
            users: totalUsers[0].count,
            bookings: totalBookings[0].count,
            revenue: revenueData[0].total || 0
        };

        res.json({
            success: true,
            stats
        });

    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics",
            error: error.message
        });
    }
};
