const db = require('./src/config/db');

const checkUsers = () => {
    db.query("SELECT id, name, email, role FROM users", (err, results) => {
        if (err) {
            console.error("Error:", err);
            // process.exit(1); // db.query is async but db connection might keep process open.
            // Just log and let it hang or exit if needed.
        }
        console.log("Users in DB:", results);
        process.exit(0);
    });
};

checkUsers();
