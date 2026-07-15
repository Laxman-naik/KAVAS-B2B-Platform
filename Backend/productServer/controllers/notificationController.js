const pool = require("../config/db");

// ─────────────────────────────────────────────────────────────
//  GET /api/notifications
//  Returns all notifications for the logged-in user.
//  Query params:
//    ?type=Orders|Payments|Shipping|Messages|Offers|System
//    ?is_read=true|false
//    ?sort=latest|oldest  (default: latest)
//    ?page=1              (default: 1)
//    ?limit=10            (default: 10)
// ─────────────────────────────────────────────────────────────
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role || "buyer"; // "buyer" | "vendor" | "admin"
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const {
      type,
      is_read,
      sort = "latest",
      page = 1,
      limit = 10,
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const conditions = ["user_id = $1", "role = $2"];
    const values = [userId, userRole];
    let idx = 3;

    if (type) {
      conditions.push(`type = $${idx++}`);
      values.push(type);
    }

    if (is_read !== undefined) {
      conditions.push(`is_read = $${idx++}`);
      values.push(is_read === "true");
    }

    const orderDir = sort === "oldest" ? "ASC" : "DESC";
    const where = conditions.join(" AND ");

    // Total count for pagination
    const countRes = await pool.query(
      `SELECT COUNT(*) FROM notifications WHERE ${where}`,
      values
    );
    const total = parseInt(countRes.rows[0].count);

    // Paginated rows
    const dataRes = await pool.query(
      `SELECT * FROM notifications
       WHERE ${where}
       ORDER BY created_at ${orderDir}
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...values, parseInt(limit), offset]
    );

    return res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
      notifications: dataRes.rows,
    });
  } catch (err) {
    console.error("getNotifications error:", err.message);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
//  GET /api/notifications/unread-count
//  Returns count of unread notifications for the user.
// ─────────────────────────────────────────────────────────────
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role || "buyer";
    const result = await pool.query(
      `SELECT COUNT(*) FROM notifications
       WHERE user_id = $1 AND role = $2 AND is_read = false`,
      [userId, userRole]
    );
    return res.status(200).json({
      success: true,
      unreadCount: parseInt(result.rows[0].count),
    });
  } catch (err) {
    console.error("getUnreadCount error:", err.message);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
//  GET /api/notifications/:id
//  Returns a single notification by ID (must belong to user).
// ─────────────────────────────────────────────────────────────
exports.getNotificationById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM notifications
       WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.status(200).json({ success: true, notification: result.rows[0] });
  } catch (err) {
    console.error("getNotificationById error:", err.message);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
//  POST /api/notifications
//  Create a new notification (internal / admin use).
//  Body: { user_id, type, title, message }
// ─────────────────────────────────────────────────────────────
exports.createNotification = async (req, res) => {
  try {
    const { user_id, role, type, title, message } = req.body;

    if (!user_id || !type || !title || !message) {
      return res.status(400).json({
        message: "user_id, type, title, and message are required",
      });
    }

    const VALID_ROLES = ["buyer", "vendor", "admin"];
    const notifRole = role && VALID_ROLES.includes(role) ? role : "buyer";

    const VALID_TYPES_BY_ROLE = {
      buyer:  ["Orders", "Payments", "Shipping", "Messages", "Offers", "System"],
      vendor: ["New Order", "Payment Received", "RFQ Request", "Buyer Review", "Inventory Alert", "System"],
      admin:  ["New User", "Vendor Approval", "Order Issue", "Payment", "Compliance", "System"],
    };
    const validTypes = VALID_TYPES_BY_ROLE[notifRole];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        message: `For role "${notifRole}", type must be one of: ${validTypes.join(", ")}`,
      });
    }

    const result = await pool.query(
      `INSERT INTO notifications (user_id, role, type, title, message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user_id, notifRole, type, title, message]
    );

    return res.status(201).json({ success: true, notification: result.rows[0] });
  } catch (err) {
    console.error("createNotification error:", err.message);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
//  PATCH /api/notifications/:id/read
//  Mark a single notification as read.
// ─────────────────────────────────────────────────────────────
exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE notifications
       SET is_read = true
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.status(200).json({ success: true, notification: result.rows[0] });
  } catch (err) {
    console.error("markAsRead error:", err.message);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
//  PATCH /api/notifications/mark-all-read
//  Mark ALL unread notifications for the user as read.
// ─────────────────────────────────────────────────────────────
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `UPDATE notifications
       SET is_read = true
       WHERE user_id = $1 AND is_read = false
       RETURNING id`,
      [userId]
    );

    return res.status(200).json({
      success: true,
      updatedCount: result.rowCount,
      message: `${result.rowCount} notification(s) marked as read`,
    });
  } catch (err) {
    console.error("markAllAsRead error:", err.message);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
//  DELETE /api/notifications/:id
//  Hard-delete a single notification.
// ─────────────────────────────────────────────────────────────
exports.deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM notifications
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [id, userId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted",
      id: result.rows[0].id,
    });
  } catch (err) {
    console.error("deleteNotification error:", err.message);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
//  DELETE /api/notifications/delete-all
//  Hard-delete ALL notifications for the user.
// ─────────────────────────────────────────────────────────────
exports.deleteAllNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `DELETE FROM notifications
       WHERE user_id = $1
       RETURNING id`,
      [userId]
    );

    return res.status(200).json({
      success: true,
      deletedCount: result.rowCount,
      message: `${result.rowCount} notification(s) deleted`,
    });
  } catch (err) {
    console.error("deleteAllNotifications error:", err.message);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
