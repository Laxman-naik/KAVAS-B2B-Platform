const express = require("express");
const router = express.Router();

const { createOrderFromCart, getUserOrders, getVendorOrders, getOrderDetails, updateOrderStatus, createOrder, clearCartAfterOrder, getOrderById,  } = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

/* ================= ORDER FLOW ================= */

router.post("/from-cart", authMiddleware, createOrderFromCart);
router.post("/", authMiddleware, createOrder);

router.get("/vendor", authMiddleware, getVendorOrders);
router.get("/", authMiddleware, getUserOrders);
router.get("/vendor", authMiddleware, getVendorOrders);
router.get("/by-id/:orderId", authMiddleware, getOrderById);
router.get("/:id", authMiddleware, getOrderDetails);

router.put("/:id/status", authMiddleware, updateOrderStatus);
module.exports = router; 