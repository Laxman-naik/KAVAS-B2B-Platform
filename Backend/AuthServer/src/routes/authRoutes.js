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
router.post("/register", register);
router.post("/login", loginLimiter, login);
router.post("/refresh", refreshTokenHandler);
router.post("/logout", logout);
router.get("/me", getMe); 

module.exports = router;


// const express = require("express");

// const router = express.Router();

// const passport = require("passport");

// const jwt = require("jsonwebtoken");

// const authMiddleware =
//   require("../middleware/authMiddleware");

// const {
//   getMe,
// } = require("../controllers/authController");

// router.get(
//   "/google",

//   passport.authenticate(
//     "google",
//     {
//       scope: [
//         "profile",
//         "email",
//       ],
//     }
//   )
// );

// router.get(
//   "/google/callback",

//   passport.authenticate(
//     "google",
//     {
//       session: false,

//       failureRedirect:
//         "http://localhost:3000/login",
//     }
//   ),

//   async (req, res) => {
//     try {

//       const token = jwt.sign(
//         {
//           id: req.user.id,

//           email:
//             req.user.email,
//         },

//         process.env.ACCESS_SECRET,

//         {
//           expiresIn: "7d",
//         }
//       );

//       res.redirect(
//         `${process.env.CLIENT_URL}/google-success?token=${token}`
//       );

//     } catch (error) {

//       res.redirect(
//         "http://localhost:3000/login"
//       );
//     }
//   }
// );

// router.get(
//   "/me",
//   authMiddleware,
//   getMe
// );

// module.exports = router;