const db = require('../../config/db');

// List Employees with Department (POST)
exports.getEmployees = async (req, res) => {
    const { hotelID } = req.body;

    const query = `
        SELECT 
            e.EmpID, 
            e.FirstName,
            e.LastName,
            e.Phone,
            e.Email,
            e.hourly_pay,
            e.Role,
            e.working_status,
            e.HiredDate,
            d.DeptName,
            d.DeptID
        FROM Employee e
        INNER JOIN Department d ON e.DeptID = d.DeptID
        WHERE d.HotelID = ? AND e.working_status = 'Working' AND e.Role <> 'manager'
    `;

    try {
        const [results] = await db.promise().query(query, [hotelID]);
        res.json(results);
    } catch (err) {
        console.error('Error fetching employees:', err);
        res.status(500).send("Database error");
    }
};

// Get Employee Details (POST)
exports.getEmployeeDetails = async (req, res) => {
    const { empID } = req.body;

    const query = `
        SELECT 
            e.EmpID, e.DeptID, e.FirstName, e.LastName, e.Phone, e.Email,
            e.hourly_pay, e.Salary, e.Role, e.HiredDate, e.Address, d.DeptName
        FROM Employee e
        INNER JOIN Department d ON e.DeptID = d.DeptID
        WHERE e.EmpID = ?
    `;

    try {
        const [results] = await db.promise().query(query, [empID]);
        if (results.length === 0) {
            res.status(404).send("No employee found.");
        } else {
            res.send(results[0]);
        }
    } catch (err) {
        console.error("Error fetching employee details:", err);
        res.status(500).send("Error fetching employee details.");
    }
};

// Update Hourly Pay (POST)
exports.updateHourlyPay = async (req, res) => {
    const { empID, newHourlyPay } = req.body;

    if (!empID || !newHourlyPay || newHourlyPay <= 0) {
        return res.status(400).send("Invalid request data.");
    }

    const query = `UPDATE Employee SET hourly_pay = ? WHERE EmpID = ?`;

    try {
        await db.promise().query(query, [newHourlyPay, empID]);
        res.send("Hourly pay updated successfully.");
    } catch (err) {
        console.error("Error updating hourly pay:", err);
        res.status(500).send("Error updating hourly pay.");
    }
};

// Fetch Available Departments (POST)
exports.getDepartments = async (req, res) => {
    const { hotelID } = req.body;

    const query = `SELECT DeptID, DeptName FROM Department WHERE HotelID = ?`;

    try {
        const [results] = await db.promise().query(query, [hotelID]);
        res.send(results);
    } catch (err) {
        console.error("Error fetching departments:", err);
        res.status(500).send("Error fetching departments.");
    }
};

// Insert New Employee (POST)
exports.addEmployee = async (req, res) => {
    const { deptID, firstName, lastName, phone, email, hourlyPay, salary, workingStatus, role, hiredDate, address } = req.body;

    const query = `
        INSERT INTO Employee (DeptID, FirstName, LastName, Phone, Email, hourly_pay, working_status, Role, HiredDate, Address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        await db.promise().query(query, [deptID, firstName, lastName, phone, email, hourlyPay, workingStatus, role, hiredDate, address]);
        res.send("Employee added successfully.");
    } catch (err) {
        console.error("Error adding employee:", err);
        res.status(500).send("Error adding employee.");
    }
};

// Update Employee (POST)
exports.updateEmployee = async (req, res) => {
    const {
        empID, firstName, lastName, phone, email,
        deptName, hotelID, hourlyPay, role, workingStatus, hiredDate
    } = req.body;

    try {
        const findDeptQuery = `SELECT DeptID FROM Department WHERE DeptName = ? AND HotelID = ? LIMIT 1`;
        const [deptResult] = await db.promise().query(findDeptQuery, [deptName, hotelID]);

        if (deptResult.length === 0) {
            return res.status(404).send("Department not found.");
        }

        const deptID = deptResult[0].DeptID;

        const updateQuery = `
            UPDATE Employee
            SET FirstName = ?, LastName = ?, Phone = ?, Email = ?,
                hourly_pay = ?, Role = ?, working_status = ?, HiredDate = ?, DeptID = ?
            WHERE EmpID = ?
        `;

        await db.promise().query(updateQuery, [
            firstName, lastName, phone, email,
            hourlyPay, role, workingStatus, hiredDate,
            deptID, empID
        ]);

        res.send("Employee updated successfully.");
    } catch (err) {
        console.error("Error updating employee:", err);
        res.status(500).send("Error updating employee.");
    }
};

// Filter Employees (POST)
exports.filterEmployees = async (req, res) => {
    const { hotelID, FullName, Phone, Email, Role, Status } = req.body;

    let query = `
        SELECT E.*, D.DeptName
        FROM Employee E
        JOIN Department D ON E.DeptID = D.DeptID
        WHERE D.HotelID = ? AND E.Role <> 'manager' AND E.FirstName <> 'System'
    `;
    let params = [hotelID];

    if (FullName) {
        query += " AND CONCAT(E.FirstName, ' ', E.LastName) LIKE ?";
        params.push(`%${FullName}%`);
    }
    if (Phone) {
        query += " AND E.Phone LIKE ?";
        params.push(`%${Phone}%`);
    }
    if (Email) {
        query += " AND E.Email LIKE ?";
        params.push(`%${Email}%`);
    }
    if (Role) {
        query += " AND E.Role LIKE ?";
        params.push(`%${Role}%`);
    }
    if (Status) {
        query += " AND E.working_status = ?";
        params.push(Status);
    }

    try {
        const [results] = await db.promise().query(query, params);
        res.send(results);
    } catch (err) {
        console.error("Error filtering employees:", err);
        res.status(500).send("Error filtering employees.");
    }
};
