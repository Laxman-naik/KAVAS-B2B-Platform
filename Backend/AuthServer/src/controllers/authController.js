const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  try {
    const { full_name, email, password, phone, role } = req.body || {};

    if (!full_name || !email || !password) {
      return res.status(400).json({
        message: "full_name, email and password are required",
      });
    }

    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);

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

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

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

    let sessionId = req.headers["x-session-id"];

    if (!sessionId) {
      sessionId = crypto.randomUUID();
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await pool.query(`DELETE FROM sessions WHERE session_id = $1`, [sessionId]);

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
      role: user.role,
      accessToken,
      refreshToken,
      sessionId,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

/* ================= REFRESH TOKEN ================= */
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

    const userResult = await pool.query(
      "SELECT id, role FROM users WHERE id = $1",
      [decoded.id]
    );

    const user = userResult.rows[0];

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    const newAccessToken = generateAccessToken({
      id: user.id,
      role: user.role,
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

/* ================= FORGOT PASSWORD ================= */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const result = await pool.query(
      "SELECT id, email FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({
        message: "Email not registered",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(
      `
      UPDATE users
      SET reset_password_token = $1,
          reset_password_expires = $2
      WHERE id = $3
      `,
      [resetToken, expiry, user.id]
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "KAVAS Password Reset",
      html: `
        <h2>KAVAS Password Reset</h2>
        <p>Click the below link to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 15 minutes.</p>
      `,
    });

    return res.json({
      success: true,
      message: "Password reset link sent to email",
    });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    return res.status(500).json({
      message: "Failed to send reset link",
    });
  }
};

/* ================= RESET PASSWORD ================= */
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body || {};

    if (!token || !password) {
      return res.status(400).json({
        message: "Token and new password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    const result = await pool.query(
      `
      SELECT id FROM users
      WHERE reset_password_token = $1
      AND reset_password_expires > NOW()
      `,
      [token]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      `
      UPDATE users
      SET password_hash = $1,
          reset_password_token = NULL,
          reset_password_expires = NULL
      WHERE id = $2
      `,
      [hashed, user.id]
    );

    await pool.query(
      `
      UPDATE sessions
      SET is_revoked = true
      WHERE user_id = $1
      `,
      [user.id]
    );

    return res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    return res.status(500).json({
      message: "Failed to reset password",
    });
  }
};

/* ================= CHANGE PASSWORD ================= */
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body || {};

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "New password must be at least 8 characters",
      });
    }

    const result = await pool.query(
      "SELECT id, password_hash FROM users WHERE id = $1",
      [userId]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `
      UPDATE users
      SET password_hash = $1
      WHERE id = $2
      `,
      [hashed, user.id]
    );

    await pool.query(
      `
      UPDATE sessions
      SET is_revoked = true
      WHERE user_id = $1
      `,
      [user.id]
    );

    return res.json({
      success: true,
      message: "Password changed successfully. Please login again.",
    });
  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err);
    return res.status(500).json({
      message: "Failed to change password",
    });
  }
};