const express = require("express");
const router = express.Router();
const { registerVendor, sendOtp, verifyOtp} = require("../controllers/vendorController");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/register", registerVendor);

module.exports = router;