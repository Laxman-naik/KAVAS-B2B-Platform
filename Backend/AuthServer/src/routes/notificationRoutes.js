const express = require("express");
const router  = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllRead,
  deleteNotification,
  deleteAll,
  createNotification,
} = require("../controllers/notificationController");

/* All notification routes require a valid JWT */
router.use(authMiddleware);

/* ── Read ─────────────────────────── */
router.get("/",             getNotifications); // GET  /api/notifications?page=&limit=&type=&is_read=
router.get("/unread-count", getUnreadCount);   // GET  /api/notifications/unread-count

/* ── Update ──────────────────────── */
router.patch("/read-all",    markAllRead);     // PATCH /api/notifications/read-all
router.patch("/:id/read",    markAsRead);      // PATCH /api/notifications/:id/read

/* ── Delete ──────────────────────── */
router.delete("/",     deleteAll);             // DELETE /api/notifications  (clear all)
router.delete("/:id",  deleteNotification);    // DELETE /api/notifications/:id

/* ── Create (internal/system use) ── */
router.post("/", createNotification);          // POST  /api/notifications

module.exports = router;
