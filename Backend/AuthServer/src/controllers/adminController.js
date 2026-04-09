const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const redis = require("../config/redis");

/* ================= CONFIG ================= */

const isProd = true;

const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
};

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

    if (!admin.password_hash) {
      return res.status(500).json({ message: "Password not set" });
    }

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

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Login success",
      user: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
      accessToken, refreshToken,
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

/* ================= REFRESH ================= */

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

    const storedToken = await redis.get(`admin_refresh:${decoded.id}`);

    if (!storedToken || storedToken !== token) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id, role: "admin" },
      process.env.ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", newAccessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    return res.json({ message: "Access token refreshed" });

  } catch (err) {
    console.error("REFRESH ERROR:", err);

    // ✅ FIXED (match cookie options)
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    return res.status(401).json({ message: "Session expired" });
  }
};

/* ================= LOGOUT ================= */

const logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

      // ✅ Remove session from Redis
      await redis.del(`admin_refresh:${decoded.id}`);
    }
  } catch (err) {
    console.log("Logout error:", err.message);
  }

  // ❌ REMOVED wrong "token" cookie
  // ✅ FIXED cookie clearing (must match options)
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

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

module.exports = { login, refreshToken, logout, getMe,};