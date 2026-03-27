// const express = require("express");
// const router = express.Router();
// const { register, login, refreshTokenHandler, logout } = require("../controllers/authController");

// router.post("/register", register);
// router.post("/login", login);
// router.post("/refresh", refreshTokenHandler);

// module.exports = router;

const express = require("express");
const router = express.Router();

const {register, login, refreshTokenHandler, logout, getMe,} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// ================== AUTH ROUTES ==================

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshTokenHandler);
router.post("/logout", logout);

// ================== USER ROUTE ==================

router.get("/me", authMiddleware, getMe);

module.exports = router;