require('dotenv').config();
const db = require('./src/config/db');

async function test() {
    console.log("Testing queries...");

    const query = (sql) => {
        return new Promise((resolve, reject) => {
            db.query(sql, (err, results) => {
                if (err) reject({ sql, err });
                else resolve(results);
            });
        });
    };

    try {
        console.log("1. Hotels...");
        const hotels = await query("SELECT COUNT(*) as count FROM Hotel WHERE Status = 'active'");
        console.log("Hotels:", hotels);

        console.log("2. Rooms...");
        const rooms = await query("SELECT COUNT(*) as count FROM rooms");
        console.log("Rooms:", rooms);

        console.log("3. Users...");
        const users = await query("SELECT COUNT(*) as count FROM users");
        console.log("Users:", users);

        console.log("4. Bookings...");
        const bookings = await query("SELECT COUNT(*) as count FROM bookings");
        console.log("Bookings:", bookings);

        console.log("5. Revenue...");
        const revenue = await query(`
            SELECT SUM(r.price * DATEDIFF(b.check_out_date, b.check_in_date)) as total 
            FROM bookings b 
            JOIN rooms r ON b.room_id = r.id 
            WHERE b.status != 'cancelled'
        `);
        console.log("Revenue:", revenue);

        console.log("ALL SUCCESS!");
        process.exit(0);

    } catch (error) {
        console.error("FAIL:", error);
        process.exit(1);
    }
}

test();
