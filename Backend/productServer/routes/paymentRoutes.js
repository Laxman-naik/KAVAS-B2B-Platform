const express = require("express");
const router = express.Router();

const { createCheckout, verifyPayment, handleWebhook, } = require("../controllers/paymentController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/checkout", authMiddleware, createCheckout);
router.post("/verify", verifyPayment);
router.post("/webhook", handleWebhook);

module.exports = router;