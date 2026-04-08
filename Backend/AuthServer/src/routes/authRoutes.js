// const express = require("express");
// const router = express.Router();
// const rateLimit = require("express-rate-limit");

// const authMiddleware = require("../middleware/authMiddleware");

// const {register, login, refreshTokenHandler, logout, getMe,} = require("../controllers/authController");

// const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 10000,
//   message: "Too many login attempts, try later"
// });

// // AUTH ROUTES 

// router.post("/register", register);
// router.post("/login",loginLimiter, login);
// router.post("/refresh", refreshTokenHandler);
// router.post("/logout", logout);

// // USER ROUTE 

// router.get("/me", authMiddleware , getMe);

// module.exports = router;

const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const {
  register,
  login,
  refreshTokenHandler,
  logout,
  getMe,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

/* ================== RATE LIMIT (LOGIN ONLY) ================== */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 100 is too high for login protection
  message: {
    message: "Too many login attempts, try later",
  },
});

/* ================== AUTH ROUTES ================== */

// register
router.post("/register", register);

// login (rate limited)
router.post("/login", loginLimiter, login);

// refresh token (cookie based)
router.post("/refresh", refreshTokenHandler);

// logout
router.post("/logout", logout);

// get current user (MUST be cookie based OR access token based consistently)
router.get("/me", getMe); 
// ⚠️ removed authMiddleware intentionally (explained below)

module.exports = router;