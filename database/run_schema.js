require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('../src/config/db');

const sqlPath = path.join(__dirname, 'schema.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

// Split SQL by semicolon ensuring we handle multiple statements
const statements = sql
    .split(';')
    .map(statement => statement.trim())
    .filter(statement => statement.length > 0);

console.log(`Found ${statements.length} SQL statements to execute.`);

const executeStatements = async () => {
    for (const statement of statements) {
        try {
            await db.promise().query(statement);
            console.log('Executed statement successfully.');
        } catch (err) {
            console.error('Error executing statement:', err.message);
        }
    }
    db.end();
};

executeStatements();
