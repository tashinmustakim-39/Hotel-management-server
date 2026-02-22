require('dotenv').config({ path: '../.env' });
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting:', err);
        process.exit(1);
    }

    db.query('SELECT id, user_id, room_id, status FROM bookings', (err, results) => {
        if (err) {
            console.error('Error fetching bookings:', err);
        } else {
            console.log('--- Bookings ---');
            if (results.length === 0) {
                console.log('No bookings found.');
            } else {
                console.table(results);
            }
        }
        db.end();
    });
});
