const db = require('../../config/db');

// Fetch total salary cost and earnings (Current Year)
exports.getHotelExpenses = async (req, res) => {
    const { hotelID } = req.body;

    if (!hotelID) return res.status(400).send("Hotel ID is required");

    try {
        // 1. Get Total Salary for the Hotel's Departments
        const salaryQuery = `
            SELECT COALESCE(SUM(Salary), 0) AS TotalSalary
            FROM Employee E
            JOIN Department D ON E.DeptID = D.DeptID
            WHERE D.HotelID = ?
        `;
        const [salaryResult] = await db.promise().query(salaryQuery, [hotelID]);
        const totalSalary = salaryResult[0].TotalSalary;

        // 2. Get Total Earnings from bookingCustomer for Current Year
        const earningsQuery = `
            SELECT COALESCE(SUM(amount), 0) AS TotalEarnings
            FROM bookingCustomer
            WHERE hotel_id = ? AND YEAR(payment_date) = YEAR(CURDATE())
        `;
        const [earningsResult] = await db.promise().query(earningsQuery, [hotelID]);
        const totalEarnings = earningsResult[0].TotalEarnings;

        res.json({
            TotalSalary: totalSalary,
            TotalEarnings: totalEarnings
        });

    } catch (err) {
        console.error("Error fetching hotel expenses:", err);
        res.status(500).send("Error fetching expenses data.");
    }
};

// Fetch yearly transaction earnings for the last 5 years
exports.getTransactionEarnings = async (req, res) => {
    const { hotelID } = req.body;

    if (!hotelID) return res.status(400).send("Hotel ID is required");

    const query = `
        SELECT YEAR(payment_date) AS Year, COALESCE(SUM(amount), 0) AS TotalAmount
        FROM bookingCustomer
        WHERE hotel_id = ?
        AND payment_date >= DATE_SUB(CURDATE(), INTERVAL 5 YEAR)
        GROUP BY YEAR(payment_date)
        ORDER BY Year ASC;
    `;

    try {
        const [results] = await db.promise().query(query, [hotelID]);
        res.json(results);
    } catch (err) {
        console.error("Error fetching yearly earnings:", err);
        res.status(500).send("Error fetching yearly earnings.");
    }
};

// Get Monthly Transactions for the Current Year
exports.getMonthlyTransactions = async (req, res) => {
    const { hotelID } = req.body;

    // Note: User snippet used hotelID in body but query didn't use it? 
    // I will filter by hotelID to be correct/safe.
    if (!hotelID) return res.status(400).send("Hotel ID is required");

    const currentYear = new Date().getFullYear();

    const query = `
        SELECT 
            MONTH(payment_date) AS Month, 
            SUM(amount) AS TotalEarnings 
        FROM bookingCustomer 
        WHERE hotel_id = ? AND YEAR(payment_date) = ? 
        GROUP BY MONTH(payment_date)
        ORDER BY MONTH(payment_date);
    `;

    try {
        const [results] = await db.promise().query(query, [hotelID, currentYear]);
        res.json(results);
    } catch (err) {
        console.error("Error fetching monthly transactions:", err);
        res.status(500).send("Error fetching monthly transactions.");
    }
};

// Add a new maintenance ledger entry
exports.addMaintenanceEntry = async (req, res) => {
    const { hotelId, serviceType, amount, ledgerDate, description } = req.body;

    if (!hotelId || !serviceType || !amount || !ledgerDate) {
        return res.status(400).send("All fields are required");
    }

    const query = `
        INSERT INTO BillMaintenanceLedger (HotelID, ServiceType, Amount, LedgerDate, Description)
        VALUES (?, ?, ?, ?, ?)
    `;

    try {
        const [result] = await db.promise().query(query, [hotelId, serviceType, amount, ledgerDate, description]);
        res.status(201).json({ message: "Entry added successfully", LedgerID: result.insertId });
    } catch (err) {
        console.error("Error adding maintenance ledger:", err);
        res.status(500).send("Error adding maintenance ledger");
    }
};

// Fetch all maintenance ledger entries for a hotel
exports.getMaintenanceLedger = async (req, res) => {
    const { hotelId } = req.query;

    if (!hotelId) {
        return res.status(400).send("Hotel ID is required");
    }

    const query = `SELECT * FROM BillMaintenanceLedger WHERE HotelID = ?`;

    try {
        const [results] = await db.promise().query(query, [hotelId]);
        res.status(200).json(results);
    } catch (err) {
        console.error("Error fetching maintenance ledger:", err);
        res.status(500).send("Error fetching maintenance ledger");
    }
};
