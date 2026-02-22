require('dotenv').config();
const db = require('./src/config/db');

async function addUnitPriceToInventory() {
    try {
        console.log('Adding UnitPrice column to Inventory table...');

        // Check if column exists
        const [columns] = await db.promise().query("SHOW COLUMNS FROM Inventory LIKE 'UnitPrice'");

        if (columns.length === 0) {
            await db.promise().query("ALTER TABLE Inventory ADD COLUMN UnitPrice DECIMAL(10, 2) DEFAULT 0.00 AFTER Quantity");
            console.log('Column UnitPrice added successfully.');
        } else {
            console.log('Column UnitPrice already exists.');
        }
        process.exit(0);
    } catch (err) {
        console.error('Error adding column:', err);
        process.exit(1);
    }
}

addUnitPriceToInventory();
