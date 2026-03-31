const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const { adminLogin, adminLogout, getAdminDashboard, getAllUsers, getUserById, updateUserRole, deleteUser, searchUsers } = require("../controllers/adminController");

const router = express.Router();

// AUTH ROUTES
router.post("/auth/login", adminLogin);
router.post("/auth/logout", adminLogout);

// ADMIN ROUTES
router.get("/dashboard", authMiddleware, authorizeRoles("admin"), getAdminDashboard);
router.get("/users", authMiddleware, authorizeRoles("admin"), getAllUsers);
router.get("/users/search", authMiddleware, authorizeRoles("admin"), searchUsers);
router.get("/users/:id", authMiddleware, authorizeRoles("admin"), getUserById);
router.put("/users/:id/role", authMiddleware, authorizeRoles("admin"), updateUserRole);
router.delete("/users/:id", authMiddleware, authorizeRoles("admin"), deleteUser);

module.exports = router;