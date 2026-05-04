const express = require("express");
const router = express.Router();

const { createOrderFromCart, getUserOrders, getOrderDetails, updateOrderStatus, createOrder, clearCartAfterOrder, } = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

/* ================= ORDER FLOW ================= */

router.post("/from-cart", authMiddleware, createOrderFromCart);
router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, authorizeRoles("admin"), getUserOrders);
router.get("/:id", authMiddleware, getOrderDetails);
router.put("/:id/status", authMiddleware, updateOrderStatus);
router.delete("/clear", clearCartAfterOrder )

module.exports = router;