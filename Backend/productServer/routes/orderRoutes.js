const express = require("express");
const router = express.Router();

const { createOrderFromCart, getUserOrders, getOrderDetails, updateOrderStatus, createOrder, clearCartAfterOrder, getOrderById } = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

/* ================= ORDER FLOW ================= */

router.post("/from-cart", authMiddleware, createOrderFromCart);
router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getUserOrders);
router.get("/:id", authMiddleware, getOrderDetails);
router.put("/:id/status", updateOrderStatus);
router.delete("/clear", clearCartAfterOrder )
router.get("/by-id/:orderId", getOrderById);

module.exports = router;