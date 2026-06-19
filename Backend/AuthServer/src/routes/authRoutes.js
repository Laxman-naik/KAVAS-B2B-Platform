const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const passport = require("../config/passport");
const jwt = require("jsonwebtoken");

const {
  register,
  login,
  refreshTokenHandler,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    message: "Too many login attempts, try later",
  },
});

router.post("/register", register);
router.post("/login", loginLimiter, login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/refresh", refreshTokenHandler);
router.post("/logout", logout);
router.get("/me", authMiddleware, getMe);
router.patch("/change-password", authMiddleware, changePassword);

/* START GOOGLE LOGIN */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

/* GOOGLE CALLBACK */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
  }),
  async (req, res) => {
    const accessToken = jwt.sign(
      {
        id: req.user.id,
        role: req.user.role,
        email: req.user.email,
      },
      process.env.ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    res.redirect(
      `${process.env.FRONTEND_URL}/auth/google-success?token=${accessToken}`
    );
  }
);

module.exports = router;