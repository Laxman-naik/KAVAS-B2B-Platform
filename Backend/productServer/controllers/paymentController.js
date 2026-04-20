const pool = require("../config/db");
const razorpayService = require("../services/razorpayService");
const crypto = require("crypto");

exports.createCheckout = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { orderId } = req.body;

    // 1. Get order
    const orderRes = await pool.query(
      `SELECT * FROM orders WHERE id = $1`,
      [orderId]
    );

    if (!orderRes.rows.length) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderRes.rows[0];

    // 2. Create Razorpay order (use DB amount)
    const razorpayOrder = await razorpayService.createOrder(
      order.total_amount * 100 // convert to paise
    );

    // 3. Store transaction with orderId
    await pool.query(
      `INSERT INTO transactions 
       (user_id, order_id, razorpay_order_id, amount, status)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, order.id, razorpayOrder.id, razorpayOrder.amount, "created"]
    );

    res.json({
      key: process.env.RAZORPAY_KEY_ID,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      dbOrderId: order.id,
    });

  } catch (err) {
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

    // 2. Get transaction
    const txRes = await client.query(
      `SELECT * FROM transactions WHERE razorpay_order_id = $1`,
      [razorpay_order_id]
    );

    if (!txRes.rows.length) {
      throw new Error("Transaction not found");
    }

    const tx = txRes.rows[0];

    // 3. Mark transaction paid
    await client.query(
      `UPDATE transactions 
       SET status = 'paid', razorpay_payment_id = $1
       WHERE razorpay_order_id = $2`,
      [razorpay_payment_id, razorpay_order_id]
    );

    // 4. Update ONLY this order
    await client.query(
      `UPDATE orders 
       SET status = 'confirmed'
       WHERE id = $1`,
      [tx.order_id]
    );

    // 5. Insert history
    await client.query(
      `INSERT INTO order_status_history (order_id, status)
       VALUES ($1, 'confirmed')`,
      [tx.order_id]
    );

    // 6. Clear cart
    await client.query(
      `DELETE FROM cart_items 
       WHERE cart_id IN (
         SELECT id FROM carts WHERE user_id = $1
       )`,
      [tx.user_id]
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