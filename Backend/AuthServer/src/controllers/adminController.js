const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("../config/db");

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

    const admin = result.rows[0];

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ FIX: password check
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: admin.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    await pool.query(
      "UPDATE admins SET refresh_token=$1 WHERE id=$2",
      [refreshToken, admin.id]
    );

    const isProd = process.env.NODE_ENV === "production";

    // ✅ FIX: cookies properly configured
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Login success",
      user: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const result = await pool.query(
      "SELECT * FROM admins WHERE id=$1",
      [decoded.id]
    );

    const admin = result.rows[0];

    if (!admin || admin.refresh_token !== token) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
    });

    return res.json({ message: "Access token refreshed" });

  } catch (err) {
    console.error("REFRESH ERROR:", err);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(401).json({ message: "Session expired" });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

      await pool.query(
        "UPDATE admins SET refresh_token=NULL WHERE id=$1",
        [decoded.id]
      );
    }
  } catch (err) {
    console.log("Logout error:", err.message);
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return res.json({ message: "Logged out" });
};

module.exports = {
  login,
  refreshToken,
  logout,
};