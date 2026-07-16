const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getAdminDashboard,
} = require("../controllers/adminDashboardController");

router.get("/", authMiddleware, getAdminDashboard);

module.exports = router;