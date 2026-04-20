const express = require("express");
const router = express.Router();

const { createCheckout, verifyPayment, handleWebhook,} = require("../controllers/paymentController");

const isAuthenticated = require("../middleware/authMiddleware");

router.post("/checkout", isAuthenticated, createCheckout);
router.post("/verify", isAuthenticated, verifyPayment);
router.post("/webhook", handleWebhook);

module.exports = router;