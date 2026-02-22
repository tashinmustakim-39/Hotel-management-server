const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.getProfile = (req, res) => {
  const userId = req.user.id;

  db.query(
    'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
    [userId],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        user: result[0]
      });
    }
  );
};

// Get All Users (Admin)
exports.getAllUsers = (req, res) => {
  const sql = "SELECT id, name, email, role, created_at FROM users";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ success: false, error: "Error fetching users" });
    }
    res.json(results);
  });
};

// Create User (Admin)
exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    // Check if user exists
    const checkSql = "SELECT id FROM users WHERE email = ?";
    const [existing] = await db.promise().query(checkSql, [email]);

    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    await db.promise().query(sql, [name, email, hashedPassword, role]);

    res.status(201).json({ success: true, message: "User created successfully" });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update User (Admin)
exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const { name, email, role, password } = req.body;

  try {
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = "UPDATE users SET name = ?, email = ?, role = ?, password = ? WHERE id = ?";
      await db.promise().query(sql, [name, email, role, hashedPassword, userId]);
    } else {
      const sql = "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?";
      await db.promise().query(sql, [name, email, role, userId]);
    }

    res.json({ success: true, message: "User updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete User (Admin)
exports.deleteUser = (req, res) => {
  const userId = req.params.id;
  const sql = "DELETE FROM users WHERE id = ?";

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res.status(500).json({ success: false, error: "Error deleting user" });
    }
    res.json({ success: true, message: "User deleted successfully" });
  });
};
