const express = require("express");
const router = express.Router();

const { createOrderFromCart, getUserOrders, getVendorOrders, getOrderDetails, updateOrderStatus, createOrder, clearCartAfterOrder, getOrderById, getOrderTracking, getInvoice, } = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

/* ================= ORDER FLOW ================= */

router.post("/from-cart", authMiddleware, createOrderFromCart);
router.post("/", authMiddleware, createOrder);

router.get("/vendor", authMiddleware, getVendorOrders);
router.get("/", authMiddleware, getUserOrders);

router.get("/by-id/:orderId", authMiddleware, getOrderById);

router.get("/:orderId/tracking", authMiddleware, getOrderTracking);

router.get("/:orderId/invoice", authMiddleware, getInvoice);

router.get("/:id", authMiddleware, getOrderDetails);

router.put("/:id/status", authMiddleware, updateOrderStatus);
module.exports = router; 