// const pool = require("../config/db");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const { generateAccessToken, generateRefreshToken, } = require("../utils/token");
// const redis = require("../config/redis");
// const REFRESH_PREFIX = "refresh:user:";

// // ================== REGISTER ==================
// exports.register = async (req, res) => {
//   try {
//     const { full_name, email, password, phone, role } = req.body;

//     const hashed = await bcrypt.hash(password, 10);

//     const result = await pool.query(
//       `INSERT INTO users (full_name, email, password_hash, phone, role)
//        VALUES ($1, $2, $3, $4, $5)
//        RETURNING id, full_name, email, phone, role`,
//       [full_name, email, hashed, phone, role || "buyer"]
//     );

//     res.json({ user: result.rows[0] });
//   } catch (err) {
//     console.error("REGISTER ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // ================== LOGIN ==================
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "Email & password required" });
//     }

//     const result = await pool.query(
//       "SELECT * FROM users WHERE email=$1",
//       [email]
//     );

//     const user = result.rows[0];

//     if (!user) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const match = await bcrypt.compare(password, user.password_hash);

//     if (!match) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const accessToken = generateAccessToken(user);
//     const refreshToken = generateRefreshToken(user);

//     await redis.set(
//       `${REFRESH_PREFIX}${user.id}`,
//       refreshToken,
//       "EX",
//       7 * 24 * 60 * 60
//     );

//     const isProd = process.env.NODE_ENV === "production";

//     res.cookie("accessToken", accessToken, {
//       httpOnly: true,
//       secure: isProd,
//       sameSite: isProd ? "none" : "lax",
//       path: "/",
//       maxAge: 15 * 60 * 1000,
//     });

//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: isProd,
//       sameSite: isProd ? "none" : "lax",
//       path: "/",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     res.json({
//       user: {
//         id: user.id,
//         full_name: user.full_name,
//         email: user.email,
//         role: user.role,
//       },
//       accessToken,refreshToken
//     });
//   } catch (err) {
//     console.error("LOGIN ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // ================== REFRESH TOKEN ==================
// exports.refreshTokenHandler = async (req, res) => {
//   try {
//     const token = req.cookies?.refreshToken;

//     if (!token) {
//       return res.status(401).json({ message: "No refresh token" });
//     }

//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.REFRESH_SECRET);
//     } catch (err) {
//       return res.status(403).json({ message: "Invalid refresh token" });
//     }

//     const stored = await redis.get(`${REFRESH_PREFIX}${decoded.id}`);

//     if (!stored || stored !== token) {
//       return res.status(403).json({ message: "Invalid session" });
//     }

//     const newAccessToken = generateAccessToken({ id: decoded.id });

//     const isProd = process.env.NODE_ENV === "production";

//     res.cookie("accessToken", newAccessToken, {
//       httpOnly: true,
//       secure: isProd,
//       sameSite: isProd ? "none" : "lax",
//       path: "/",
//       maxAge: 15 * 60 * 1000,
//     });

//     res.json({ message: "Token refreshed" });
//   } catch (err) {
//     console.error("REFRESH ERROR:", err);

//     res.clearCookie("accessToken");
//     res.clearCookie("refreshToken");

//     res.status(403).json({ message: "Session expired" });
//   }
// };

// // ================== GET ME ==================
// exports.getMe = async (req, res) => {
//   try {
//     const token = req.cookies?.accessToken;

//     if (!token) {
//       return res.status(401).json({ user: null, message: "No token" });
//     }

//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.ACCESS_SECRET);
//     } catch (err) {
//       return res.status(401).json({ user: null, message: "Invalid token" });
//     }

//     const result = await pool.query(
//       "SELECT id, full_name, email, role FROM users WHERE id=$1",
//       [decoded.id]
//     );

//     const user = result.rows[0];

//     if (!user) {
//       return res.status(404).json({ user: null, message: "User not found" });
//     }

//     return res.json({ user });
//   } catch (err) {
//     console.error("GET ME ERROR:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// // ================== LOGOUT ==================
// exports.logout = async (req, res) => {
//   try {
//     const token = req.cookies?.refreshToken;

//     if (token) {
//       const decoded = jwt.decode(token);
//       if (decoded?.id) {
//         await redis.del(`${REFRESH_PREFIX}${decoded.id}`);
//       }
//     }

//     const isProd = process.env.NODE_ENV === "production";

//     res.clearCookie("accessToken", {
//       httpOnly: true,
//       secure: isProd,
//       sameSite: isProd ? "none" : "lax",
//       path: "/",
//     });

//     res.clearCookie("refreshToken", {
//       httpOnly: true,
//       secure: isProd,
//       sameSite: isProd ? "none" : "lax",
//       path: "/",
//     });

//     res.json({ message: "Logged out" });
//   } catch (err) {
//     console.error("LOGOUT ERROR:", err);
//     res.status(500).json({ message: "Logout failed" });
//   }
// };

const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const redis = require("../config/redis");

const REFRESH_PREFIX = "refresh:user:";

/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  try {
    const { full_name, email, password, phone, role } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, phone, role)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id, full_name, email, role`,
      [full_name, email, hashed, phone, role || "buyer"]
    );

    return res.json({ user: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    const user = result.rows[0];

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await redis.set(
      `${REFRESH_PREFIX}${user.id}`,
      refreshToken,
      "EX",
      7 * 24 * 60 * 60
    );

    return res.json({
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* ================= REFRESH ================= */
exports.refreshTokenHandler = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    } catch {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const stored = await redis.get(`${REFRESH_PREFIX}${decoded.id}`);

    if (!stored || stored !== refreshToken) {
      return res.status(403).json({ message: "Session expired" });
    }

    const newAccessToken = generateAccessToken({ id: decoded.id });

    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(500).json({ message: "Refresh failed" });
  }
};

/* ================= GET ME (JWT HEADER ONLY) ================= */
exports.getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ user: null });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

    const result = await pool.query(
      "SELECT id, full_name, email, role FROM users WHERE id=$1",
      [decoded.id]
    );

    return res.json({ user: result.rows[0] });
  } catch {
    return res.status(401).json({ user: null });
  }
};

/* ================= LOGOUT ================= */
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      const decoded = jwt.decode(refreshToken);
      if (decoded?.id) {
        await redis.del(`${REFRESH_PREFIX}${decoded.id}`);
      }
    }

    return res.json({ message: "Logged out" });
  } catch {
    return res.status(500).json({ message: "Logout failed" });
  }
};