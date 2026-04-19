const express = require("express");
const router = express.Router();

const {
  createOrderFromCart,
  getUserOrders,
  getOrderDetails,
  updateOrderStatus,
  createOrder,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");

/* ================= ORDER FLOW ================= */

router.post("/from-cart", authMiddleware, createOrderFromCart);
router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getUserOrders);
router.get("/:id", authMiddleware, getOrderDetails);
router.put("/:id/status", authMiddleware, updateOrderStatus);

module.exports = router;