const pool = require("../config/db");
const razorpayService = require("../services/razorpayService");
const { createOrderFromCartInternal } = require("../services/orderService");
const getCart = require("../services/cartService"); // make sure this exists
const crypto = require("crypto");

/* ================= CREATE CHECKOUT ================= */

exports.createCheckout = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const cart = await getCart(userId);

    if (!cart || !cart.items.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const total = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const razorpayOrder = await razorpayService.createOrder(total);

    // prevent duplicate entries (same razorpay_order_id shouldn't exist)
   await pool.query(
  `INSERT INTO transactions 
   (user_id, razorpay_order_id, amount, status)
   VALUES ($1, $2, $3, $4)
   ON CONFLICT (razorpay_order_id)
   DO UPDATE SET
     amount = EXCLUDED.amount,
     status = EXCLUDED.status`,
  [userId, razorpayOrder.id, total, "created"]
);

    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= VERIFY PAYMENT ================= */

exports.verifyPayment = async (req, res) => {
  const client = await pool.connect();

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, } = req.body;

    const isValid = razorpayService.verifyPayment({
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      signature: razorpay_signature,
    });

    // const isValid = true;

    if (!isValid) {
      return res.status(400).json({ message: "Payment failed" });
    }

    await client.query("BEGIN");

    console.log("VERIFY ORDER ID:", razorpay_order_id);

    // lock payment row
    const paymentRes = await client.query(
      `SELECT * FROM transactions 
       WHERE razorpay_order_id = $1 
       FOR UPDATE`,
      [razorpay_order_id]
    );

    if (!paymentRes.rows.length) {
      throw new Error("Payment record not found");
    }

    const payment = paymentRes.rows[0];

    // prevent duplicate order creation
    if (payment.status === "paid") {
      await client.query("ROLLBACK");
      return res.json({ message: "Already processed" });
    }

    // create order AFTER payment
    const orders = await createOrderFromCartInternal(
  client,
  payment.user_id,
  payment.id
);

    // update payment
    await client.query(
  `UPDATE transactions
   SET status = 'paid',
       razorpay_payment_id = $1,
       order_id = $2
   WHERE razorpay_order_id = $3`,
  [razorpay_payment_id, orders[0].id, razorpay_order_id]
);

    await client.query("COMMIT");

    res.json({
      message: "Payment verified & order created",
      orders,
    });

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