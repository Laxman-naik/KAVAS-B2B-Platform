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
  upsertStoreAndPickup,
  getOnboardingState,
  updateOnboardingStep,
  getMe,
  getStoreAndPickup,
  changeVendorPassword,
} = require("../controllers/vendorController");

const authMiddleware = require("../middleware/vendorMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/register", registerVendor);
router.post("/login", loginVendor);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutVendor);
router.get("/me", authMiddleware, getMe);

router.post("/business", authMiddleware, upsertBusinessDetails);
router.get("/getbusiness", authMiddleware, getBusinessDetails);
router.post("/bank", authMiddleware, upsertBankDetails);
router.get("/getbank", authMiddleware, getBankDetails);
// router.post("/store-details", authMiddleware, upsertStoreAndPickup);
router.post("/store-details",authMiddleware,upload.fields([{name: "store_image",maxCount: 1,},{name: "store_logo",maxCount: 1,},]),upsertStoreAndPickup );
router.get("/getstore", authMiddleware, getStoreAndPickup)
router.get("/state", authMiddleware, getOnboardingState);
router.patch("/step", authMiddleware, updateOnboardingStep);
router.patch("/change-password", authMiddleware, changeVendorPassword);

router.get("/:id", getVendorProfile);

module.exports = router;