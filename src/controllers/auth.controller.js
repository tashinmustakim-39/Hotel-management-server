const bcrypt = require('bcrypt');
const db = require('../config/db');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // check if user already exists
    db.query(
      'SELECT id FROM users WHERE email = ?',
      [email],
      async (err, result) => {
        if (err) {
          return res.status(500).json({ success: false, error: err.message });
        }

        if (result.length > 0) {
          return res.status(409).json({
            success: false,
            message: 'User already exists'
          });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // insert user
        db.query(
          'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
          [name, email, hashedPassword],
          (err) => {
            if (err) {
              return res.status(500).json({
                success: false,
                error: err.message
              });
            }

            res.status(201).json({
              success: true,
              message: 'User registered successfully'
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
