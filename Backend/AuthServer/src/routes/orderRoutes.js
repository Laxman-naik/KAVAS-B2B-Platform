const express = require("express");
const {
  getOrderStats,
  getRecentOrders,
} = require("../controllers/orderController");

const router = express.Router();

router.get("/stats", getOrderStats);
router.get("/recent", getRecentOrders);

module.exports = router;