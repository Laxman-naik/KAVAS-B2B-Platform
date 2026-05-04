const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const redis = require("../config/redis");

/* ================= TOKENS ================= */

const generateAccessToken = (admin) => {
  return jwt.sign(
    { id: admin.id, role: admin.role },
    process.env.ACCESS_SECRET,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (admin) => {
  return jwt.sign(
    { id: admin.id },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

/* ================= LOGIN ================= */

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const result = await pool.query(
      "SELECT * FROM admins WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const admin = result.rows[0];

    const isMatch = await bcrypt.compare(password, admin.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const accessToken = generateAccessToken(admin);
    const refreshToken = generateRefreshToken(admin);

    await redis.set(
      `admin_refresh:${admin.id}`,
      refreshToken,
      "EX",
      7 * 24 * 60 * 60
    );

    return res.json({
      message: "Login success",
      user: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
      accessToken,
      refreshToken,
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* ================= REFRESH ================= */

const refreshTokenHandler = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    const storedToken = await redis.get(`admin_refresh:${decoded.id}`);

    if (!storedToken || storedToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id, role: "admin" },
      process.env.ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    return res.json({
      accessToken: newAccessToken,
    });

  } catch (err) {
    return res.status(401).json({ message: "Session expired" });
  }
};

/* ================= LOGOUT ================= */

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
      await redis.del(`admin_refresh:${decoded.id}`);
    }
  } catch (err) {
    console.log("Logout error:", err.message);
  }

  return res.json({ message: "Logged out" });
};
/* ================= GET ME ================= */

const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, full_name, email, role FROM admins WHERE id=$1",
      [req.user.id]
    );

    return res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("GET ME ERROR:", err);
    return res.status(500).json({ user: null });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, full_name, email, phone, role, created_at FROM users ORDER BY created_at DESC"
    );

    return res.json({
      users: result.rows,
    });
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};

module.exports = { login, refreshTokenHandler, logout, getMe, getAllUsers};