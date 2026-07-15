const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  getNotifications,
  getUnreadCount,
  getNotificationById,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  broadcastFlashDeal,
} = require("../controllers/notificationController");

// ── Public-facing (buyer) routes — all require auth ──────────
router.get("/",                  authMiddleware, getNotifications);
router.get("/unread-count",      authMiddleware, getUnreadCount);
router.get("/:id",               authMiddleware, getNotificationById);

router.patch("/mark-all-read",   authMiddleware, markAllAsRead);
router.patch("/:id/read",        authMiddleware, markAsRead);

router.delete("/delete-all",     authMiddleware, deleteAllNotifications);
router.delete("/:id",            authMiddleware, deleteNotification);

// ── Internal / admin route — create a notification ───────────
router.post("/",                 authMiddleware, createNotification);

// ── Flash Deals — vendor/admin broadcast to all buyers ───────
router.post("/flash-deal",       authMiddleware, broadcastFlashDeal);

module.exports = router;

