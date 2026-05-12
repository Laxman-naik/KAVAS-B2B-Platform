const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const redis = require("../config/redis");

const REFRESH_PREFIX = "refresh:user:";

/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  try {
    const { full_name, email, password, phone, role } = req.body || {};

    if (!full_name || !email || !password) {
      return res.status(400).json({
        message: "full_name, email and password are required",
      });
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
//       role:user.role,
//       accessToken,
//       refreshToken,
//     });
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!req.body) {
      return res.status(400).json({
        message:
          "Request body missing. Send JSON with Content-Type: application/json",
      });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const match = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!match) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    /* ================= TOKENS ================= */

    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken(user);

    /* ================= SESSION ================= */

    const sessionId =
      req.headers["x-session-id"] || crypto.randomUUID();

    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

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
      VALUES ($1, $2, $3, $4, $5, $6, false)
      `,
      [
        sessionId,
        user.id,
        refreshToken,
        req.ip ||
          req.headers["x-forwarded-for"] ||
          null,
        req.headers["user-agent"] || null,
        expiresAt,
      ]
    );

    /* ================= RESPONSE ================= */

    return res.json({
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },

      role: user.role,

      accessToken,

      refreshToken,
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);

    return res.status(500).json({
      message: err.message,
    });
  }
};

/* ================= REFRESH ================= */
exports.refreshTokenHandler = async (req, res) => {
  try {
    const refreshToken = req.body?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "No refresh token",
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET
      );
    } catch (err) {
      return res.status(403).json({
        message: "Invalid refresh token",
      });
    }

    const sessionResult = await pool.query(
      `
      SELECT * FROM sessions
      WHERE refresh_token = $1
      AND is_revoked = false
      AND expires_at > NOW()
      LIMIT 1
      `,
      [refreshToken]
    );

    const session = sessionResult.rows[0];

    if (!session) {
      return res.status(403).json({
        message: "Session expired or revoked",
      });
    }

    if (session.user_id !== decoded.id) {
      return res.status(403).json({
        message: "Token mismatch",
      });
    }

    const newAccessToken = jwt.sign(
      {
        id: decoded.id,
        role: "buyer",
      },
      process.env.ACCESS_SECRET,
      {
        expiresIn: "15m",
      }
    );

    await pool.query(
      `
      UPDATE sessions
      SET last_used_at = NOW()
      WHERE id = $1
      `,
      [session.id]
    );

    return res.json({
      accessToken: newAccessToken,
    });

  } catch (err) {
    console.error("FULL REFRESH ERROR:", err);

    return res.status(500).json({
      message: err?.message || "Refresh failed",
    });
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