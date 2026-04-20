const pool = require("../config/db");
const razorpayService = require("../services/razorpayService");
const { createOrderFromCartInternal } = require("../services/orderService");
const crypto = require("crypto");

exports.createCheckout = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // 🔴 1. Create Razorpay order ONLY
    const razorpayOrder = await razorpayService.createOrder(amount);

    // 🔴 2. Store transaction (no DB order creation here)
    await pool.query(
      `INSERT INTO transactions 
       (user_id, razorpay_order_id, amount, status)
       VALUES ($1, $2, $3, $4)`,
      [userId, razorpayOrder.id, amount, "created"]
    );

    res.json({
      key: process.env.RAZORPAY_KEY_ID,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
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

    const { id: userId } = req.user;

    // 🔴 1. Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RZP_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment" });
    }

    await client.query("BEGIN");

    // 🔴 2. Find transaction
    const txRes = await client.query(
      `SELECT * FROM transactions WHERE razorpay_order_id = $1`,
      [razorpay_order_id]
    );

    if (!txRes.rows.length) {
      throw new Error("Transaction not found");
    }

    const tx = txRes.rows[0];

    // 🔴 3. Mark transaction paid
    await client.query(
      `UPDATE transactions 
       SET status = 'paid', razorpay_payment_id = $1
       WHERE razorpay_order_id = $2`,
      [razorpay_payment_id, razorpay_order_id]
    );

    // 🔴 4. Mark ALL user pending orders as confirmed
    await client.query(
      `UPDATE orders 
       SET status = 'confirmed'
       WHERE status = 'pending'
       AND shipping_address_id IN (
         SELECT id FROM addresses WHERE user_id = $1
       )`,
      [userId]
    );

    // 🔴 5. Insert history
    await client.query(
      `INSERT INTO order_status_history (order_id, status)
       SELECT id, 'confirmed' FROM orders WHERE status = 'confirmed'`
    );

    // 🔴 6. Clear cart
    await client.query(
      `DELETE FROM cart_items 
       WHERE cart_id IN (
         SELECT id FROM carts WHERE user_id = $1
       )`,
      [userId]
    );

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Payment verified and order confirmed",
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("verifyPayment error:", err);
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