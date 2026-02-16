-- Department Table
CREATE TABLE IF NOT EXISTS Department (
    DeptID INT AUTO_INCREMENT PRIMARY KEY,
    DeptName VARCHAR(100) NOT NULL,
    HotelID INT NOT NULL,
    INDEX(HotelID)
);

-- Employee Table
CREATE TABLE IF NOT EXISTS Employee (
    EmpID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    Phone VARCHAR(20),
    Email VARCHAR(150),
    hourly_pay DECIMAL(10, 2) DEFAULT 0.00,
    Salary DECIMAL(10, 2) DEFAULT 0.00, -- Keeping for compatibility if needed, or derived
    Role VARCHAR(50),
    working_status VARCHAR(50) DEFAULT 'Working',
    HiredDate DATE DEFAULT (CURRENT_DATE),
    Address TEXT,
    DeptID INT,
    FOREIGN KEY (DeptID) REFERENCES Department(DeptID) ON DELETE SET NULL
);

-- bookingCustomer Table (Replaces Transactions)
CREATE TABLE IF NOT EXISTS bookingCustomer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    hotel_id INT NOT NULL,
    room_number VARCHAR(50),
    amount DECIMAL(10, 2) DEFAULT 0.00,
    payment_date DATE DEFAULT (CURRENT_DATE),
    payment_method VARCHAR(50),
    status VARCHAR(50) DEFAULT 'confirmed',
    INDEX(hotel_id)
);

-- Inventory Table (Master List)
CREATE TABLE IF NOT EXISTS Inventory (
    InventoryID INT AUTO_INCREMENT PRIMARY KEY,
    HotelID INT NOT NULL,
    ItemName VARCHAR(255) NOT NULL,
    Quantity INT DEFAULT 0,
    LastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX(HotelID)
);

-- InventoryTransactions Table (History/entries)
CREATE TABLE IF NOT EXISTS InventoryTransactions (
    TransactionID INT AUTO_INCREMENT PRIMARY KEY,
    InventoryID INT NOT NULL,
    HotelID INT NOT NULL,
    TransactionType VARCHAR(50) NOT NULL, -- 'Order', 'Use', etc.
    Quantity INT NOT NULL,
    Status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Completed'
    UnitPrice DECIMAL(10, 2),
    TransactionDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    ReceiveDate DATETIME,
    FOREIGN KEY (InventoryID) REFERENCES Inventory(InventoryID) ON DELETE CASCADE,
    INDEX(HotelID)
);

-- BillMaintenanceLedger Table
CREATE TABLE IF NOT EXISTS BillMaintenanceLedger (
    LedgerID INT AUTO_INCREMENT PRIMARY KEY,
    HotelID INT NOT NULL,
    ServiceType VARCHAR(100) NOT NULL,
    Amount DECIMAL(10, 2) NOT NULL,
    LedgerDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    Description TEXT,
    INDEX(HotelID)
);
