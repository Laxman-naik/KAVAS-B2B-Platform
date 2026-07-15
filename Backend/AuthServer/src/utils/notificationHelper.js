/**
 * notificationHelper.js
 *
 * Thin helper to INSERT a row into the `notifications` table.
 * Used internally by auth flows (register, google login, password reset, etc.)
 * to keep notification creation DRY across controllers.
 */
const pool = require("../config/db");

/**
 * Create a notification record.
 * @param {{ userId: string, title: string, message: string, type: string, role?: string }} opts
 */
const createNotification = async ({ userId, title, message, type, role = "buyer" }) => {
  try {
    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type, role)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, title, message, type, role]
    );
  } catch (err) {
    // Non-blocking — never crash the calling flow
    console.error("createNotification error:", err.message);
  }
};

module.exports = { createNotification };
