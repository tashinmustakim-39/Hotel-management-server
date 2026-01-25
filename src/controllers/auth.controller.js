const bcrypt = require('bcrypt');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

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



exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  db.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }

      if (result.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const user = result[0];

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({
        success: true,
        message: 'Login successful',
        token
      });
    }
  );
};
