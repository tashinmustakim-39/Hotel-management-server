require('dotenv').config();
const db = require('../src/config/db');

async function seedData() {
    console.log('Starting data seeding (bookingCustomer)...');

    try {
        // 1. Seed Departments
        const [deptCount] = await db.promise().query('SELECT count(*) as count FROM Department');
        if (deptCount[0].count === 0) {
            console.log('Seeding Departments...');
            await db.promise().query(`
                INSERT INTO Department (DeptName, HotelID) VALUES 
                ('Housekeeping', 1),
                ('Front Desk', 1),
                ('Kitchen', 1),
                ('Maintenance', 1)
            `);
        }

        // Get Department IDs
        const [departments] = await db.promise().query('SELECT DeptID, DeptName FROM Department');
        const deptMap = {};
        departments.forEach(d => deptMap[d.DeptName] = d.DeptID);

        // 2. Seed Employees (if empty)
        const [empCount] = await db.promise().query('SELECT count(*) as count FROM Employee');
        if (empCount[0].count === 0) {
            console.log('Seeding Employees...');
            await db.promise().query(`
                INSERT INTO Employee (FirstName, LastName, Phone, Email, hourly_pay, Salary, Role, working_status, HiredDate, Address, DeptID) VALUES 
                ('Alice', 'Cleaner', '123-456-7890', 'alice@hotel.com', 15.00, 2500.00, 'Staff', 'Working', '2023-01-15', '123 Maple St', ?),
                ('Bob', 'Receptionist', '987-654-3210', 'bob@hotel.com', 18.00, 3000.00, 'Receptionist', 'Working', '2023-02-20', '456 Oak Ave', ?),
                ('Charlie', 'Chef', '555-123-4567', 'charlie@hotel.com', 25.00, 4500.00, 'Chef', 'Working', '2023-03-10', '789 Pine Ln', ?),
                ('Mike', 'Fixer', '444-555-6666', 'mike@hotel.com', 20.00, 3200.00, 'Technician', 'Working', '2023-04-05', '321 Elm Rd', ?)
            `, [deptMap['Housekeeping'], deptMap['Front Desk'], deptMap['Kitchen'], deptMap['Maintenance']]);
        } else {
            console.log('Employees already seeded.');
        }

        // 4. Seed Inventory and Transactions
        const [invCount] = await db.promise().query('SELECT count(*) as count FROM Inventory');
        if (invCount[0].count === 0) {
            console.log('Seeding Inventory...');
            // Insert Inventory Items
            await db.promise().query(`
                INSERT INTO Inventory (HotelID, ItemName, Quantity) VALUES 
                (1, 'Soap', 100),
                (1, 'Towels', 50),
                (1, 'Food Supplies', 10)
            `);

            // Get Inventory IDs
            const [inventoryItems] = await db.promise().query('SELECT InventoryID, ItemName FROM Inventory WHERE HotelID = 1');
            const invMap = {};
            inventoryItems.forEach(i => invMap[i.ItemName] = i.InventoryID);

            console.log('Seeding Inventory Transactions...');
            // Insert Transactions with links to InventoryID
            // Note: We used 'Order' type to represent initial stock or purchases
            await db.promise().query(`
                INSERT INTO InventoryTransactions (InventoryID, HotelID, TransactionType, Quantity, Status, UnitPrice, TransactionDate) VALUES 
                (?, 1, 'Order', 100, 'Completed', 1.50, '2026-01-15 10:00:00'),
                (?, 1, 'Order', 50, 'Completed', 5.00, '2026-01-20 14:00:00'),
                (?, 1, 'Order', 10, 'Completed', 200.00, '2026-02-05 09:00:00')
            `, [invMap['Soap'], invMap['Towels'], invMap['Food Supplies']]);

        } else {
            console.log('Inventory already seeded.');
        }

        // 4. Seed Maintenance Ledger (2026 dates)
        const [ledgerCount] = await db.promise().query('SELECT count(*) as count FROM BillMaintenanceLedger');
        if (ledgerCount[0].count === 0) {
            console.log('Seeding Maintenance Ledger...');
            await db.promise().query(`
                INSERT INTO BillMaintenanceLedger (HotelID, ServiceType, Amount, LedgerDate, Description) VALUES 
                (1, 'Plumbing', 500.00, '2026-01-10 09:00:00', 'Pipe repair'),
                (1, 'Electrical', 150.00, '2026-02-15 14:00:00', 'Light replacement'),
                (1, 'HVAC', 1200.00, '2026-03-01 10:00:00', 'AC Unit Service')
            `);
        } else {
            console.log('Maintenance Ledger already seeded.');
        }

        // 5. Seed bookingCustomer (NEW Table)
        const [bcCount] = await db.promise().query('SELECT count(*) as count FROM bookingCustomer');
        if (bcCount[0].count === 0) {
            console.log('Seeding bookingCustomer...');
            await db.promise().query(`
                INSERT INTO bookingCustomer (name, email, hotel_id, room_number, amount, payment_date, payment_method, status) VALUES 
                ('John Doe', 'john@example.com', 1, '101', 250.00, '2026-01-25', 'Credit Card', 'confirmed'),
                ('Jane Smith', 'jane@example.com', 1, '102', 100.00, '2026-01-26', 'Cash', 'confirmed'),
                ('Another Guest', 'guest@example.com', 2, '205', 300.00, '2026-02-01', 'Online', 'confirmed') 
            `);
        }

        console.log('Seeding complete!');
    } catch (err) {
        console.error('Seeding error:', err);
    } finally {
        db.end();
    }
}

seedData();
