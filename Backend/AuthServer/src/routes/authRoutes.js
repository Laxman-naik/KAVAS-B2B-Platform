const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const passport = require("passport");

const {
  register,
  login,
  refreshTokenHandler,
  logout,
  getMe,
  changePassword,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

/* ================== RATE LIMIT LOGIN ONLY ================== */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    message: "Too many login attempts, try later",
  },
});

/* ================== AUTH ROUTES ================== */
router.post("/register", register);
router.post("/login", loginLimiter, login);
router.post("/refresh", refreshTokenHandler);
router.post("/logout", logout);
router.get("/me", authMiddleware, getMe);

router.patch(
  "/change-password",
  authMiddleware,
  changePassword
);

module.exports = router;





