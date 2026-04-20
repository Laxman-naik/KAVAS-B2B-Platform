const pool = require("../config/db");
const razorpayService = require("../services/razorpayService");
const crypto = require("crypto");

exports.createCheckout = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { orderId } = req.body;

    // 🔴 1. Validate input
    if (!orderId) {
      return res.status(400).json({ message: "OrderId is required" });
    }

    // 🔴 2. Fetch order (WITH ownership check)
    const orderRes = await pool.query(
      `SELECT o.* 
       FROM orders o
       JOIN addresses a ON o.shipping_address_id = a.id
       WHERE o.id = $1 AND a.user_id = $2`,
      [orderId, userId]
    );

    if (!orderRes.rows.length) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderRes.rows[0];

    // 🔴 3. Prevent duplicate payment attempts
    const existingTx = await pool.query(
      `SELECT * FROM transactions 
       WHERE order_id = $1 AND status = 'created'`,
      [orderId]
    );

    if (existingTx.rows.length > 0) {
      return res.json({
        key: process.env.RAZORPAY_KEY_ID,
        orderId: existingTx.rows[0].razorpay_order_id,
        amount: existingTx.rows[0].amount,
        dbOrderId: order.id,
      });
    }

    // 🔴 4. Convert safely to paise
    const amount = Math.round(Number(order.total_amount) * 100);

    if (amount <= 0) {
      return res.status(400).json({ message: "Invalid order amount" });
    }

    // 🔴 5. Create Razorpay order
    const razorpayOrder = await razorpayService.createOrder(amount);

    // 🔴 6. Store transaction
    await pool.query(
      `INSERT INTO transactions 
       (user_id, order_id, razorpay_order_id, amount, status)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, order.id, razorpayOrder.id, amount, "created"]
    );

    res.json({
      key: process.env.RAZORPAY_KEY_ID,
      orderId: razorpayOrder.id,
      amount: amount,
      dbOrderId: order.id,
    });

  } catch (err) {
    console.error("createCheckout error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= VERIFY PAYMENT ================= */

exports.verifyPayment = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // 1. Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RZP_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment" });
    }

    await client.query("BEGIN");

    // 2. Lock transaction row (IMPORTANT)
    const txRes = await client.query(
      `SELECT * FROM transactions 
       WHERE razorpay_order_id = $1
       FOR UPDATE`,
      [razorpay_order_id]
    );

    if (!txRes.rows.length) {
      throw new Error("Transaction not found");
    }

    const tx = txRes.rows[0];

    // 3. IDEMPOTENCY CHECK (critical)
    if (tx.status === "paid") {
      await client.query("ROLLBACK");
      return res.json({ success: true, message: "Already processed" });
    }

    // 4. Update transaction
    await client.query(
      `UPDATE transactions
       SET status = 'paid',
           razorpay_payment_id = $1
       WHERE razorpay_order_id = $2`,
      [razorpay_payment_id, razorpay_order_id]
    );

    // 5. Update order safely
    await client.query(
      `UPDATE orders
       SET status = 'confirmed',
           payment_status = 'paid'
       WHERE id = $1 AND status != 'confirmed'`,
      [tx.order_id]
    );

    // 6. Insert history (avoid duplicates)
    await client.query(
      `INSERT INTO order_status_history (order_id, status)
       SELECT $1, 'confirmed'
       WHERE NOT EXISTS (
         SELECT 1 FROM order_status_history 
         WHERE order_id = $1 AND status = 'confirmed'
       )`,
      [tx.order_id]
    );

    // 7. Cart cleanup (safer version)
    await client.query(
      `DELETE FROM cart_items ci
       USING carts c, orders o
       WHERE ci.cart_id = c.id
       AND o.shipping_address_id = c.user_id
       AND o.id = $1`,
      [tx.order_id]
    );

    await client.query("COMMIT");

    res.json({ success: true });

  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};

/* ================= WEBHOOK ================= */

exports.handleWebhook = async (req, res) => {
  const client = await pool.connect();

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
      const payment = event.payload.payment.entity;

      await client.query("BEGIN");

      // find transaction
      const txRes = await client.query(
        `SELECT * FROM transactions
         WHERE razorpay_payment_id = $1`,
        [payment.id]
      );

      if (!txRes.rows.length) {
        await client.query("ROLLBACK");
        return res.json({ status: "ignored" });
      }

      const tx = txRes.rows[0];

      if (tx.status === "paid") {
        await client.query("ROLLBACK");
        return res.json({ status: "already processed" });
      }

      // update everything (source of truth)
      await client.query(
        `UPDATE transactions SET status = 'paid'
         WHERE id = $1`,
        [tx.id]
      );

      await client.query(
        `UPDATE orders SET status = 'confirmed'
         WHERE id = $1`,
        [tx.order_id]
      );

      await client.query("COMMIT");
    }

    res.json({ status: "ok" });

  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};