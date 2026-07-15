const pool = require("../config/db");

/* ─── helpers ───────────────────────────────────────────────── */
const assertBuyer = (req, res) => {
  if (!req.user?.id) {
    res.status(401).json({ message: "Unauthorized" });
    return false;
  }
  return true;
};

/* ─── GET /api/notifications ──────────────────────────────────
   Query params:
     page    (default 1)
     limit   (default 20)
     type    (filter by type)
     is_read (filter "true" | "false")
*/
exports.getNotifications = async (req, res) => {
  if (!assertBuyer(req, res)) return;

  try {
    const userId = req.user.id;
    const role   = req.user.role || "buyer";
    const page   = Math.max(1, parseInt(req.query.page)  || 1);
    const limit  = Math.min(50, parseInt(req.query.limit) || 20);
    const offset = (page - 1) * limit;

    const conditions = ["user_id = $1", "role = $2"];
    const params     = [userId, role];
    let   idx        = 3;

    if (req.query.type) {
      conditions.push(`type = $${idx++}`);
      params.push(req.query.type);
    }
    if (req.query.is_read !== undefined) {
      conditions.push(`is_read = $${idx++}`);
      params.push(req.query.is_read === "true");
    }

    const where = conditions.join(" AND ");

    const [rows, countRow] = await Promise.all([
      pool.query(
        `SELECT id, user_id, title, message, type, is_read, created_at, role
         FROM notifications
         WHERE ${where}
         ORDER BY created_at DESC
         LIMIT $${idx} OFFSET $${idx + 1}`,
        [...params, limit, offset]
      ),
      pool.query(
        `SELECT COUNT(*) FROM notifications WHERE ${where}`,
        params
      ),
    ]);

    const total = parseInt(countRow.rows[0].count, 10);

    return res.json({
      notifications: rows.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("GET NOTIFICATIONS ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

/* ─── GET /api/notifications/unread-count ───────────────────── */
exports.getUnreadCount = async (req, res) => {
  if (!assertBuyer(req, res)) return;
  try {
    const { rows } = await pool.query(
      `SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND role = $2 AND is_read = false`,
      [req.user.id, req.user.role || "buyer"]
    );
    return res.json({ unreadCount: parseInt(rows[0].count, 10) });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* ─── PATCH /api/notifications/:id/read ────────────────────── */
exports.markAsRead = async (req, res) => {
  if (!assertBuyer(req, res)) return;
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `UPDATE notifications
       SET is_read = true
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: "Notification not found" });
    return res.json({ notification: rows[0] });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* ─── PATCH /api/notifications/read-all ───────────────────── */
exports.markAllRead = async (req, res) => {
  if (!assertBuyer(req, res)) return;
  try {
    const role = req.user.role || "buyer";
    const { rowCount } = await pool.query(
      `UPDATE notifications
       SET is_read = true
       WHERE user_id = $1 AND role = $2 AND is_read = false`,
      [req.user.id, role]
    );
    return res.json({ updated: rowCount });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* ─── DELETE /api/notifications/:id ────────────────────────── */
exports.deleteNotification = async (req, res) => {
  if (!assertBuyer(req, res)) return;
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query(
      `DELETE FROM notifications WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );
    if (!rowCount) return res.status(404).json({ message: "Notification not found" });
    return res.json({ message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* ─── DELETE /api/notifications (delete all for user+role) ─── */
exports.deleteAll = async (req, res) => {
  if (!assertBuyer(req, res)) return;
  try {
    const role = req.user.role || "buyer";
    const { rowCount } = await pool.query(
      `DELETE FROM notifications WHERE user_id = $1 AND role = $2`,
      [req.user.id, role]
    );
    return res.json({ deleted: rowCount });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* ─── POST /api/notifications (internal / admin use) ───────── */
exports.createNotification = async (req, res) => {
  try {
    const { user_id, title, message, type, role } = req.body;
    if (!user_id || !title || !message || !type || !role) {
      return res.status(400).json({ message: "user_id, title, message, type, role are required" });
    }
    const { rows } = await pool.query(
      `INSERT INTO notifications (user_id, title, message, type, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user_id, title, message, type, role]
    );
    return res.status(201).json({ notification: rows[0] });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
