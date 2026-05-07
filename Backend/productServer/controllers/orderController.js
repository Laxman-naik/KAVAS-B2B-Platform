const pool = require("../config/db");

exports.createOrderFromCart = async (req, res) => {
  const client = await pool.connect();

  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const { idempotency_key } = req.body;

    if (!idempotency_key) {
      return res.status(400).json({ message: "Idempotency key required" });
    }

    await client.query("BEGIN");

    const addressRes = await client.query(
      `SELECT id FROM addresses WHERE user_id = $1 LIMIT 1`,
      [userId]
    );

    if (!addressRes.rows.length) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message: "No address found. Please update profile with address.",
      });
    }

    const shippingAddressId = addressRes.rows[0].id;

    const existingOrder = await client.query(
      `SELECT * FROM orders WHERE idempotency_key = $1`,
      [idempotency_key]
    );

    if (existingOrder.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(200).json({
        message: "Duplicate request",
        orders: existingOrder.rows,
      });
    }

    const cartRes = await client.query(
      `SELECT id FROM carts WHERE user_id = $1`,
      [userId]
    );

    if (!cartRes.rows.length) {
      throw new Error("Cart not found");
    }

    const cartId = cartRes.rows[0].id;

    const itemsRes = await client.query(
      `SELECT 
         ci.*, 
         p.stock,
         p.organization_id
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
      if (!item.product_id) {
        throw new Error("Invalid product in cart");
      }

      if (!item.organization_id) {
        throw new Error(`Product ${item.product_id} missing organization_id`);
      }

      if (!item.price || item.price <= 0) {
        throw new Error(`Invalid price for product ${item.product_id}`);
      }

      if (item.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.product_id}`);
      }
    }

    const grouped = {};

    for (const item of items) {
      const orgId = item.organization_id;

      if (!grouped[orgId]) {
        grouped[orgId] = [];
      }

      grouped[orgId].push(item);
    }

    const createdOrders = [];
    let grandTotal = 0;

    for (const supplierOrgId of Object.keys(grouped)) {
      const supplierItems = grouped[supplierOrgId];

      const totalAmount = supplierItems.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0
      );

      grandTotal += totalAmount;

      const orderRes = await client.query(
        `INSERT INTO orders 
        (user_id, supplier_org_id, total_amount, status, idempotency_key, shipping_address_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [
          userId,
          supplierOrgId,
          totalAmount,
          "pending",
          idempotency_key,
          shippingAddressId,
        ]
      );

      const order = orderRes.rows[0];

      for (const item of supplierItems) {
        await client.query(
          `INSERT INTO order_items 
           (order_id, product_id, quantity, price)
           VALUES ($1, $2, $3, $4)`,
          [order.id, item.product_id, item.quantity, item.price]
        );

        await client.query(
          `UPDATE products 
           SET stock = stock - $1 
           WHERE id = $2`,
          [item.quantity, item.product_id]
        );
      }

      await client.query(
        `INSERT INTO order_status_history (order_id, status)
         VALUES ($1, $2)`,
        [order.id, "pending"]
      );

      createdOrders.push(order);
    }

    await client.query("COMMIT");

    return res.status(201).json({
      message: "Orders created successfully",
      orders: createdOrders,
      totalAmount: grandTotal,
    });
  } catch (err) {
    await client.query("ROLLBACK");

    console.error("Checkout error:", err.message);

    return res.status(500).json({
      message: err.message,
    });
  } finally {
    client.release();
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.*,
        u.full_name AS buyer_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);

    res.json({
      orders: result.rows,
    });
  } catch (err) {
    console.error("GET ORDERS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const orderRes = await pool.query(
      `SELECT * FROM orders WHERE id = $1`,
      [id]
    );

    if (!orderRes.rows.length) {
      return res.status(404).json({ message: "Order not found" });
    }

    const itemsRes = await pool.query(
      `SELECT * FROM order_items WHERE order_id = $1`,
      [id]
    );

    const historyRes = await pool.query(
      `SELECT * FROM order_status_history 
       WHERE order_id = $1 
       ORDER BY changed_at ASC`,
      [id]
    );

    res.json({
      order: orderRes.rows[0],
      items: itemsRes.rows,
      history: historyRes.rows,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const { status } = req.body;

    await client.query("BEGIN");

    const orderRes = await client.query(
      `UPDATE orders 
       SET status = $1 
       WHERE id = $2
       RETURNING *`,
      [String(status).toLowerCase(), id]
    );

    if (!orderRes.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Order not found" });
    }

    await client.query(
      `INSERT INTO order_status_history (order_id, status)
       VALUES ($1, $2)`,
      [id, String(status).toLowerCase()]
    );

    await client.query("COMMIT");

    res.json({
      message: "Order status updated",
      order: orderRes.rows[0],
    });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};

exports.createOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.user.id;

    const {
      items,
      total_amount,
      shipping_address_id,
      supplier_org_id,
      idempotency_key,
    } = req.body;

    await client.query("BEGIN");

    const orderRes = await client.query(
      `INSERT INTO orders 
      (user_id, supplier_org_id, total_amount, status, shipping_address_id, idempotency_key)
      VALUES ($1, $2, $3, 'pending', $4, $5)
      RETURNING *`,
      [
        userId,
        supplier_org_id,
        total_amount,
        shipping_address_id,
        idempotency_key,
      ]
    );

    const order = orderRes.rows[0];

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items 
        (order_id, product_id, quantity, price)
        VALUES ($1, $2, $3, $4)`,
        [order.id, item.product_id, item.quantity, item.price]
      );
    }

    await client.query(
      `INSERT INTO order_status_history (order_id, status)
       VALUES ($1, 'pending')`,
      [order.id]
    );

    await client.query("COMMIT");

    return res.json({
      success: true,
      order,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ message: "Order creation failed" });
  } finally {
    client.release();
  }
};

exports.clearCartAfterOrder = async (userId, client) => {
  const cartRes = await client.query(
    `SELECT id FROM carts WHERE user_id = $1`,
    [userId]
  );

  if (!cartRes.rows.length) return;

  const cartId = cartRes.rows[0].id;

  await client.query(`DELETE FROM cart_items WHERE cart_id = $1`, [cartId]);
};