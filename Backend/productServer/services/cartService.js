const pool = require("../config/db");

const getCart = async (userId) => {
  // 1. Get cart
  const cartRes = await pool.query(
    `SELECT id FROM carts WHERE user_id = $1`,
    [userId]
  );

  if (!cartRes.rows.length) {
    return { items: [] };
  }

  const cartId = cartRes.rows[0].id;

  // 2. Get items
  const itemsRes = await pool.query(
    `SELECT 
        ci.id,
        ci.product_id,
        ci.quantity,
        p.price,
        p.name
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.cart_id = $1`,
    [cartId]
  );

  return {
    cartId,
    items: itemsRes.rows,
  };
};

module.exports = getCart;
