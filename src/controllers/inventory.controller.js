const db = require('../config/db');

// Fetch Inventory List based on HotelID
exports.getInventory = async (req, res) => {
    const hotelID = req.params.hotelID;

    if (!hotelID) return res.status(400).send("Hotel ID is required");

    const query = `SELECT InventoryID, ItemName, Quantity, LastUpdated FROM Inventory WHERE HotelID = ?`;

    try {
        const [results] = await db.promise().query(query, [hotelID]);
        res.status(200).json(results);
    } catch (err) {
        console.error("Error fetching inventory:", err);
        res.status(500).send("Error fetching inventory");
    }
};

// Add New Item
exports.addItem = async (req, res) => {
    const { hotelID, itemName } = req.body;

    if (!hotelID || !itemName) return res.status(400).send("Hotel ID and Item Name are required");

    const query = `INSERT INTO Inventory (HotelID, ItemName, Quantity) VALUES (?, ?, 0)`;

    try {
        const [result] = await db.promise().query(query, [hotelID, itemName]);
        res.status(201).json({ message: "Item added successfully", InventoryID: result.insertId });
    } catch (err) {
        console.error("Error adding item:", err);
        res.status(500).send("Error adding item");
    }
};

// Place an Order
exports.orderItem = async (req, res) => {
    const { hotelID, inventoryID, quantity, unitPrice } = req.body;

    if (!hotelID || !inventoryID || !quantity || quantity <= 0 || unitPrice == null) {
        return res.status(400).send("Hotel ID, Inventory ID, valid quantity, and unit price are required");
    }

    const insertTransactionQuery = `
        INSERT INTO InventoryTransactions (InventoryID, HotelID, TransactionType, Quantity, Status, UnitPrice)
        VALUES (?, ?, 'Order', ?, 'Pending', ?)
    `;

    try {
        await db.promise().query(insertTransactionQuery, [inventoryID, hotelID, quantity, unitPrice]);
        res.status(200).json({ message: "Order placed successfully" });
    } catch (err) {
        console.error("Error placing order:", err);
        res.status(500).send("Error placing order");
    }
};

// Fetch Transactions for Specific Hotel
exports.getTransactions = async (req, res) => {
    const hotelID = req.params.hotelID;

    if (!hotelID) return res.status(400).send("Hotel ID is required");

    const query = `
        SELECT t.TransactionID, t.InventoryID, i.ItemName, t.HotelID, t.TransactionType, t.Quantity, t.UnitPrice, t.Status, t.TransactionDate, t.ReceiveDate
        FROM InventoryTransactions t
        JOIN Inventory i ON t.InventoryID = i.InventoryID
        WHERE t.HotelID = ?
    `;

    try {
        const [results] = await db.promise().query(query, [hotelID]);
        res.status(200).json(results);
    } catch (err) {
        console.error("Error fetching transactions:", err);
        res.status(500).send("Error fetching transactions");
    }
};

// Receive an Order
exports.receiveOrder = async (req, res) => {
    const { transactionID } = req.body;

    if (!transactionID) return res.status(400).send("Transaction ID is required");

    const connection = await db.promise().getConnection();
    try {
        await connection.beginTransaction();

        const [results] = await connection.query(`
            SELECT InventoryID, Quantity 
            FROM InventoryTransactions 
            WHERE TransactionID = ? AND Status = 'Pending' 
            FOR UPDATE
        `, [transactionID]);

        if (results.length === 0) {
            await connection.rollback();
            return res.status(400).send("Transaction not found or already completed");
        }

        const { InventoryID, Quantity } = results[0];

        const [updateResult] = await connection.query(`
            UPDATE Inventory 
            SET Quantity = Quantity + ? 
            WHERE InventoryID = ?
        `, [Quantity, InventoryID]);

        if (updateResult.affectedRows === 0) {
            await connection.rollback();
            return res.status(400).send("Inventory item not found");
        }

        await connection.query(`
            UPDATE InventoryTransactions 
            SET Status = 'Completed', ReceiveDate = NOW() 
            WHERE TransactionID = ?
        `, [transactionID]);

        await connection.commit();
        res.status(200).json({ message: "Order received and inventory updated" });

    } catch (err) {
        await connection.rollback();
        console.error("Transaction error:", err);
        res.status(500).send("Database error");
    } finally {
        connection.release();
    }
};

// Update Transaction Manually
exports.updateTransaction = async (req, res) => {
    const { transactionID } = req.body;

    if (!transactionID) return res.status(400).send("Transaction ID is required");

    const query = `UPDATE InventoryTransactions SET Status = 'Completed' WHERE TransactionID = ? AND Status = 'Pending'`;

    try {
        const [result] = await db.promise().query(query, [transactionID]);

        if (result.affectedRows === 0) {
            return res.status(404).send("Transaction not found or already completed");
        }
        res.status(200).json({ message: "Transaction updated successfully" });
    } catch (err) {
        console.error("Error updating transaction:", err);
        res.status(500).send("Error updating transaction");
    }
};

// Fetch Transaction Summary (ROLLUP)
exports.getTransactionSummary = async (req, res) => {
    const hotelID = req.params.hotelID;

    if (!hotelID) return res.status(400).send("Hotel ID is required");

    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    const startDate = currentMonthStart.toISOString().split('T')[0];

    const nextMonth = new Date(currentMonthStart);
    nextMonth.setMonth(currentMonthStart.getMonth() + 1);
    const endDate = nextMonth.toISOString().split('T')[0];

    const query = `
        SELECT 
            Status,
            SUM(Quantity * UnitPrice) AS TotalValue
        FROM InventoryTransactions
        WHERE HotelID = ?
          AND TransactionDate >= ?
          AND TransactionDate < ?
        GROUP BY Status WITH ROLLUP
    `;

    try {
        const [results] = await db.promise().query(query, [hotelID, startDate, endDate]);
        res.status(200).json(results);
    } catch (err) {
        console.error("Error fetching transaction summary:", err);
        res.status(500).send("Error fetching transaction summary");
    }
};
