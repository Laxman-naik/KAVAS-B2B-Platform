const express = require("express");
const router = express.Router();

const {
  getAllPayouts,
  approvePayout,
  rejectPayout,
  markPayoutPaid,
} = require("../controllers/adminPayoutController");

const isAuthenticated = require("../middleware/authMiddleware");

router.get("/", isAuthenticated, getAllPayouts);
router.put("/:id/approve", isAuthenticated, approvePayout);
router.put("/:id/reject", isAuthenticated, rejectPayout);
router.put("/:id/paid", isAuthenticated, markPayoutPaid);

module.exports = router;