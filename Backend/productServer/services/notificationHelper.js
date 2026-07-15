/**
 * notificationHelper.js  (productServer)
 *
 * Non-blocking helper to INSERT a row into the shared `notifications` table.
 * Used by order, payment, and product flows to create real-time notifications.
 */
const pool = require("../config/db");

/**
 * Insert a notification record.
 * Never throws — errors are swallowed so they never break the calling flow.
 *
 * @param {{
 *   userId:  string,
 *   title:   string,
 *   message: string,
 *   type:    string,   // e.g. "Orders" | "Shipping" | "Offers" | ...
 *   role?:   string    // "buyer" | "vendor" | "admin" — defaults to "buyer"
 * }} opts
 */
const createNotification = async ({ userId, title, message, type, role = "buyer" }) => {
  try {
    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type, role)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, title, message, type, role]
    );
  } catch (err) {
    console.error("[notificationHelper] Insert failed:", err.message);
  }
};

module.exports = { createNotification };
