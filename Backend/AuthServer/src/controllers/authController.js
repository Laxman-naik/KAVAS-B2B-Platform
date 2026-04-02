// const pool = require("../config/db");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const { generateAccessToken, generateRefreshToken } = require("../utils/token");
// const { redis } = require("../config/redis");

// // ================== REGISTER ==================

// exports.register = async (req, res) => {
//   try {
//     const { full_name, email, password, phone,  role } = req.body;

//     const allowedRoles = ["buyer", "vendor"];
//     const userRole = allowedRoles.includes(role) ? role : "buyer";

//     const hashed = await bcrypt.hash(password, 10);

//     const result = await pool.query(
//       `INSERT INTO users (full_name, email, password_hash, phone, role)
//        VALUES ($1, $2, $3, $4, $5)
//        RETURNING id, full_name, email, phone, role`,
//       [full_name, email, hashed, phone, userRole]
//     );

//     res.json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // ================== LOGIN ==================

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "Email and password required" });
//     }

//     const result = await pool.query(
//       "SELECT * FROM users WHERE email=$1",
//       [email]
//     );

//     if (result.rows.length === 0) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     const user = result.rows[0];

//     const match = await bcrypt.compare(password, user.password_hash);
//     if (!match) {
//       return res.status(400).json({ message: "Wrong password" });
//     }

//     const accessToken = generateAccessToken(user);
//     const refreshToken = generateRefreshToken(user);

//     // ✅ MULTI-DEVICE SUPPORT (better)
//     const key = `refresh:${user.id}:${Date.now()}`;
//     await redis.set(key, refreshToken, "EX", 7 * 24 * 60 * 60);

//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       path: "/api/auth",  
//       secure: false, 
//       sameSite: "lax",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     res.json({
//       user: {
//         id: user.id,
//         full_name: user.full_name,
//         email: user.email,
//         role: user.role,
//       },
//       accessToken,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // ================== REFRESH TOKEN ==================

// exports.refreshTokenHandler = async (req, res) => {
//   try {
//     const oldToken = req.cookies.refreshToken;

//     if (!oldToken) return res.status(401).json({ message: "No token" });

//     const decoded = jwt.verify(oldToken, process.env.REFRESH_SECRET);

//     const keys = await redis.keys(`refresh:${decoded.id}:*`);

//     let foundKey = null;

//     for (const key of keys) {
//       const data = await redis.get(key);
//       if (data) {
//         const parsed = JSON.parse(data);
//         if (parsed.token === oldToken) {
//           foundKey = key;
//           break;
//         }
//       }
//     }

//     if (!foundKey) {
//       return res.status(403).json({ message: "Invalid session" });
//     }

//     // 🔥 DELETE OLD TOKEN
//     await redis.del(foundKey);

//     // 🔥 CREATE NEW TOKEN
//     const newRefreshToken = generateRefreshToken({ id: decoded.id });
//     const newAccessToken = generateAccessToken({ id: decoded.id });

//     const newKey = `refresh:${decoded.id}:${Date.now()}`;

//     await redis.set(
//       newKey,
//       JSON.stringify({
//         token: newRefreshToken,
//         device: req.headers["user-agent"],
//         ip: req.ip,
//         createdAt: Date.now(),
//       }),
//       "EX",
//       7 * 24 * 60 * 60
//     );

//     // 🔥 SET NEW COOKIE
//     res.cookie("refreshToken", newRefreshToken, {
//       httpOnly: true,
//       path: "/",
//       sameSite: "lax",
//       secure: false,
//     });

//     res.json({ accessToken: newAccessToken });

//   } catch {
//     res.status(403).json({ message: "Invalid token" });
//   }
// };

// // ================== LOGOUT ==================

// exports.logout = async (req, res) => {
//   try {
//     const token = req.cookies.refreshToken;

//     if (token) {
//       let decoded;
//       try {
//         decoded = jwt.verify(token, process.env.REFRESH_SECRET);
//       } catch {
//         decoded = null;
//       }

//       if (decoded) {
//         const keys = await redis.keys(`refresh:${decoded.id}:*`);

//         for (const key of keys) {
//           const stored = await redis.get(key);
//           if (stored === token) {
//             await redis.del(key);
//           }
//         }
//       }
//     }

//     res.clearCookie("refreshToken", { path: "/", });
//     res.json({ message: "Logged out successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // ================== GET CURRENT USER ==================
// exports.getMe = async (req, res) => {
//   try {
//     const token = req.cookies.refreshToken;

//     if (!token) {
//       return res.status(401).json({ user: null });
//     }

//     const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

//     // 🔥 CHECK REDIS (same as refresh)
//     const keys = await redis.keys(`refresh:${decoded.id}:*`);

//     let valid = false;

//     for (const key of keys) {
//       const stored = await redis.get(key);
//       if (stored === token) {
//         valid = true;
//         break;
//       }
//     }

//     if (!valid) {
//       return res.status(403).json({ user: null });
//     }

