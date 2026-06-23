const express = require("express");
const router = express.Router();

<<<<<<< HEAD
const { createOrderFromCart, getUserOrders, getOrderDetails, updateOrderStatus, createOrder, clearCartAfterOrder, getOrderById, getVendorOrders } = require("../controllers/orderController");
=======
const { createOrderFromCart, getUserOrders, getVendorOrders, getOrderDetails, updateOrderStatus, createOrder, clearCartAfterOrder, getOrderById,  } = require("../controllers/orderController");
>>>>>>> 0bebc03d9cebbf0f37c1c48414617a75ebcc7687
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