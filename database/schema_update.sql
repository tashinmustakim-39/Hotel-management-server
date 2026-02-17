-- Create Room Class Table
CREATE TABLE IF NOT EXISTS room_class (
    RoomClassID INT AUTO_INCREMENT PRIMARY KEY,
    ClassType VARCHAR(50) NOT NULL UNIQUE
);

-- Populate Room Classes (if empty)
INSERT IGNORE INTO room_class (ClassType) VALUES 
('Standard'), 
('Deluxe'), 
('Suite'), 
('Penthouse');

-- Create Rooms Table (or update if exists - for simplicity we just create IF NOT EXISTS and adding columns if needed might require a separate procedure, but here we assume we can just create it or it matches)
-- However, since I see previous schema didn't have it (or I didn't see it in schema.sql), I'll create it.
-- If it exists from a previous run but different structure, this might fail or not update. 
-- Given the "check_tables.js" context, I'll assume we can just run this.

CREATE TABLE IF NOT EXISTS rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_id INT, 
    room_number VARCHAR(20) NOT NULL,
    type VARCHAR(50), -- Keeping 'type' as requested, though linked to room_class implies we might want RoomClassID here too. The prompt asked for 'type' in `rooms` table AND a `room_class` table. I will stick to the user's explicit column list for `rooms`: id, room_number, type, price, capacity, status, created_at. + hotel_id + image
    price DECIMAL(10, 2),
    capacity INT,
    status ENUM('available', 'occupied') DEFAULT 'available',
    image LONGBLOB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- If you want to link them, we might want to add RoomClassID to rooms, but user didn't explicitly ask to change 'type' column to ID. 
-- But in the provided snippet: `JOIN Room_Class ON available_rooms.RoomClassID = Room_Class.RoomClassID`
-- So the user's *snippet* implies a FK. The user's *text description* said `type varchar(50)`.
-- I will add `RoomClassID` to `rooms` as well to support the join if they want it, OR just map `type` to `ClassType`.
-- The user's snippet uses `available_rooms` table. I will stick to `rooms` table as per their text description but adding necessary columns for functionality.

ALTER TABLE rooms ADD COLUMN IF NOT EXISTS hotel_id INT;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS image LONGBLOB;