//     const result = await pool.query(
//       "SELECT id, full_name, email, role FROM users WHERE id=$1",
//       [decoded.id]
//     );

//     res.json({ user: result.rows[0] });

//   } catch (err) {
//     res.status(401).json({ user: null });
//   }
// };

// // ================== LOGOUT ALL DEVICES ==================

// exports.logoutAll = async (req, res) => {
//   try {
//     const token = req.cookies.refreshToken;

//     if (!token) return res.json({ message: "No session" });

//     const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

//     // 🔥 delete ALL sessions
//     const keys = await redis.keys(`refresh:${decoded.id}:*`);

//     for (const key of keys) {
//       await redis.del(key);
//     }

//     // clear cookie
//     res.clearCookie("refreshToken", {
//       path: "/",
//     });

//     res.json({ message: "Logged out from all devices" });
//   } catch {
//     res.status(500).json({ message: "Error logging out" });
//   }
// };

// // ================== GET SESSIONS ==================

// exports.getSessions = async (req, res) => {
//   try {
//     const token = req.cookies.refreshToken;
//     const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

//     const keys = await redis.keys(`refresh:${decoded.id}:*`);

//     const sessions = [];

//     for (const key of keys) {
//       const data = await redis.get(key);
//       if (data) {
//         sessions.push(JSON.parse(data));
//       }
//     }

//     res.json({ sessions });
//   } catch {
//     res.status(401).json({ message: "Unauthorized" });
//   }
// };

const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const { redis } = require("../config/redis");

// ================== REGISTER ==================
exports.register = async (req, res) => {
  try {
    const { full_name, email, password, phone, role } = req.body;

    const allowedRoles = ["buyer", "vendor"];
    const userRole = allowedRoles.includes(role) ? role : "buyer";

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, phone, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, full_name, email, phone, role`,
      [full_name, email, hashed, phone, userRole]
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

    // ✅ Store as JSON (FIXED)
    const key = `refresh:${user.id}:${Date.now()}`;

    await redis.set(
      key,
      JSON.stringify({
        token: refreshToken,
        device: req.headers["user-agent"],
        ip: req.ip,
        createdAt: Date.now(),
      }),
      "EX",
      7 * 24 * 60 * 60
    );

    // ✅ Consistent cookie config
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/",
      secure: false,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
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
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ================== REFRESH TOKEN ==================
exports.refreshTokenHandler = async (req, res) => {
  try {
    const oldToken = req.cookies.refreshToken;

    if (!oldToken) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(oldToken, process.env.REFRESH_SECRET);

    const keys = await redis.keys(`refresh:${decoded.id}:*`);

    let foundKey = null;

    for (const key of keys) {
      const data = await redis.get(key);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.token === oldToken) {
          foundKey = key;
          break;
        }
      }
    }

    if (!foundKey) {
      return res.status(403).json({ message: "Invalid session" });
    }

    // delete old
    await redis.del(foundKey);

    const newRefreshToken = generateRefreshToken({ id: decoded.id });
    const newAccessToken = generateAccessToken({ id: decoded.id });

    const newKey = `refresh:${decoded.id}:${Date.now()}`;

    await redis.set(
      newKey,
      JSON.stringify({
        token: newRefreshToken,
        device: req.headers["user-agent"],
        ip: req.ip,
        createdAt: Date.now(),
      }),
      "EX",
      7 * 24 * 60 * 60
    );

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      path: "/", // ✅ FIXED
      sameSite: "lax",
      secure: false,
    });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("REFRESH ERROR:", err);
    res.status(403).json({ message: "Invalid token" });
  }
};

// ================== GET CURRENT USER ==================
exports.getMe = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ user: null });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

    const keys = await redis.keys(`refresh:${decoded.id}:*`);

    let valid = false;

    for (const key of keys) {
      const stored = await redis.get(key);
      if (stored) {
        const parsed = JSON.parse(stored); // ✅ FIXED
        if (parsed.token === token) {
          valid = true;
          break;
        }
      }
    }

    if (!valid) {
      return res.status(403).json({ user: null });
    }

    const result = await pool.query(
      "SELECT id, full_name, email, role FROM users WHERE id=$1",
      [decoded.id]
    );

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("GET ME ERROR:", err);
    res.status(401).json({ user: null });
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
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.token === token) {
              await redis.del(key);
            }
          }
        }
      }
    }

    res.clearCookie("refreshToken", { path: "/" }); // ✅ FIXED
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("LOGOUT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ================== LOGOUT ALL ==================
exports.logoutAll = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) return res.json({ message: "No session" });

    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

    const keys = await redis.keys(`refresh:${decoded.id}:*`);

    for (const key of keys) {
      await redis.del(key);
    }

    res.clearCookie("refreshToken", { path: "/" });

    res.json({ message: "Logged out from all devices" });
  } catch (err) {
    console.error("LOGOUT ALL ERROR:", err);
    res.status(500).json({ message: "Error logging out" });
  }
};