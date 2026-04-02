const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const {register, login, refreshTokenHandler, logout, getMe,} = require("../controllers/authController");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  message: "Too many login attempts, try later"
});

// const authMiddleware = require("../middleware/authMiddleware");

// ================== AUTH ROUTES ==================

router.post("/register", register);
router.post("/login",loginLimiter, login);
router.post("/refresh", refreshTokenHandler);
router.post("/logout", logout);

// ================== USER ROUTE ==================

router.get("/me", getMe);

module.exports = router;