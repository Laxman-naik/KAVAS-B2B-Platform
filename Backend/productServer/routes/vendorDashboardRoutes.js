const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  getVendorDashboard,
} = require("../controllers/vendorDashboardController");

router.get("/dashboard", authMiddleware, getVendorDashboard);

module.exports = router;