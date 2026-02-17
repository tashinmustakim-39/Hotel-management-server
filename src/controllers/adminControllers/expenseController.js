const db = require('../../config/db');

// Get Inventory Cost by Month
exports.getInventorySummary = async (req, res) => {
    const { hotelId } = req.params;
    const { start, end } = req.query;
    try {
        const [results] = await db.promise().query(
            `SELECT 
                DATE_FORMAT(TransactionDate, '%Y-%m') AS InventoryMonth,
                SUM(Quantity * UnitPrice) AS TotalInventoryCost
             FROM InventoryTransactions
             WHERE HotelID = ? AND TransactionDate BETWEEN ? AND ?
             GROUP BY InventoryMonth
             ORDER BY InventoryMonth`,
            [hotelId, start, end]
        );
        res.json(results);
    } catch (err) {
        console.error('Inventory Summary Error:', err);
        res.status(500).json({ error: 'Failed to fetch inventory summary' });
    }
};

// Get Maintenance Cost by Month
exports.getMaintenanceSummary = async (req, res) => {
    const { hotelId } = req.params;
    const { start, end } = req.query;
    try {
        const [results] = await db.promise().query(
            `SELECT 
                DATE_FORMAT(LedgerDate, '%Y-%m') AS MaintenanceMonth,
                SUM(Amount) AS TotalMaintenanceCost
             FROM BillMaintenanceLedger
             WHERE HotelID = ? AND LedgerDate BETWEEN ? AND ?
             GROUP BY MaintenanceMonth
             ORDER BY MaintenanceMonth`,
            [hotelId, start, end]
        );
        res.json(results);
    } catch (err) {
        console.error('Maintenance Summary Error:', err);
        res.status(500).json({ error: 'Failed to fetch maintenance summary' });
    }
};

// Get Salary by Department
exports.getSalarySummary = async (req, res) => {
    const { hotelId } = req.params;
    try {
        const [results] = await db.promise().query(
            `SELECT 
                d.DeptName,
                SUM(e.Salary) AS TotalDeptSalary
             FROM Employee e
             JOIN Department d ON e.DeptID = d.DeptID
             WHERE d.HotelID = ?
             GROUP BY d.DeptName
             ORDER BY d.DeptName`,
            [hotelId]
        );
        res.json(results);
    } catch (err) {
        console.error('Salary Summary Error:', err);
        res.status(500).json({ error: 'Failed to fetch salary summary' });
    }
};

// Get Monthly Revenue from Transactions
exports.getTransactionRevenue = async (req, res) => {
    const { hotelId } = req.params;
    const { start, end } = req.query;
    try {
        const [results] = await db.promise().query(
            `SELECT 
                DATE_FORMAT(payment_date, '%Y-%m') AS RevenueMonth,
                SUM(amount) AS TotalRevenue
             FROM bookingCustomer
             WHERE hotel_id = ? AND payment_date BETWEEN ? AND ?
             GROUP BY RevenueMonth
             ORDER BY RevenueMonth`,
            [hotelId, start, end]
        );
        res.json(results);
    } catch (err) {
        console.error('Transaction Revenue Error:', err);
        res.status(500).json({ error: 'Failed to fetch transaction revenue' });
    }
};

// Financial Summary for Totals
exports.getFinancialSummary = async (req, res) => {
    const { hotelId } = req.params;
    const { start, end } = req.query;

    try {
        // Calculate number of months in the range
        const startDate = new Date(start);
        const endDate = new Date(end);
        const months = Math.max(1, (endDate.getFullYear() - startDate.getFullYear()) * 12 +
            (endDate.getMonth() - startDate.getMonth()) + 1);

        const [[inventoryResult]] = await db.promise().query(
            `SELECT IFNULL(SUM(Quantity * UnitPrice), 0) AS inventory
             FROM InventoryTransactions
             WHERE HotelID = ? AND TransactionDate BETWEEN ? AND ?`,
            [hotelId, start, end]
        );
        const inventory = inventoryResult ? inventoryResult.inventory : 0;

        const [[maintenanceResult]] = await db.promise().query(
            `SELECT IFNULL(SUM(Amount), 0) AS maintenance
             FROM BillMaintenanceLedger
             WHERE HotelID = ? AND LedgerDate BETWEEN ? AND ?`,
            [hotelId, start, end]
        );
        const maintenance = maintenanceResult ? maintenanceResult.maintenance : 0;

        // Multiply monthly salaries by number of months
        const [[salaryResult]] = await db.promise().query(
            `SELECT IFNULL(SUM(Salary), 0) AS monthlySalaries
             FROM Employee e
             JOIN Department d ON e.DeptID = d.DeptID
             WHERE d.HotelID = ?`,
            [hotelId]
        );
        const salaries = (salaryResult ? salaryResult.monthlySalaries : 0) * months;

        const [[revenueResult]] = await db.promise().query(
            `SELECT IFNULL(SUM(amount), 0) AS revenue
             FROM bookingCustomer
             WHERE hotel_id = ? AND payment_date BETWEEN ? AND ?`,
            [hotelId, start, end]
        );
        const revenue = revenueResult ? revenueResult.revenue : 0;

        res.json({ inventory, maintenance, salaries, revenue });
    } catch (err) {
        console.error('Summary function error:', err);
        res.status(500).json({ error: 'Failed to load financial summary' });
    }
};
