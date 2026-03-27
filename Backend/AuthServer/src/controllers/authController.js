const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const { redis } = require("../config/redis");

// ================== REGISTER ==================

exports.register = async (req, res) => {
  try {
    const { full_name, email, password, role } = req.body;

    const allowedRoles = ["buyer", "vendor"];
    const userRole = allowedRoles.includes(role) ? role : "buyer";

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, full_name, email, role`,
      [full_name, email, hashed, userRole]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================== LOGIN ==================

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // ✅ MULTI-DEVICE SUPPORT (better)
    const key = `refresh:${user.id}:${Date.now()}`;

    await redis.set(key, refreshToken, "EX", 7 * 24 * 60 * 60);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "Strict",
      path: "/api/auth",
      maxAge: 7 * 24 * 60 * 60 * 1000, // ✅ added
    });

    res.json({
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================== REFRESH TOKEN ==================

exports.refreshTokenHandler = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

    // 🔍 Find token in Redis (multi-session safe)
    const keys = await redis.keys(`refresh:${decoded.id}:*`);

    let valid = false;

    for (const key of keys) {
      const stored = await redis.get(key);
      if (stored === token) {
        valid = true;
        break;
      }
    }

    if (!valid) {
      return res.status(403).json({ message: "Invalid session" });
    }

    const userRes = await pool.query(
      "SELECT id, role FROM users WHERE id=$1",
      [decoded.id]
    );

    const user = userRes.rows[0];

    const newAccessToken = generateAccessToken(user);

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: "Token expired or invalid" });
  }
};

// ================== LOGOUT ==================

exports.logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.REFRESH_SECRET);
      } catch {
        decoded = null;
      }

      if (decoded) {
        const keys = await redis.keys(`refresh:${decoded.id}:*`);

        for (const key of keys) {
          const stored = await redis.get(key);
          if (stored === token) {
            await redis.del(key);
          }
        }
      }
    }

    res.clearCookie("refreshToken", {
      path: "/api/auth",
    });

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================== GET CURRENT USER ==================

exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ use middleware

    const result = await pool.query(
      "SELECT id, full_name, email, role FROM users WHERE id=$1",
      [userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};