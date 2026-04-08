const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// public
router.post("/login", adminController.login);
router.post("/refresh", adminController.refreshToken);
router.post("/logout", adminController.logout);

// protected
router.get(
  "/me",
  authMiddleware,
  authorizeRoles("admin"),
  (req, res) => {
     res.set("Cache-Control", "no-store");
    res.json({ user: req.user });
  }
);

module.exports = router;