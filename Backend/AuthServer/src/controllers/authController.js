// const pool = require("../config/db");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const { generateAccessToken, generateRefreshToken } = require("../utils/token");
// const redis = require("../config/redis");

// const REFRESH_PREFIX = "refresh:user:";

// /* ================= REGISTER ================= */
// exports.register = async (req, res) => {
//   try {
//     const { full_name, email, password, phone, role } = req.body || {};

//     if (!full_name || !email || !password) {
//       return res.status(400).json({
//         message: "full_name, email and password are required",
//       });
//     }

//     const hashed = await bcrypt.hash(password, 10);

//     const result = await pool.query(
//       `INSERT INTO users (full_name, email, password_hash, phone, role)
//        VALUES ($1,$2,$3,$4,$5)
//        RETURNING id, full_name, email, role`,
//       [full_name, email, hashed, phone, role || "buyer"]
//     );

//     return res.json({ user: result.rows[0] });
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

// /* ================= LOGIN ================= */
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body || {};

//     if (!req.body) {
//       return res.status(400).json({
//         message: "Request body missing. Send JSON with Content-Type: application/json",
//       });
//     }

//     const result = await pool.query(
//       "SELECT * FROM users WHERE email=$1",
//       [email]
//     );

//     const user = result.rows[0];

//     if (!user) return res.status(401).json({ message: "Invalid credentials" });

//     const match = await bcrypt.compare(password, user.password_hash);
//     if (!match) return res.status(401).json({ message: "Invalid credentials" });

//     const accessToken = generateAccessToken(user);
//     const refreshToken = generateRefreshToken(user);

//     await redis.set(
//       `${REFRESH_PREFIX}${user.id}`,
//       refreshToken,
//       "EX",
//       7 * 24 * 60 * 60
//     );

//     return res.json({
//       user: {
//         id: user.id,
//         full_name: user.full_name,
//         email: user.email,
//         role: user.role,
//       },
//       accessToken,
//       refreshToken,
//     });
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

// /* ================= REFRESH ================= */
// exports.refreshTokenHandler = async (req, res) => {
//   try {
//     const { refreshToken } = req.body;

//     if (!refreshToken) {
//       return res.status(401).json({ message: "No refresh token" });
//     }

//     let decoded;
//     try {
//       decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
//     } catch {
//       return res.status(403).json({ message: "Invalid refresh token" });
//     }

//     const stored = await redis.get(`${REFRESH_PREFIX}${decoded.id}`);

//     if (!stored || stored !== refreshToken) {
//       return res.status(403).json({ message: "Session expired" });
//     }

//     const newAccessToken = generateAccessToken({ id: decoded.id });

//     return res.json({ accessToken: newAccessToken });
//   } catch (err) {
//     return res.status(500).json({ message: "Refresh failed" });
//   }
// };

// /* ================= GET ME (JWT HEADER ONLY) ================= */
// exports.getMe = async (req, res) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.status(401).json({ user: null });
//     }

//     const token = authHeader.split(" ")[1];

//     const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

//     const result = await pool.query(
//       "SELECT id, full_name, email, role FROM users WHERE id=$1",
//       [decoded.id]
//     );

//     return res.json({ user: result.rows[0] });
//   } catch {
//     return res.status(401).json({ user: null });
//   }
// };

// /* ================= LOGOUT ================= */
// exports.logout = async (req, res) => {
//   try {
//     const { refreshToken } = req.body;

//     if (refreshToken) {
//       const decoded = jwt.decode(refreshToken);
//       if (decoded?.id) {
//         await redis.del(`${REFRESH_PREFIX}${decoded.id}`);
//       }
//     }

//     return res.json({ message: "Logged out" });
//   } catch {
//     return res.status(500).json({ message: "Logout failed" });
//   }
// };

const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");

/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  try {
    const { full_name, email, password, phone, role } = req.body || {};

    if (!full_name || !email || !password) {
      return res.status(400).json({
        message: "full_name, email and password are required",
      });
    }

    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

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
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
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

    /* ================= SESSION ID ================= */
    let sessionId = req.headers["x-session-id"];

    if (!sessionId) {
      sessionId = require("crypto").randomUUID();
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    /* remove old session for same sessionId */
    await pool.query(
      `DELETE FROM sessions WHERE session_id = $1`,
      [sessionId]
    );

    /* insert new session */
    await pool.query(
      `
      INSERT INTO sessions (
        session_id,
        user_id,
        refresh_token,
        ip_address,
        user_agent,
        expires_at,
        is_revoked
      )
      VALUES ($1,$2,$3,$4,$5,$6,false)
      `,
      [
        sessionId,
        user.id,
        refreshToken,
        req.ip || req.headers["x-forwarded-for"] || null,
        req.headers["user-agent"] || null,
        expiresAt,
      ]
    );

    return res.json({
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
      role:user.role,
      accessToken,
      refreshToken,
      sessionId,
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

/* ================= REFRESH ================= */
exports.refreshTokenHandler = async (req, res) => {
  try {
    const { refreshToken, sessionId } = req.body || {};

    if (!refreshToken || !sessionId) {
      return res.status(401).json({
        message: "Missing refresh token or session id",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    } catch {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const sessionRes = await pool.query(
      `
      SELECT * FROM sessions
      WHERE session_id = $1
      AND refresh_token = $2
      AND is_revoked = false
      AND expires_at > NOW()
      `,
      [sessionId, refreshToken]
    );

    const session = sessionRes.rows[0];

    if (!session) {
      return res.status(403).json({ message: "Session expired" });
    }

    const newAccessToken = generateAccessToken({
      id: decoded.id,
      role: "buyer",
    });

    await pool.query(
      `UPDATE sessions SET last_used_at = NOW() WHERE session_id = $1`,
      [sessionId]
    );

    return res.json({ accessToken: newAccessToken });

  } catch (err) {
    console.error("REFRESH ERROR:", err);
    return res.status(500).json({ message: "Refresh failed" });
  }
};

/* ================= GET ME ================= */
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
    const { sessionId } = req.body || {};

    if (!sessionId) {
      return res.status(400).json({ message: "Missing session id" });
    }

    await pool.query(
      `
      UPDATE sessions
      SET is_revoked = true
      WHERE session_id = $1
      `,
      [sessionId]
    );

    return res.json({ message: "Logged out successfully" });

  } catch (err) {
    console.error("LOGOUT ERROR:", err);
    return res.status(500).json({ message: "Logout failed" });
  }
};