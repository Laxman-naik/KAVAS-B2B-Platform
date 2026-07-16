const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getVendorPaymentHistory,
} = require("../controllers/vendorPaymentHistoryController");

router.get("/history", authMiddleware, getVendorPaymentHistory);

module.exports = router;