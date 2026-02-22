require('dotenv').config();
const db = require('./src/config/db');

console.log("Testing DB connection...");

db.query('SELECT 1', (err, result) => {
    if (err) {
        console.error("DB Connection Failed:", err);
        process.exit(1);
    }
    console.log("DB Connection OK");

    const sql = "SELECT * FROM Hotel LIMIT 1";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error querying Hotel table:", err);
            process.exit(1);
        }
        console.log("Hotel Query OK. Row count:", result.length);
        if (result.length > 0) console.log("Sample row:", result[0]);
        process.exit(0);
    });
});
