const pool = require("../config/db");
const razorpayService = require("../services/razorpayService");
const { createOrderFromCartInternal } = require("../services/orderService");
const crypto = require("crypto");
/* ================= CREATE CHECKOUT ================= */

exports.createCheckout = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id: userId } = req.user;

    await client.query("BEGIN");

    // 1. Get cart + items (SERVER-SIDE SAFE)
    const cartRes = await client.query(
      `SELECT id FROM carts WHERE user_id = $1`,
      [userId]
    );

    if (!cartRes.rows.length) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Cart not found" });
    }

    const cartId = cartRes.rows[0].id;

    const itemsRes = await client.query(
      `SELECT 
         ci.product_id,
         ci.quantity,
         p.price
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.cart_id = $1`,
      [cartId]
    );

    const items = itemsRes.rows;

    if (!items.length) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 2. Calculate total (SERVER TRUTH)
    const subtotal = items.reduce(
      (acc, item) => acc + Number(item.price) * Number(item.quantity),
      0
    );

    const gst = subtotal * 0.18;
    const total = Math.round((subtotal + gst) * 100); // paise

    // 3. Create order FIRST (PENDING)
    const orderRes = await client.query(
      `INSERT INTO orders (supplier_org_id, total_amount, status)
       VALUES ($1, $2, 'pending')
       RETURNING *`,
      [userId, total / 100]
    );

    const order = orderRes.rows[0];

    // 4. Snapshot order items
    for (let item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.product_id, item.quantity, item.price]
      );
    }

    // 5. Create Razorpay order
    const razorpayOrder = await razorpayService.createOrder(total);

    // 6. Store transaction (idempotent)
    await client.query(
      `INSERT INTO transactions 
       (user_id, razorpay_order_id, amount, status, order_id)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (razorpay_order_id)
       DO UPDATE SET status = EXCLUDED.status`,
      [userId, razorpayOrder.id, total, "created", order.id]
    );

    await client.query("COMMIT");

    res.json({
      key: process.env.RAZORPAY_KEY_ID,
      orderId: razorpayOrder.id,
      amount: total,
      dbOrderId: order.id,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("createCheckout error:", err);
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};

/* ================= VERIFY PAYMENT ================= */

exports.verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RZP_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Invalid payment" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. update order status
    const orderRes = await client.query(
      `UPDATE orders 
       SET status = 'paid'
       WHERE id = $1
       RETURNING id`,
      [razorpay_order_id]
    );

    const orderId = orderRes.rows[0].id;

    // 2. insert status history
    await client.query(
      `INSERT INTO order_status_history (order_id, status)
       VALUES ($1, 'paid')`,
      [orderId]
    );

    await client.query("COMMIT");

    return res.json({
      success: true,
      message: "Payment verified, order confirmed",
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ message: "Payment update failed" });
  } finally {
    client.release();
  }
};

/* ================= WEBHOOK ================= */

exports.handleWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (signature !== expected) {
      return res.status(400).send("Invalid signature");
    }

    const event = req.body;

    if (event.event === "payment.captured") {
      const paymentEntity = event.payload.payment.entity;

      console.log("Webhook payment captured:", paymentEntity.id);
    }

    res.json({ status: "ok" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};