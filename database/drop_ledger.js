require('dotenv').config();
const db = require('../src/config/db');

async function dropLedger() {
    try {
        console.log('Dropping BillMaintenanceLedger table...');
        await db.promise().query("DROP TABLE IF EXISTS BillMaintenanceLedger");
        console.log('BillMaintenanceLedger table dropped.');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        db.end();
    }
}

dropLedger();
