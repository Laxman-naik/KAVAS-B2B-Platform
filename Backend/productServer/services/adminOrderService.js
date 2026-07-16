const pool = require("../config/db");

exports.getAllOrders = async () => {
  const result = await pool.query(`
    SELECT
      o.*,
      u.full_name AS buyer_name
    FROM orders o
    LEFT JOIN users u
      ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `);

  return result.rows;
};