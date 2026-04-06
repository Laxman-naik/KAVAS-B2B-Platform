// const express = require("express");
// const authMiddleware = require("../middleware/authMiddleware");
// const authorizeRoles = require("../middleware/roleMiddleware");
// const { adminLogin, adminLogout, getAdminDashboard, getAllUsers, getUserById, updateUserRole, deleteUser, searchUsers } = require("../controllers/adminController");

// const router = express.Router();

// // AUTH ROUTES
// router.post("/login", adminLogin);
// router.post("/logout", adminLogout);

// // ADMIN ROUTES
// router.get("/dashboard", authMiddleware, authorizeRoles("admin"), getAdminDashboard);
// router.get("/users", authMiddleware, authorizeRoles("admin"), getAllUsers);
// router.get("/users/search", authMiddleware, authorizeRoles("admin"), searchUsers);
// router.get("/users/:id", authMiddleware, authorizeRoles("admin"), getUserById);
// router.put("/users/:id/role", authMiddleware, authorizeRoles("admin"), updateUserRole);
// router.delete("/users/:id", authMiddleware, authorizeRoles("admin"), deleteUser);

// module.exports = router;

const express = require("express");
const router = express.Router();

const {
  adminLogin,
  refreshTokenHandler,
  adminLogout,
  getAdminProfile,
} = require("../controllers/adminController");

const authorizeRoles = require("../middleware/roleMiddleware/authorizeRoles");

// Public
router.post("/login", adminLogin);
router.post("/refresh", refreshTokenHandler);
router.post("/logout", adminLogout);

// 🔥 Protected (admin only)
router.get("/me", authorizeRoles("admin"), getAdminProfile);

module.exports = router;