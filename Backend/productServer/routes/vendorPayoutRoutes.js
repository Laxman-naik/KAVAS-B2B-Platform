const express = require("express");
const router = express.Router();

const {
  requestPayout,
  getMyPayouts,
  getPayoutSummary,
} = require("../controllers/vendorPayoutController");

const isAuthenticated = require("../middleware/authMiddleware");

router.post("/request", isAuthenticated, requestPayout);
router.get("/my-payouts", isAuthenticated, getMyPayouts);
router.get("/summary", isAuthenticated, getPayoutSummary);

module.exports = router;