const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/token");

const redis = require("../config/redis");

const REFRESH_PREFIX = "refresh:user:";

// ================== REGISTER ==================
exports.register = async (req, res) => {
  try {
    const { full_name, email, password, phone, role } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, phone, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, full_name, email, phone, role`,
      [full_name, email, hashed, phone, role || "buyer"]
    );

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================== LOGIN ==================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    //  store refresh token in Redis
    await redis.set(
      `${REFRESH_PREFIX}${user.id}`,
      refreshToken,
      "EX",
      7 * 24 * 60 * 60
    );

    const isProd = process.env.NODE_ENV === "production";

    //  ACCESS TOKEN COOKIE (IMPORTANT)
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 15 * 60 * 1000,
    });

    //  REFRESH TOKEN COOKIE
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    //  DO NOT send accessToken in response
    res.json({
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================== REFRESH TOKEN ==================
exports.refreshTokenHandler = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

    const stored = await redis.get(`${REFRESH_PREFIX}${decoded.id}`);

    if (!stored || stored !== token) {
      return res.status(403).json({ message: "Invalid session" });
    }

    const newAccessToken = generateAccessToken({ id: decoded.id });

    const isProd = process.env.NODE_ENV === "production";

    //  set new access token cookie
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token refreshed" });

  } catch (err) {
    console.error("REFRESH ERROR:", err);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(403).json({ message: "Session expired" });
  }
};

// ================== GET ME ==================
exports.getMe = async (req, res) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ user: null });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

    const result = await pool.query(
      "SELECT id, full_name, email, role FROM users WHERE id=$1",
      [decoded.id]
    );

    return res.json({ user: result.rows[0] });

  } catch (err) {
    return res.status(401).json({ user: null });
  }
};

// ================== LOGOUT ==================
exports.logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      const decoded = jwt.decode(token);

      if (decoded?.id) {
        await redis.del(`${REFRESH_PREFIX}${decoded.id}`);
      }
    }

    const isProd = process.env.NODE_ENV === "production";

    // ✅ clear BOTH cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    });

    res.json({ message: "Logged out" });

  } catch (err) {
    console.error("LOGOUT ERROR:", err);
    res.status(500).json({ message: "Logout failed" });
  }
};

// ================== LOGOUT ALL ==================
exports.logoutAll = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      const decoded = jwt.decode(token);

      if (decoded?.id) {
        await redis.del(`${REFRESH_PREFIX}${decoded.id}`);
      }
    }

    const isProd = process.env.NODE_ENV === "production";

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    });

    res.json({ message: "Logged out all sessions" });

  } catch (err) {
    console.error("LOGOUT ALL ERROR:", err);
    res.status(500).json({ message: "Error logging out" });
  }
};