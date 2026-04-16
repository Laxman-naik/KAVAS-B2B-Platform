// exports.createOrderFromCart = async (req, res) => {
//   const client = await pool.connect();

//   try {
//     const { id: userId, organization_id } = req.user;
//     const { idempotency_key } = req.body;

//     if (!idempotency_key) {
//       return res.status(400).json({ message: "Idempotency key required" });
//     }

//     await client.query("BEGIN");

//     // ✅ 0. Prevent duplicate orders
//     const existingOrder = await client.query(
//       `SELECT * FROM orders 
//        WHERE buyer_org_id = $1 AND idempotency_key = $2`,
//       [organization_id, idempotency_key]
//     );

//     if (existingOrder.rows.length > 0) {
//       await client.query("ROLLBACK");
//       return res.status(200).json({
//         message: "Duplicate request",
//         orders: existingOrder.rows,
//       });
//     }

//     // ✅ 1. Get cart
//     const cartRes = await client.query(
//       `SELECT id FROM carts WHERE user_id = $1`,
//       [userId]
//     );

//     if (!cartRes.rows.length) {
//       throw new Error("Cart not found");
//     }

//     const cartId = cartRes.rows[0].id;

//     // ✅ 2. Get cart items WITH LOCK (critical)
//     const itemsRes = await client.query(
//       `SELECT ci.*, p.stock 
//        FROM cart_items ci
//        JOIN products p ON p.id = ci.product_id
//        WHERE ci.cart_id = $1
//        FOR UPDATE`,
//       [cartId]
//     );

//     if (!itemsRes.rows.length) {
//       throw new Error("Cart is empty");
//     }

//     const items = itemsRes.rows;

//     // ✅ 3. Stock validation
//     for (const item of items) {
//       if (item.stock < item.quantity) {
//         throw new Error(
//           `Insufficient stock for product ${item.product_id}`
//         );
//       }
//     }

//     // ✅ 4. Group by supplier
//     const grouped = {};
//     for (const item of items) {
//       if (!grouped[item.organization_id]) {
//         grouped[item.organization_id] = [];
//       }
//       grouped[item.organization_id].push(item);
//     }

//     const createdOrders = [];

//     // ✅ 5. Create orders per supplier
//     for (const supplierOrgId in grouped) {
//       const supplierItems = grouped[supplierOrgId];

//       const totalAmount = supplierItems.reduce(
//         (sum, item) => sum + item.price * item.quantity,
//         0
//       );

//       // 👉 Payment hook (placeholder)
//       const payment_status = "pending"; // later integrate Razorpay/Stripe

//       const orderRes = await client.query(
//         `INSERT INTO orders 
//         (buyer_org_id, supplier_org_id, total_amount, status, idempotency_key)
//         VALUES ($1, $2, $3, $4, $5)
//         RETURNING *`,
//         [
//           organization_id,
//           supplierOrgId,
//           totalAmount,
//           payment_status,
//           idempotency_key,
//         ]
//       );

//       const order = orderRes.rows[0];

//       // Insert items
//       for (const item of supplierItems) {
//         await client.query(
//           `INSERT INTO order_items (order_id, product_id, quantity, price)
//            VALUES ($1, $2, $3, $4)`,
//           [order.id, item.product_id, item.quantity, item.price]
//         );

//         // ✅ Reduce stock (critical)
//         await client.query(
//           `UPDATE products 
//            SET stock = stock - $1 
//            WHERE id = $2`,
//           [item.quantity, item.product_id]
//         );
//       }

//       // Status history
//       await client.query(
//         `INSERT INTO order_status_history (order_id, status)
//          VALUES ($1, $2)`,
//         [order.id, "pending"]
//       );

//       createdOrders.push(order);
//     }

//     // ✅ 6. Clear cart AFTER success
//     await client.query(
//       `DELETE FROM cart_items WHERE cart_id = $1`,
//       [cartId]
//     );

//     await client.query("COMMIT");

//     res.status(201).json({
//       message: "Orders created successfully",
//       orders: createdOrders,
//     });

//   } catch (err) {
//     await client.query("ROLLBACK");
//     res.status(500).json({ message: err.message });
//   } finally {
//     client.release();
//   }
// };

const pool = require("../config/db");

// CREATE ORDER FROM CART
exports.createOrderFromCart = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id: userId, organization_id } = req.user;
    const { idempotency_key } = req.body;

    if (!idempotency_key) {
      return res.status(400).json({ message: "Idempotency key required" });
    }

    await client.query("BEGIN");

    // Prevent duplicate
    const existingOrder = await client.query(
      `SELECT * FROM orders 
       WHERE buyer_org_id = $1 AND idempotency_key = $2`,
      [organization_id, idempotency_key]
    );

    if (existingOrder.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(200).json({
        message: "Duplicate request",
        orders: existingOrder.rows,
      });
    }

    // Get cart
    const cartRes = await client.query(
      `SELECT id FROM carts WHERE user_id = $1`,
      [userId]
    );

    if (!cartRes.rows.length) {
      throw new Error("Cart not found");
    }

    const cartId = cartRes.rows[0].id;

    // Get items with lock
    const itemsRes = await client.query(
      `SELECT ci.*, p.stock 
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

    // Stock validation
    for (const item of items) {
      if (item.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for product ${item.product_id}`
        );
      }
    }

    // Group by supplier
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
        (buyer_org_id, supplier_org_id, total_amount, status, idempotency_key)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [
          organization_id,
          supplierOrgId,
          totalAmount,
          "pending",
          idempotency_key,
        ]
      );

      const order = orderRes.rows[0];

      // Insert items + reduce stock
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

      // Status history
      await client.query(
        `INSERT INTO order_status_history (order_id, status)
         VALUES ($1, $2)`,
        [order.id, "pending"]
      );

      createdOrders.push(order);
    }

    // Clear cart
    await client.query(
      `DELETE FROM cart_items WHERE cart_id = $1`,
      [cartId]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Orders created successfully",
      orders: createdOrders,
    });

  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};



// GET USER ORDERS
exports.getUserOrders = async (req, res) => {
  try {
    const { organization_id } = req.user;

    const result = await pool.query(
      `SELECT * FROM orders 
       WHERE buyer_org_id = $1 
       ORDER BY created_at DESC`,
      [organization_id]
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// GET ORDER DETAILS
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



//  UPDATE ORDER STATUS (ADMIN / SUPPLIER)
exports.updateOrderStatus = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const { status } = req.body;

    await client.query("BEGIN");

    await client.query(
      `UPDATE orders SET status = $1 WHERE id = $2`,
      [status, id]
    );

    await client.query(
      `INSERT INTO order_status_history (order_id, status)
       VALUES ($1, $2)`,
      [id, status]
    );

    await client.query("COMMIT");

    res.json({ message: "Order status updated" });

  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};