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
// (In production, protect this with an admin/service-key middleware)
router.post("/",                 authMiddleware, createNotification);

module.exports = router;
