// const Razorpay = require("razorpay");

// if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
//   throw new Error("Razorpay keys are missing in environment variables");
// }

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_SECRET,
// });

// const createOrder = async (amount) => {
//   return await razorpay.orders.create({
//     amount,
//     currency: "INR",
//     receipt: `rcpt_${Date.now()}`,
//   });
// };

// module.exports = {
//   createOrder,
// };

const Razorpay = require("razorpay");

/* ======================================================
   Razorpay Service
   Safe initialization for development + production
====================================================== */

let razorpay = null;

/* Check Environment Variables */

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET;

/* Initialize Razorpay Only If Keys Exist */

if (RAZORPAY_KEY_ID && RAZORPAY_SECRET) {
  razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_SECRET,
  });

  console.log("✅ Razorpay Initialized Successfully");
} else {
  console.warn(
    "⚠️ Razorpay keys missing. Payment module disabled."
  );
}

/* ======================================================
   Create Razorpay Order
====================================================== */

const createOrder = async (amount) => {
  try {
    if (!razorpay) {
      throw new Error("Razorpay is not configured");
    }

    if (!amount || amount <= 0) {
      throw new Error("Invalid payment amount");
    }

    const options = {
      amount: Math.round(amount), // amount in paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return order;
  } catch (error) {
    console.error("❌ Razorpay Create Order Error:", error.message);

    throw error;
  }
};

/* ======================================================
   Verify Razorpay Signature
====================================================== */

const crypto = require("crypto");

const verifyPaymentSignature = ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  try {
    if (!RAZORPAY_SECRET) {
      throw new Error("Razorpay secret missing");
    }

    const body =
      razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    return expectedSignature === razorpay_signature;
  } catch (error) {
    console.error(
      "❌ Razorpay Signature Verification Error:",
      error.message
    );

    return false;
  }
};

/* ======================================================
   Refund Payment
====================================================== */

const createRefund = async (paymentId, amount) => {
  try {
    if (!razorpay) {
      throw new Error("Razorpay is not configured");
    }

    const refund = await razorpay.payments.refund(
      paymentId,
      {
        amount: amount || undefined,
      }
    );

    return refund;
  } catch (error) {
    console.error("❌ Refund Error:", error.message);

    throw error;
  }
};

/* ======================================================
   Fetch Payment Details
====================================================== */

const fetchPayment = async (paymentId) => {
  try {
    if (!razorpay) {
      throw new Error("Razorpay is not configured");
    }

    return await razorpay.payments.fetch(paymentId);
  } catch (error) {
    console.error(
      "❌ Fetch Payment Error:",
      error.message
    );

    throw error;
  }
};

/* ======================================================
   Fetch Order Details
====================================================== */

const fetchOrder = async (orderId) => {
  try {
    if (!razorpay) {
      throw new Error("Razorpay is not configured");
    }

    return await razorpay.orders.fetch(orderId);
  } catch (error) {
    console.error(
      "❌ Fetch Order Error:",
      error.message
    );

    throw error;
  }
};

/* ======================================================
   Export
====================================================== */

module.exports = {
  createOrder,
  verifyPaymentSignature,
  createRefund,
  fetchPayment,
  fetchOrder,
};