const mysql = require('mysql2');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '220041239',
  database: 'hotel_management',
  port: 3306
});

module.exports = db;
