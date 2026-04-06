const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db"); // ✅ no .js needed in CommonJS

// ✅ ADMIN LOGIN
// const adminLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     console.log(req.body)

//     // Query the admins table
//     const result = await pool.query(
//       "SELECT * FROM admins WHERE email = $1",
//       [email]
//     );

//     if (result.rows.length === 0) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     const admin = result.rows[0];

//     // Check role
//     if (admin.role !== "admin") {
//       return res.status(403).json({ message: "Not an admin" });
//     }

//     // Compare password
//     const isMatch = await bcrypt.compare(password, admin.password_hash);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     // Generate JWT token
//     const accessToken = jwt.sign(
//       { id: admin.id, role: admin.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({
//       message: "Admin login successful",
//       accessToken,
//       user: {
//         id: admin.id,
//         email: admin.email,
//         role: admin.role,
//         full_name: admin.full_name
//       },
//     });
//   } catch (error) {
//     console.error("Admin login error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM admins WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const admin = result.rows[0];

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🔥 ACCESS TOKEN (short life)
    const accessToken = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // 🔥 REFRESH TOKEN (long life)
    const refreshToken = jwt.sign(
      { id: admin.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Store refresh token in DB (or Redis better)
    await pool.query(
      "UPDATE admins SET refresh_token=$1 WHERE id=$2",
      [refreshToken, admin.id]
    );

    // ✅ Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true, 
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      user: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const refreshTokenHandler = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const result = await pool.query(
      "SELECT * FROM admins WHERE id=$1",
      [decoded.id]
    );

    const admin = result.rows[0];

    if (admin.refresh_token !== token) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token refreshed" });

  } catch (err) {
    return res.status(403).json({ message: "Expired refresh token" });
  }
};

// ✅ ADMIN LOGOUT
// const adminLogout = async (req, res) => {
//   try {
//     res.json({ message: "Logout successful" });
//   } catch (error) {
//     res.status(500).json({ message: "Logout error" });
//   }
// };

const adminLogout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      await pool.query(
        "UPDATE admins SET refresh_token=NULL WHERE refresh_token=$1",
        [token]
      );
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({ message: "Logged out" });

  } catch (err) {
    res.status(500).json({ message: "Logout error" });
  }
};

// ✅ DASHBOARD
const getAdminDashboard = async (req, res) => {
  try {
    const usersCount = await pool.query("SELECT COUNT(*) FROM users");

    const buyersCount = await pool.query(
      "SELECT COUNT(*) FROM users WHERE role='buyer'"
    );

    const vendorsCount = await pool.query(
      "SELECT COUNT(*) FROM users WHERE role='vendor'"
    );

    res.json({
      totalUsers: usersCount.rows[0].count,
      buyers: buyersCount.rows[0].count,
      vendors: vendorsCount.rows[0].count,
      admin: req.user
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY id DESC"
    );

    res.json(users.rows);

  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// ✅ GET USER BY ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.rows[0]);

  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

// ✅ UPDATE ROLE
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["admin", "buyer", "vendor"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    await pool.query(
      "UPDATE users SET role = $1 WHERE id = $2",
      [role, id]
    );

    res.json({ message: "User role updated" });

  } catch (error) {
    res.status(500).json({ message: "Error updating role" });
  }
};

// ✅ DELETE USER
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM users WHERE id = $1", [id]);

    res.json({ message: "User deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

// ✅ SEARCH USERS
const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    const users = await pool.query(
      "SELECT id, name, email, role FROM users WHERE name ILIKE $1 OR email ILIKE $1",
      [`%${q}%`]
    );

    res.json(users.rows);

  } catch (error) {
    res.status(500).json({ message: "Search failed" });
  }
};

// ✅ EXPORT (VERY IMPORTANT)
module.exports = {
  adminLogin,
  adminLogout,
  getAdminDashboard,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  searchUsers
};