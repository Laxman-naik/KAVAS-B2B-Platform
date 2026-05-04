const express = require("express");
const router = express.Router();

const { 
  registerVendor, 
  sendOtp, 
  verifyOtp, 
  loginVendor,
  refreshAccessToken,
  logoutVendor,
  getVendorProfile,  
  upsertBusinessDetails, 
  getBusinessDetails, 
  upsertBankDetails, 
  getBankDetails, 
  getOnboardingState,
  updateOnboardingStep,
} = require("../controllers/vendorController");

const authMiddleware = require("../middleware/vendorMiddleware");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/register", registerVendor);
router.post("/login", loginVendor);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutVendor);

router.post("/business", authMiddleware, upsertBusinessDetails);
router.get("/getbusiness", authMiddleware, getBusinessDetails);
router.post("/bank", authMiddleware, upsertBankDetails);
router.get("/getbank", authMiddleware, getBankDetails);
router.get("/state", authMiddleware, getOnboardingState);
router.patch("/step", authMiddleware, updateOnboardingStep);

router.get("/:id", getVendorProfile);

module.exports = router;