const express = require("express");
const router = express.Router();

const { createOrderFromCart, getUserOrders, getOrderDetails, updateOrderStatus,} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");
const { validateCreateOrder } = require("../middleware/validateOrder");

router.post("/", authMiddleware, validateCreateOrder, createOrderFromCart);
router.get("/", authMiddleware, getUserOrders);
router.get("/:id", authMiddleware, getOrderDetails);
router.patch("/:id/status", authMiddleware, updateOrderStatus);

module.exports = router;