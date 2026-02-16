require('dotenv').config();
const db = require('../src/config/db');

async function checkSchema() {
    try {
        console.log('--- BillMaintenanceLedger Schema (JSON) ---');
        const [rows] = await db.promise().query("DESCRIBE BillMaintenanceLedger");
        console.log(JSON.stringify(rows, null, 2));
    } catch (err) {
        console.error('Error:', err);
    } finally {
        db.end();
    }
}

checkSchema();
