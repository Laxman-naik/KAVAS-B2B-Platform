const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post("/login", adminController.login);
router.post("/refresh", adminController.refreshTokenHandler);
router.post("/logout", adminController.logout);

router.get("/me",authMiddleware,authorizeRoles("admin"),adminController.getMe);

router.get( "/users", authMiddleware, authorizeRoles("admin"), adminController.getAllUsers);

router.get("/onboarding-vendors", authMiddleware, authorizeRoles("admin"), adminController.getAllOnboardingVendors);

router.put("/approve-vendor", authMiddleware, ("admin"), adminController.approveVendor);

router.put("/reject-vendor", authMiddleware, authorizeRoles("admin"), adminController.rejectVendor);

module.exports = router;