require('dotenv').config();
const db = require('./src/config/db');

const defaultDepartments = [
    'Front Desk',
    'Housekeeping',
    'Kitchen',
    'Maintenance',
    'Security',
    'Human Resources',
    'Management' // Added for managers themselves
];

async function seedDepartments() {
    try {
        const [hotels] = await db.promise().query('SELECT HotelID, Name FROM Hotel');
        console.log(`Found ${hotels.length} hotels.`);

        for (const hotel of hotels) {
            console.log(`Processing hotel: ${hotel.Name} (ID: ${hotel.HotelID})`);

            for (const deptName of defaultDepartments) {
                // Check if dept exists
                const [existing] = await db.promise().query(
                    'SELECT DeptID FROM Department WHERE HotelID = ? AND DeptName = ?',
                    [hotel.HotelID, deptName]
                );

                if (existing.length === 0) {
                    await db.promise().query(
                        'INSERT INTO Department (HotelID, DeptName) VALUES (?, ?)',
                        [hotel.HotelID, deptName]
                    );
                    console.log(`  + Added department: ${deptName}`);
                } else {
                    console.log(`  - Department exists: ${deptName}`);
                }
            }
        }
        console.log('Department seeding complete.');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding departments:', err);
        process.exit(1);
    }
}

seedDepartments();
