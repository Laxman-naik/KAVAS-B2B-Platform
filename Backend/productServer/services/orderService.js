const pool = require("../config/db");

exports.createOrderFromCartInternal = async (client, userId, paymentId) => {

  const addressRes = await client.query(
    `SELECT id FROM addresses WHERE user_id = $1 LIMIT 1`,
    [userId]
  );

  if (!addressRes.rows.length) {
    throw new Error("No address found");
  }

  const shippingAddressId = addressRes.rows[0].id;

  const cartRes = await client.query(
    `SELECT id FROM carts WHERE user_id = $1`,
    [userId]
  );

  if (!cartRes.rows.length) {
    throw new Error("Cart not found");
  }

  const cartId = cartRes.rows[0].id;

  const itemsRes = await client.query(
    `SELECT ci.*, p.stock, p.organization_id
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.cart_id = $1
     FOR UPDATE`,
    [cartId]
  );

  if (!itemsRes.rows.length) {
    throw new Error("Cart is empty");
  }

  const items = itemsRes.rows;

  for (const item of items) {
    if (item.stock < item.quantity) {
      throw new Error(`Insufficient stock for product ${item.product_id}`);
    }
  }

  const grouped = {};
  for (const item of items) {
    if (!grouped[item.organization_id]) {
      grouped[item.organization_id] = [];
    }
    grouped[item.organization_id].push(item);
  }

  const createdOrders = [];

  for (const supplierOrgId in grouped) {
    const supplierItems = grouped[supplierOrgId];

    const totalAmount = supplierItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const orderRes = await client.query(
      `INSERT INTO orders 
      (user_id, supplier_org_id, total_amount, status, shipping_address_id, payment_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        userId,
        supplierOrgId,
        totalAmount,
        "pending",
        shippingAddressId,
        paymentId,
      ]
    );

    const order = orderRes.rows[0];

    for (const item of supplierItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.product_id, item.quantity, item.price]
      );

      await client.query(
        `UPDATE products SET stock = stock - $1 WHERE id = $2`,
        [item.quantity, item.product_id]
      );
    }

    // history
    await client.query(
      `INSERT INTO order_status_history (order_id, status)
       VALUES ($1, $2)`,
      [order.id, "pending"]
    );

    createdOrders.push(order);
  }

  await client.query(
    `DELETE FROM cart_items WHERE cart_id = $1`,
    [cartId]
  );

  return createdOrders;
};